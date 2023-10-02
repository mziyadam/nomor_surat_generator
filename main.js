const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const path = require('path')
const srv = require('./server')
function handleSetTitle(event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })

  mainWindow.loadFile('src/index.html')
  // mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  //   if (url === 'about:blank') {
  //     return {
  //       action: 'allow',
  //       overrideBrowserWindowOptions: {
  //         frame: false,
  //         fullscreenable: false,
  //         backgroundColor: 'black',
  //         webPreferences: {
  //           preload: 'my-child-window-preload-script.js'
  //         }
  //       }
  //     }
  //   }
  //   return { action: 'deny' }
  // })
}

app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})