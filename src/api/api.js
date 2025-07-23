const API = 'https://discord.com/api/v10';

let doFetch;
if (typeof fetch === 'function') {
  doFetch = fetch.bind(globalThis);
} else {
  const nf = require('node-fetch');
  doFetch = typeof nf === 'function' ? nf : nf.default;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const plural = (n, s, p) => (n === 1 ? s : p);

function shouldPause() {
  return typeof globalThis.__shouldPause === 'function' && globalThis.__shouldPause();
}

function getDiscordHeaders(token) {
  return {
    'Authorization': token,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    'X-Discord-Locale': 'fr',
    'X-Discord-Timezone': 'Europe/Paris',
    'X-Debug-Options': 'bugReporterEnabled',
    'X-Platform': 'Web',
    'X-Super-Properties': Buffer.from(JSON.stringify({
      os: "Windows",
      browser: "Chrome",
      device: "",
      system_locale: "fr-FR",
      browser_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      browser_version: "117.0.0.0",
      os_version: "10",
      referrer: "",
      referring_domain: "",
      referrer_current: "",
      referring_domain_current: "",
      release_channel: "stable",
      client_build_number: 264304,
      client_event_source: null
    })).toString('base64'),
  };
}

async function safeFetch(url, options = {}) {
  const res = await doFetch(url, options);

  if (res.status === 429) {
    const json = await res.json().catch(() => null);
    const wait = json?.retry_after ?? 1;
    console.warn(`429 rate-limit – pause ${wait}s`);
    await sleep(wait * 1000);
    return safeFetch(url, options);
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Discord API ${res.status} – ${txt || res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

const getUserId = (t, s) => safeFetch(`${API}/users/@me`,
  { headers: getDiscordHeaders(t), signal: s })
  .then(j => { if (!j?.id) throw new Error('Token invalide'); return j.id; });

const validateToken = getUserId;
const listGuilds = (t, s) => safeFetch(`${API}/users/@me/guilds`,
  { headers: getDiscordHeaders(t), signal: s });
const listDMs = (t, s) => safeFetch(`${API}/users/@me/channels`,
  { headers: getDiscordHeaders(t), signal: s });
const listGuildChannels = async (t, gid, s) => {
  const chans = await safeFetch(`${API}/guilds/${gid}/channels`,
    { headers: getDiscordHeaders(t), signal: s });
  return chans.filter(c => [0, 2, 5, 10, 11, 12, 13, 15, 16].includes(c.type));
};

const getChannels = (t, mode, id, s) =>
  (mode === 'guild' ? listGuildChannels(t, id, s) : [{ id, name: 'DirectMessage' }]);

async function getUsername(token) {
  try {
    const userInfo = await safeFetch('https://discord.com/api/v10/users/@me', {
      headers: getDiscordHeaders(token)
    });

    if (!userInfo || !userInfo.username) {
      throw new Error('Impossible de récupérer le nom d\'utilisateur');
    }

    return userInfo.username;
  } catch (err) {
    console.error('Erreur dans la récupération du nom d\'utilisateur :', err);
    throw new Error('Erreur lors de la récupération du nom d\'utilisateur');
  }
}

async function fetchMessages(token, channelId, limit, newestFirst, signal) {
  const out = []; let before = null, after = null;
  while (out.length < limit) {
    const url = new URL(`${API}/channels/${channelId}/messages`);
    url.searchParams.set('limit', Math.min(100, limit - out.length));
    if (newestFirst ? after : before) {
      url.searchParams.set(newestFirst ? 'after' : 'before', newestFirst ? after : before);
    }
    const batch = await safeFetch(url, { headers: getDiscordHeaders(token), signal });
    if (!Array.isArray(batch) || !batch.length) break;
    out.push(...batch);
    if (newestFirst) after = batch.at(-1).id; else before = batch.at(-1).id;
    await sleep(600);
  }
  return out;
}

function deleteOwnMessages(opts, log) {
  const {
    token, mode, targetId, channelFilter,
    limit, newestFirst, filters
  } = opts;

  const controller = new AbortController();
  const signal = controller.signal;

  const task = (async () => {
    log('Pré-analyse des paramètres de suppression…', 'info');
    log(`Mode : ${mode} – ID cible : ${targetId}`, 'gray');

    const me = await getUserId(token, signal);

    let channels = await getChannels(token, mode, targetId, signal);
    if (channelFilter) channels = channels.filter(c => c.id === channelFilter);
    log(`${channels.length} ${plural(channels.length, 'salon ciblé', 'salons ciblés')} ` +
      `${plural(channels.length, 'trouvé', 'trouvés')}`, 'gray');

    let total = 0;
    for (const chan of channels) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

      log(`▶ Traitement du salon ${chan.name ? `#${chan.name}` : chan.id}`, 'info');

      let msgs;
      try {
        msgs = await fetchMessages(token, chan.id, limit, newestFirst, signal);
        log(`- ${msgs.length} ${plural(msgs.length, 'message récupéré', 'messages récupérés')}`,
          'gray');
      } catch (err) {
        if (err.message.includes('403')) {
          log('Permission refusée (403) – salon ignoré', 'warn');
          continue;
        }
        throw err;
      }

      for (const m of msgs) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

        while (shouldPause()) await sleep(200);

        if (![0, 2, 19].includes(m.type)) {
          log(`✖ Ignoré type=${m.type} (${m.id})`, 'gray');
          continue;
        }
        if (m.author.id !== me) continue;

        const content = m.content || '';
        const lower = content.toLowerCase();
        const ts = new Date(m.timestamp);

        if (filters.idMin && m.id < filters.idMin) continue;
        if (filters.idMax && m.id > filters.idMax) continue;
        if (filters.dateStart && ts < new Date(filters.dateStart)) continue;
        if (filters.dateEnd && ts > new Date(filters.dateEnd)) continue;

        if (!filters.all) {
          let ok = false;
          if (filters.files && m.attachments?.length) ok = true;
          if (filters.links && /https?:\/\/\S+/.test(content)) ok = true;
          if (filters.texte && m.type === 0) ok = true;
          if (filters.vocaux && m.type === 2) ok = true;
          if (!ok) continue;
        }
        if (filters.keyword?.length &&
          !filters.keyword.some(k => lower.includes(k))) continue;

        try {
          await safeFetch(`${API}/channels/${chan.id}/messages/${m.id}`,
            { method: 'DELETE', headers: getDiscordHeaders(token), signal });
          total++;
          log(`🗑️  Suppression id:${m.id}  |  « ${content || '[embed/attach]'} »`, 'del');
          await sleep(200 + Math.random() * 300);
        } catch (err) {
          if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
          log(`Erreur suppression id:${m.id} → ${err.message}`, 'error');
        }
      }
    }

    log(`Fin : tous les messages ont été parcourus`,
      total === 0 ? 'warn' : 'ok');
    return { total };
  })();

  task.controller = controller;
  return task;
}

module.exports = {
  deleteOwnMessages,
  validateToken,
  listGuilds,
  listDMs,
  getUsername,
  listGuildChannels
};
