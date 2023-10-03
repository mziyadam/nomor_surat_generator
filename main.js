const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const path = require('path')

var express = require('express');
var exp = express();
var sql = require('mssql');
const cookieParser = require("cookie-parser");
const expSession = require("express-session");
const {
  session
} = require('electron')

exp.use(express.json());
exp.use(express.urlencoded({
  extended: true
})); // to support JSON-encoded bodies

exp.use(cookieParser());
exp.use(expSession({
  secret: "st2023st",
  saveUninitialized: true,
  resave: true
}));

exp.post('/logout', function (req, res) {
  req.session.destroy()
  sql.close()
  res.send("Your are logged out ");
})
exp.post('/login', function (req, res) {
  sql.close()
  var param = req.body;
  req.session.user = param.user
  req.session.password = param.password
  req.session.server = param.server
  req.session.database = param.database
  req.session.save()
  var config = {
    user: req.session.user,
    password: req.session.password,
    server: req.session.server,
    database: req.session.database,
    trustServerCertificate: true
  };
  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query("select 1 as ok", function (err, result) {
      res.send(result)
      req.session.loggedIn = 'y'
      req.session.save()
    })
  });
});

exp.get('/', function (req, res) {
  var config = {
    user: req.session.user,
    password: req.session.password,
    server: req.session.server,
    database: req.session.database,
    trustServerCertificate: true
  };

  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query('select * from test', (err, result) => {
      console.dir(result)
      res.send(result);
    })
  });
});

exp.get('/surat', function (req, res) {
  var query = '';
  if (req.query.id) {
    query += "@id = '" + req.query.id + "',";
  }
  if (req.query.no_agenda) {
    query += "@no_agenda = '" + req.query.no_agenda + "',";
  }
  if (req.query.nomor_surat) {
    query += "@nomor_surat = '" + req.query.nomor_surat + "',";
  }
  if (req.query.tanggal_surat) {
    query += "@tanggal_surat = '" + req.query.tanggal_surat + "',";
  }
  if (req.query.tujuan) {
    query += "@tujuan = '" + req.query.tujuan + "',";
  }
  if (req.query.perihal) {
    query += "@perihal = '" + req.query.perihal + "',";
  }
  if (query != '') {
    query = query.substring(0, query.length - 1);
  }

  var config = {
    user: req.session.user,
    password: req.session.password,
    server: req.session.server,
    database: req.session.database,
    trustServerCertificate: true
  };

  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query(`exec GetSurat ${query}`, (err, result) => {
      console.dir(result)
      res.send(result);
    })
  });
});

exp.post('/test-post', function (req, res) {
  var param = req.body;
  res.send(param);
});


exp.get('/tim', function (req, res) {
  var config = {
    user: req.session.user,
    password: req.session.password,
    server: req.session.server,
    database: req.session.database,
    trustServerCertificate: true
  };

  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query("select * from tim", (err, result) => {
      console.dir(result)
      res.send(result);
    })
  });
});
exp.get('/klasifikasi', function (req, res) {
  var config = {
    user: req.session.user,
    password: req.session.password,
    server: req.session.server,
    database: req.session.database,
    trustServerCertificate: true
  };

  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query("select * from klasifikasi", (err, result) => {
      console.dir(result)
      res.send(result);
    })
  });
});

exp.get('/main', function (req, res) {
  res.send(req.session.loggedIn)
  // r.send('tes')
});

exp.post('/generate-surat', function (req, res) {
  var param = req.body;
  var config = {
    user: req.session.user,
    password: req.session.password,
    server: req.session.server,
    database: req.session.database,
    trustServerCertificate: true
  };

  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query(`exec AddSurat @nomor_surat = '${param.nomor_surat}', @tujuan='${param.tujuan}', @perihal='${param.perihal}', @jumlah=${param.jumlah}`, (err, result) => {
      console.dir(result)
      res.send(result);
    });
  });
});

var server = exp.listen(5000, function () {
  console.log('Server is running..');
});

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
  // const ses = session.fromPartition('persist:name')
  const child = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false
  })
  child.loadFile('src/koneksi/konek.html')
  if (session.loggedIn == null || session.loggedIn == undefined) {
    // window.open('src/koneksi/konek.html', 'modal')
    child.once('ready-to-show', () => {
      child.show()
    })
  }
  console.log(session.loggedIn)
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