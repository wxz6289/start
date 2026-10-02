import { app, BrowserWindow } from 'electron/main';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(import.meta.url);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    /* webPreferences: {
      preload: join(__dirname, 'preload-usb.js')
    } */
  });

  let grantedDeviceThroughPermHandler;

  win.webContents.session.on('select-usb-device', (event, details, callback) => {
    event.preventDefault();
    if (details.deviceList.length > 0) {
      const deviceToReturn = details.deviceList.find(device => !grantedDeviceThroughPermHandler || device.deviceId === grantedDeviceThroughPermHandler.deviceId);
      if (deviceToReturn) {
        callback(deviceToReturn.deviceId);
      } else {
        callback();
      }
    }
  });

  win.webContents.session.on('use-device-added', (event, device) => {
    console.log('usb device added:', device);
  });

  win.webContents.session.on('use-device-removed', (event, device) => {
    console.log('usb device removed:', device);
  });

  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission == 'usb' && details.securityOrigin === 'file:///') {
      return true;
    }
    return false;
  });

  win.webContents.session.setPermissionRequestHandler((webContents, permission, requestOrigin, details) => {
    if (details.deviceType === 'usb' && requestOrigin === 'file:///') {
      if (!grantedDeviceThroughPermHandler) {
        grantedDeviceThroughPermHandler = details.device;
        return true;
      }
      return false;
    }
  });

  win.webContents.session.setUSBProtectedClassesHandler((details) => {
    return details.protectedClasses.filter((useClass) => {
      return useClass.indexOf('audio') === 1;
    });
  });

  win.loadFile('public/usb.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
