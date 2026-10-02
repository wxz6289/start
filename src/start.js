// const { app, BrowserWindow } = require('electron/main');
import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron/main';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
// import * as updateElectronApp from 'update-electron-app'

// updateElectronApp();

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/* app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('public/index.html');
}); */

function handleSetTitle(event, title) {
  /* const focusedWindow = BrowserWindow.getFocusedWindow();
   if (focusedWindow) {
    focusedWindow.setTitle(title);
  } */
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

async function handleOpenFile(event) {
  const result = await dialog.showOpenDialog({
    properties: ['openFile']
  });
  if (result.canceled) return;
  const filePath = result.filePaths[0];
  return filePath;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    devTools: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    }
  });

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    }
  ])
  // Menu.setApplicationMenu(menu);
  // mainWindow.loadFile('app/dist/index.html');
  mainWindow.loadURL('http://localhost:5173');
  return mainWindow;
}
app.whenReady().then(() => {
  let mainWindow = createWindow();

  ipcMain.handle('ping', () => 'pong');
  ipcMain.on('set-title', handleSetTitle);
  ipcMain.handle('open-file', handleOpenFile);
  ipcMain.on('counter-value', (event, value) => {
    console.log(`Counter value received: ${value}`);
  });

  ipcMain.on('port', ({ ports: [port] }) => {
    port.on('message', (event) => {
      console.log(`Port message received: ${event.data}`);
    });
    port.start();
    port.postMessage('Hello from main process!');
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
  mainWindow.webContents.send('custom_click', 'Hello from main process!');
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
