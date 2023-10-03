const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const path = require('path')
const srv = require('./server')
const {
  session
} = require('electron')


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
  
  const child = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false
  })
  child.loadFile('src/koneksi/konek.html')
  if (session.loggedIn == null || session.loggedIn == undefined) {
    child.once('ready-to-show', () => {
      child.show()
    })
  }
  console.log(session.loggedIn)
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