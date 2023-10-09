
var express = require('express');
var exp = express();
var sql = require('mssql');
const cookieParser = require("cookie-parser");
// const expSession = require("express-session");

exp.use(express.json());
exp.use(express.urlencoded({
  extended: true
})); // to support JSON-encoded bodies

exp.use(cookieParser());
// exp.use(expSession({
//   secret: "st2023st",
//   saveUninitialized: true,
//   resave: true
// }));

exp.post('/logout', async function (req, res) {
  // req.session.destroy()
  res.clearCookie('user');
  res.clearCookie('password');
  res.clearCookie('server');
  res.clearCookie('database');
  res.clearCookie('loggedIn');
  sql.close()
  res.send("Your are logged out ");
})
exp.post('/login', async function (req, res) {
  sql.close()
  var param = req.body;
  // req.session.user = param.user
  // req.session.password = param.password
  // req.session.server = param.server
  // req.session.database = param.database
  // req.session.save()
  req.cookies.user = param.user
  req.cookies.password = param.password
  req.cookies.server = param.server
  req.cookies.database = param.database
  // res.cookie('user', param.user);
  // res.cookie('password', param.password);
  // res.cookie('server', param.server);
  // res.cookie('database', param.database);
  
  // res.send(req.cookies)
  var config = {
    user: await req.cookies['user'],
    password: await req.cookies['password'],
    server: await req.cookies['server'],
    database: await req.cookies['database'],
    trustServerCertificate: true
  };
  // var config = {
  //   user: req.session.user,
  //   password: req.session.password,
  //   server: req.session.server,
  //   database: req.session.database,
  //   trustServerCertificate: true
  // };
  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query("select 1 as ok", function (err, result) {
      req.cookies.loggedIn='y';
      res.send(result)
      // req.session.loggedIn = 'y'
      // req.session.save()
    })
  });
});

exp.get('/', async function (req, res) {
  res.send('welcome');
});

exp.get('/surat', async function (req, res) {
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
    user:  await req.cookies['user'],
    password:  await req.cookies['password'],
    server:  await req.cookies['server'],
    database:  await req.cookies['database'],
    trustServerCertificate: true
  };
  // var config = {
  //   user: req.session.user,
  //   password: req.session.password,
  //   server: req.session.server,
  //   database: req.session.database,
  //   trustServerCertificate: true
  // };

  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query(`exec GetSurat ${query}`, (err, result) => {
      console.dir(result)
      res.send(result);
    })
  });
});

exp.get('/tim', async function (req, res) {
  
  var config = {
    user:  await req.cookies['user'],
    password:  await req.cookies['password'],
    server:  await req.cookies['server'],
    database:  await req.cookies['database'],
    trustServerCertificate: true
  };
  // var config = {
  //   user: req.session.user,
  //   password: req.session.password,
  //   server: req.session.server,
  //   database: req.session.database,
  //   trustServerCertificate: true
  // };

  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query("select * from tim", (err, result) => {
      console.dir(result)
      res.send(result);
    })
  });
});
exp.get('/klasifikasi', async function (req, res) {
  
  var config = {
    user:  await req.cookies['user'],
    password:  await req.cookies['password'],
    server:  await req.cookies['server'],
    database:  await req.cookies['database'],
    trustServerCertificate: true
  };
  // var config = {
  //   user: req.session.user,
  //   password: req.session.password,
  //   server: req.session.server,
  //   database: req.session.database,
  //   trustServerCertificate: true
  // };

  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query("select * from klasifikasi", (err, result) => {
      console.dir(result)
      res.send(result);
    })
  });
});

exp.get('/main', async function (req, res) {
  res.send(req.cookies['loggedIn'])
  // res.send(req.session.loggedIn)
  // r.send('tes')
});

exp.post('/generate-surat', async function (req, res) {
  var param = req.body;
  
  var config = {
    user:  await req.cookies['user'],
    password:  await req.cookies['password'],
    server:  await req.cookies['server'],
    database:  await req.cookies['database'],
    trustServerCertificate: true
  };
  // var config = {
  //   user: req.session.user,
  //   password: req.session.password,
  //   server: req.session.server,
  //   database: req.session.database,
  //   trustServerCertificate: true
  // };

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