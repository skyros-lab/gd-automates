const { contextBridge, ipcRenderer } = require('electron');

try {
  const {
    deleteOwnMessages: deleteOwnMessagesFn,
    validateToken,
    listGuilds,
    listDMs,
    listGuildChannels
  } = require('./api.js');

  console.log('[PRELOAD] api.js chargé OK');

  let currentController = null;

  let pauseGetter = () => false;
  function setPauseGetter(fn) { pauseGetter = fn; }
  globalThis.__shouldPause = () => pauseGetter();

  function deleteOwnMessages(opts, logBridge) {
    const task = deleteOwnMessagesFn(opts, logBridge);
    currentController = task.controller || null;
    task.finally(() => { currentController = null; });
    return task;
  }

  function stopCurrentProcess() {
    if (currentController) {
      if (!currentController.signal.aborted) {
        try { currentController.abort(); } catch { }
      }
      currentController = null;
      return true;
    }
    return false;
  }

  contextBridge.exposeInMainWorld('electronAPI', {
    deleteOwnMessages,
    stopCurrentProcess,
    setPauseGetter,
    validateToken,
    listGuilds,
    listDMs,
    listGuildChannels,
    error: (title, msg) => ipcRenderer.invoke('show-error', title, msg)
  });

  console.log('[PRELOAD] electronAPI exposé');
} catch (e) {
  console.error('[PRELOAD] ERREUR lors du require api.js :', e);
}
