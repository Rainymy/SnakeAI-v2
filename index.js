const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev') ?? false;

if (require('electron-squirrel-startup')) { app.quit(); }

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: isDev ? 1200 : 650,
    height: 700,
    icon: path.join(__dirname, "/favicon.png"),
    removeMenu: true,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true
    }
  });
  // Remove Menu Bar.
  mainWindow.setMenuBarVisibility(false);
  
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  if (isDev) { mainWindow.webContents.openDevTools(); }
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { createWindow(); }
});
