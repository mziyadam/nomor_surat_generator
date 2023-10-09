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

const fs = require('fs');
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
    icon: path.join(__dirname, '/src/logo.jpg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false
    },
    maximizable: false,
    // frame: false,
    resizable: false,
  })

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
  mainWindow.loadFile('src/index.html')

  const child = new BrowserWindow({
    icon: path.join(__dirname, '/src/logo.jpg'),
    parent: mainWindow,
    width: 800,
    height: 200,
    modal: true,
    show: false,
    maximizable: false,
    resizable: false,
  })
  child.loadFile('src/koneksi/konek.html')

  // Open file setting.json in read mode
  // fs.open('setting.json', 'r', function (err, f) {
  //     console.log('Saved!');
  // });
  const data = fs.readFileSync('./setting.json', {
    encoding: 'utf8',
    flag: 'r'
  });
  if (data == "") {
    child.once('ready-to-show', () => {
      child.show()
    })
  } else {
    const jsonData = JSON.parse(data);
    // Display data
    // console.log(jsonData.user);
    // if (session.loggedIn == null || session.loggedIn == undefined) {
    if (jsonData.user == null || jsonData.user == undefined ||
      jsonData.password == null || jsonData.password == undefined ||
      jsonData.database == null || jsonData.database == undefined ||
      jsonData.server == null || jsonData.server == undefined) {
      child.once('ready-to-show', () => {
        child.show()
      })
    }
  }
  mainWindow.webContents.setWindowOpenHandler(({
    url
  }) => {
    // if (url === 'about:blank') {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        maximizable: false,
        resizable: false,
        icon: path.join(__dirname, '/src/logo.jpg'),
        // backgroundColor: 'black',
        // webPreferences: {
        //   preload: 'my-child-window-preload-script.js'
        // }
      }
      // }
    }
    return {
      action: 'deny'
    }
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