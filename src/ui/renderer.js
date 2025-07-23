if (!window.electronAPI?.deleteOwnMessages) {
  alert('electronAPI.deleteOwnMessages introuvable');
  throw new Error('electronAPI indisponible');
}
console.log('%c✔ electronAPI disponible', 'color:#4caf50;font-weight:bold;');

window.electronAPI.setProcessFlag(false);

const $ = q => document.querySelector(q);

const STATUS = $('#tokenStatus');
const guildRow = $('#guildRow'); const guildSel = $('#dGuild');
const dmRow = $('#dmRow'); const dmSel = $('#dDm');
const chanRow = $('#chanRow'); const chanSel = $('#dChannel');
const logArea = $('#logArea');
let tokenTimer;

let isPaused = false;
window.electronAPI.setPauseGetter(() => isPaused);

const show = el => (el.hidden = false);
const hide = el => (el.hidden = true);
const clear = el => (el.innerHTML = '');
const plural = (n, s, p) => (n === 1 ? s : p);
const tokenValid = () => STATUS.classList.contains('ok');
const setModeState = ok => ($('#dMode').disabled = !ok);

const copyBtn = $('#copyLogBtn');

function updateCopyBtnState() {
  const isEmpty = !logArea.textContent.trim();
  copyBtn.classList.toggle('disabled', isEmpty);
}

const colors = {
  info: '#03a9f4', warn: '#ffc107', error: '#f44336',
  ok: '#4caf50', del: '#e91e63', gray: '#9e9e9e', log: '#fff'
};

function rawUiLog(message, level = 'log') {
  const t = new Date().toLocaleTimeString();
  const c = colors[level] || colors.log;
  const line = document.createElement('div');
  line.innerHTML = `<span style="color:${c}">[${t}] ${message}</span>`;
  logArea.appendChild(line);
  logArea.scrollTop = logArea.scrollHeight;
  console.log(`%c[${t}] ${message}`, `color:${c}`);
}

const uiLog = (msg, lvl = 'log') => { rawUiLog(msg, lvl); updateCopyBtnState(); };

setModeState(false);
hide(guildRow); hide(dmRow); hide(chanRow);

$('#dToken').addEventListener('input', () => {
  STATUS.textContent = ''; STATUS.className = 'status';
  $('#dStart').disabled = true; setModeState(false);
  hide(guildRow); hide(dmRow); hide(chanRow);
  clearTimeout(tokenTimer);

  tokenTimer = setTimeout(async () => {
    const token = $('#dToken').value.trim();
    if (!token) return;
    STATUS.textContent = 'Vérification du token…';

    try {
      await window.electronAPI.validateToken(token);
      STATUS.textContent = 'Le token est valide'; STATUS.classList.add('ok');
      setModeState(true); $('#dStart').disabled = false;
      uiLog('Token validé avec succès', 'ok');
      await populateLists(token);
    } catch (err) {
      STATUS.textContent = 'Le token est invalide'; STATUS.classList.add('fail');
      uiLog(`Échec validation token : ${err.message}`, 'error');
    }
  }, 5000);
});

async function populateLists(token) {
  uiLog('Récupération des serveurs et DMs…', 'info');

  const guilds = await window.electronAPI.listGuilds(token);
  const dms = await window.electronAPI.listDMs(token);

  clear(guildSel);
  guilds.forEach(g =>
    guildSel.insertAdjacentHTML('beforeend', `<option value="${g.id}">${g.name}</option>`));
  clear(dmSel);
  dms.forEach(c => {
    const lbl = c.recipients ? c.recipients.map(r => r.username).join(', ') : (c.name || c.id);
    dmSel.insertAdjacentHTML('beforeend', `<option value="${c.id}">${lbl}</option>`);
  });

  uiLog(`Chargé : ${guilds.length} ${plural(guilds.length, 'serveur', 'serveurs')} • ` +
    `${dms.length} DM`, 'gray');
  onModeChange();
}

$('#dMode').addEventListener('change', onModeChange);
async function onModeChange() {
  if ($('#dMode').value === 'guild') {
    show(guildRow); hide(dmRow);
    uiLog('Mode sélectionné : Serveur', 'info');
    await fillChannels();
  } else {
    hide(guildRow); show(dmRow); hide(chanRow);
    uiLog('Mode sélectionné : DM', 'info');
  }
}

guildSel.addEventListener('change', () => {
  uiLog(`Serveur sélectionné : ${guildSel.options[guildSel.selectedIndex]?.textContent}`, 'info');
  fillChannels();
});
dmSel.addEventListener('change', () => {
  uiLog(`DM sélectionné : ${dmSel.options[dmSel.selectedIndex]?.textContent}`, 'info');
});
chanSel.addEventListener('change', () => {
  const txt = chanSel.value
    ? `Salon ciblé : ${chanSel.options[chanSel.selectedIndex].textContent}`
    : 'Tous les salons';
  uiLog(txt, 'info');
});

async function fillChannels() {
  const token = $('#dToken').value.trim();
  const gid = guildSel.value;
  if (!token || !gid) return hide(chanRow);

  uiLog('Récupération des salons…', 'info');
  const chans = await window.electronAPI.listGuildChannels(token, gid);
  clear(chanSel);
  chanSel.insertAdjacentHTML('beforeend', `<option value="">Tous les salons</option>`);
  chans.forEach(c =>
    chanSel.insertAdjacentHTML('beforeend', `<option value="${c.id}">#${c.name}</option>`));

  uiLog(`${chans.length} ${plural(chans.length, 'salon chargé', 'salons chargés')}`, 'gray');
  show(chanRow);
}

const updateAllToggle = () => {
  const any = ['#fFiles', '#fLinks', '#fText', '#fVoice'].some(id => $(id).checked);
  $('#fAll').checked = !any;
};
['fAll', 'fFiles', 'fLinks', 'fText', 'fVoice'].forEach(id => {
  $('#' + id).addEventListener('change', e => {
    if (id === 'fAll' && e.target.checked)
      ['#fFiles', '#fLinks', '#fText', '#fVoice'].forEach(s => $(s).checked = false);
    updateAllToggle();
  });
});
updateAllToggle();

$('#deleteForm').addEventListener('submit', e => {
  const dStart = $('#dateStart').value;
  const dEnd = $('#dateEnd').value;
  const min = new Date('2000-01-01'), max = new Date('2100-12-31');

  if (dStart && (new Date(dStart) < min || new Date(dStart) > max)) {
    e.preventDefault(); alert('Date de début hors plage 2000‑2100'); return;
  }
  if (dEnd && (new Date(dEnd) < min || new Date(dEnd) > max)) {
    e.preventDefault(); alert('Date de fin hors plage 2000‑2100'); return;
  }
}, { once: true });

let currentProcess = false;
const setRunning = flag => {
  $('#dStart').disabled = flag || !tokenValid();
  $('#dStop').disabled = !flag;
  $('#dPause').disabled = !flag;
  $('#dToken').disabled = flag;
  $('#dMode').disabled = flag ? true : $('#dMode').disabled;

  if (!flag) {
    $('#dPause').className = 'pause';
    $('#dPause').textContent = 'Suspendre temporairement';
    isPaused = false;
  }
};

$('#deleteForm').addEventListener('submit', async e => {
  e.preventDefault();
  if (!tokenValid()) return uiLog('Le token spécifié n\'est pas vérifié', 'error');
  if (currentProcess) return uiLog('Un processus est déjà actif pour lancer le programme.', 'warn');

  setRunning(true);
  window.electronAPI.setProcessFlag(true);
  logArea.innerHTML = '';
  updateCopyBtnState();
  uiLog('=== Lancement du processus de suppression ===', 'info');

  const filters = {
    all: $('#fAll').checked,
    files: $('#fFiles').checked,
    links: $('#fLinks').checked,
    texte: $('#fText').checked,
    vocaux: $('#fVoice').checked,
    dateStart: $('#dateStart').value || null,
    dateEnd: $('#dateEnd').value || null,
    idMin: $('#idMin').value.trim() || null,
    idMax: $('#idMax').value.trim() || null,
    keyword: $('#keyword').value
      .trim().toLowerCase()
      .split(/\s*,\s*|\s+/).filter(Boolean) || null
  };
  if (filters.files || filters.links) filters.all = false;

  const opts = {
    token: $('#dToken').value.trim(),
    mode: $('#dMode').value,
    targetId: $('#dMode').value === 'guild' ? $('#dGuild').value : $('#dDm').value,
    channelFilter: ($('#dMode').value === 'guild' && $('#dChannel').value)
      ? $('#dChannel').value : null,
    limit: parseInt($('#dLimit').value, 10) || 100,
    newestFirst: $('#dOrder').value === 'new',
    filters
  };

  const task = window.electronAPI.deleteOwnMessages(opts, uiLog);
  currentProcess = true;

  task
    .then(({ total }) => {
      uiLog(
        total === 0
          ? 'Aucun message supprimé'
          : `${total} message${total > 1 ? 's' : ''} supprimé${total > 1 ? 's' : ''} ✔`,
        total === 0 ? 'warn' : 'ok'
      );
    })
    .catch(err => {
      const msg = typeof err === 'string' ? err : err?.message || err?.stack || '';
      const aborted =
        err?.name === 'AbortError' ||
        err instanceof DOMException ||
        /signal.*aborted/i.test(msg) ||
        /aborted without reason/i.test(msg) ||
        /the user aborted a request/i.test(msg);

      if (aborted) {
        uiLog('Le processus a correctement été stoppé.', 'ok');
      } else {
        uiLog('Le processus a correctement été stoppé.', 'ok');
      }
    })
    .finally(() => {
      currentProcess = false;
      setRunning(false);
      window.electronAPI.setProcessFlag(false);
      uiLog('=== Processus terminé ===', 'info');
    });
});

$('#dStop').onclick = () => {
  if (!currentProcess) return uiLog('Aucun processus actif pour stopper le programme.', 'error');

  try {
    const ok = window.electronAPI.stopCurrentProcess();
    if (ok) {
      isPaused = false;
      $('#dPause').className = 'pause';
      $('#dPause').textContent = 'Suspendre temporairement';
      window.electronAPI.setProcessFlag(false);
    } else {
      uiLog('Aucun processus à interrompre', 'error');
    }
  } catch (err) {
    const aborted = err?.name === 'AbortError' ||
      /signal.*aborted/i.test(err?.message || '');
    if (!aborted) {
      const msg = typeof err === 'string' ? err :
        err?.message || err?.stack || 'Erreur inconnue';
      uiLog(`Erreur lors de l’annulation : ${msg}`, 'error');
    }
  }
};

$('#dPause').onclick = () => {
  if (!currentProcess) return uiLog('Aucun processus actif', 'error');

  isPaused = !isPaused;
  if (isPaused) {
    $('#dPause').className = 'resume';
    $('#dPause').textContent = 'Reprendre le processus';
    uiLog('Le processus est temporairement suspendu.', 'ok');
  } else {
    $('#dPause').className = 'pause';
    $('#dPause').textContent = 'Suspendre temporairement';
    uiLog('Le processus a repris son cours.', 'ok');
  }
};

copyBtn.addEventListener('click', () => {
  if (copyBtn.classList.contains('disabled') || copyBtn.classList.contains('cooldown')) return;

  const text = Array.from(logArea.children).map(el => el.textContent.trimEnd()).join('\n');
  navigator.clipboard.writeText(text).then(() => {
    const original = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
    copyBtn.classList.add('cooldown');
    uiLog('Contenu du log copié dans le presse-papier.', 'ok');
    setTimeout(() => {
      copyBtn.innerHTML = original;
      copyBtn.classList.remove('cooldown');
    }, 5000);
  }).catch(err => uiLog(`Erreur lors de la copie : ${err.message}`, 'error'));
});

const streamerToggle = $('#streamerToggle');
let streamerModeEnabled = false;

streamerToggle.addEventListener('click', () => {
  streamerModeEnabled = !streamerModeEnabled;
  logArea.classList.toggle('streamer-mode', streamerModeEnabled);

  const eyeOpen = `
<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
  <title>eye</title><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9
  M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17
  M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12
  C21.27,7.61 17,4.5 12,4.5Z"/></svg>`;
  const eyeClosed = `
<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
  <title>eye-off</title><path d="M2,4.27L4.28,6.55
  L4.73,7C3.08,8.3 1.78,10 1,12
  C2.73,16.39 7,19.5 12,19.5
  C13.55,19.5 15.03,19.2 16.38,18.66
  L19.73,22L21,20.73L3.27,3M9.08,11.35
  C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15
  C12.22,15 12.44,14.97 12.65,14.92
  L14.2,16.47C13.53,16.8 12.79,17 12,17
  A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8
  L9.08,11.35M12,7A5,5 0 0,1 17,12
  C17,12.64 16.87,13.26 16.64,13.82
  L19.57,16.75
  C21.07,15.5 22.27,13.86 23,12
  C21.27,7.61 17,4.5 12,4.5
  C10.6,4.5 9.26,4.75 8,5.2
  L10.17,7.35C10.74,7.13 11.35,7 12,7Z"/></svg>`;

  streamerToggle.innerHTML = streamerModeEnabled ? eyeClosed : eyeOpen;
  uiLog(`Mode streamer ${streamerModeEnabled ? 'activé' : 'désactivé'}`, 'info');
});
