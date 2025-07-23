const { app, BrowserWindow, ipcMain, dialog, Tray, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

if (!app.requestSingleInstanceLock()) app.quit();

let mainWin;
let tray = null;
let isQuiting = false;
let isProcessing = false;

function iconPath() {
  const base = path.join(__dirname, '../../assets');
  return process.platform === 'win32'
    ? path.join(base, 'icon.ico')
    : process.platform === 'darwin'
      ? path.join(base, 'icon.icns')
      : path.join(base, 'icon.png');
}

function createWindow() {
  mainWin = new BrowserWindow({
    width: 820,
    height: 680,
    minWidth: 600,
    minHeight: 500,
    resizable: true,
    center: true,
    title: 'Discord Automation GUI',
    icon: iconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      devTools: true
    }
  });

  mainWin.setMenu(null);

  mainWin.loadFile(path.resolve(__dirname, '../ui/index.html'));


  mainWin.on('close', async (e) => {
    if (isQuiting) return;

    e.preventDefault();

    if (isProcessing) {
      const { response } = await dialog.showMessageBox(mainWin, {
        type: 'warning',
        title: 'Processus en cours',
        message: 'Un processus est toujours actif. Voulez‑vous vraiment quitter ?',
        buttons: ['Annuler', 'Quitter'],
        defaultId: 0,
        cancelId: 0
      });

      if (response === 1) {
        isQuiting = true;
        app.quit();
      }
    } else {
      isQuiting = true;
      app.quit();
    }
  });

  mainWin.on('closed', () => { mainWin = null; });

  tray = new Tray(iconPath());
  tray.setToolTip('Discord Automation GUI');

  const buildContextMenu = () => {
    const visible = mainWin && mainWin.isVisible();
    const toggleLabel = visible ? 'Cacher la fenêtre en cours' : 'Afficher la fenêtre en cours';

    return Menu.buildFromTemplate([
      {
        label: 'Discord GUI',
        icon: path.join(__dirname, '../../assets/icon-menu.png'),
        enabled: false
      },
      { type: 'separator' },
      {
        label: toggleLabel,
        click: () => {
          if (!mainWin) return;
          visible ? mainWin.hide() : mainWin.show();
          mainWin.focus();
          tray.setContextMenu(buildContextMenu());
        }
      },
      {
        label: 'Redémarrer l’application',
        click: async () => {
          if (isProcessing) {
            const { response } = await dialog.showMessageBox(mainWin, {
              type: 'warning',
              title: 'Processus en cours',
              message: 'Un processus est toujours actif. Voulez‑vous vraiment redémarrer ?',
              buttons: ['Annuler', 'Redémarrer'],
              defaultId: 0,
              cancelId: 0
            });

            if (response !== 1) return;
          }

          isQuiting = true;
          app.relaunch();
          app.exit();
        }
      },
      { type: 'separator' },
      {
        label: 'À propos de cette application',
        click: () => {
          dialog.showMessageBox({
            type: 'info',
            title: 'À propos de cette application',
            message:
              `Ce programme open-source propose des automatismes sûrs pour le réseau social Discord à des fins éthiques et d'apprentissage uniquement. Version de l'application : ${app.getVersion()}.\n\nContact : skyros.id (1294960386373849150).`
          });
        }
      },
      {
        label: 'Contribuer au projet',
        click: () => {
          require('electron').shell.openExternal('https://github.com/skyros-lab/gd-automates');
        }
      },
      { type: 'separator' },
      {
        label: 'Quitter l’application',
        click: async () => {
          if (isProcessing) {
            const { response } = await dialog.showMessageBox(mainWin, {
              type: 'warning',
              title: 'Processus en cours',
              message: 'Un processus est toujours actif. Voulez‑vous vraiment quitter ?',
              buttons: ['Annuler', 'Quitter'],
              defaultId: 0,
              cancelId: 0
            });

            if (response !== 1) return;
          }

          isQuiting = true;
          app.quit();
        }
      }
    ]);
  };

  tray.setContextMenu(buildContextMenu());

  tray.on('click', () => {
    if (!mainWin) return;
    mainWin.isVisible() ? mainWin.hide() : mainWin.show();
    mainWin.focus();
    tray.setContextMenu(buildContextMenu());
  });

  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify().catch(() => { });
  }
}

app.on('second-instance', () => {
  if (mainWin) {
    if (mainWin.isMinimized()) mainWin.restore();
    mainWin.show(); mainWin.focus();
  }
});

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('set-process-flag', (_, flag) => {
  isProcessing = !!flag;
});

ipcMain.handle('show-error', (_, title, message) => {
  dialog.showErrorBox(title, message);
});
