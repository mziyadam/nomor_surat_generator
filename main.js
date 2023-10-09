const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = require('electron')
const path = require('path')
const srv = require('./server')
const {
  session
} = require('electron')

Menu.setApplicationMenu(false)

function handleSetTitle(event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    icon:path.join(__dirname, '/src/logo.jpg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false
    },
    maximizable: false,
    resizable: false,
  })

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
  mainWindow.loadFile('src/index.html')

  const child = new BrowserWindow({
    icon:path.join(__dirname, '/src/logo.jpg'),
    parent: mainWindow,
    modal: true,
    show: false,
    maximizable: false,
    resizable: false,
  })
  child.loadFile('src/koneksi/konek.html')
  session.defaultSession.cookies.get(
    // {}
    { name: 'loggedIn' }
    )
  .then((cookies) => {
    console.log(cookies[0].value)
    // if(cookies[0].value==null||cookies[0].value==undefined){
    //   child.once('ready-to-show', () => {
    //     child.show()
    //   })
    // }
  }).catch((error) => {
    console.log(error)
    child.once('ready-to-show', () => {
      child.show()
    })
    // child.once('ready-to-show', () => {
    //   child.show()
    // })
  })
  // if (session.loggedIn == null || session.loggedIn == undefined) {
  //   child.once('ready-to-show', () => {
  //     child.show()
  //   })
  // }
  // console.log(cookies.loggedIn)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // if (url === 'about:blank') {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          maximizable: false,
          resizable: false,
          icon:path.join(__dirname, '/src/logo.jpg'),
          // backgroundColor: 'black',
          // webPreferences: {
          //   preload: 'my-child-window-preload-script.js'
          // }
        }
      // }
    }
    return { action: 'deny' }
  })
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
