var express = require('express');
var app = express();
// var sql = require('mssql/msnodesqlv8');
var sql = require('mssql');

const cookieParser = require("cookie-parser");

const session = require("express-session");
// const pool = new sql.ConnectionPool({
//     database: 'st2023',
//     server: 'LAPTOP-HTLEJA3V',
//     driver: 'msnodesqlv8',
//     options: {
//         trustedConnection: true
//     }
// })
// var bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded({
    extended: true
})); // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 
app.use(cookieParser());

app.use(session({
    secret: "st2023st",
    saveUninitialized: true,
    resave: true
}));

// var pool = new sql.ConnectionPool({
//     user: 'stadmin',
//     password: 'bismillah',
//     server: 'LAPTOP-HTLEJA3V',
//     database: 'st2023',
//     trustServerCertificate: true
// });
// pool.connect();
// pool.disconnect();
app.post('/logout', function (req, res) {
    req.session.destroy()
    sql.close()
    res.send("Your are logged out ");
})
app.post('/login', function (req, res) {

    sql.close()
    var param = req.body;
    // var pool = new sql.ConnectionPool({
    //     user: param.user,
    //     password: param.password,
    //     server: param.server,
    //     database: param.database,
    //     trustServerCertificate: true
    // });

    req.session.user = param.user
    req.session.password = param.password
    req.session.server = param.server
    req.session.database = param.database
    req.session.save()
    // var pool = new sql.ConnectionPool({
    //     user: req.session.user,
    //     password: req.session.password,
    //     server: req.session.server,
    //     database: req.session.database,
    //     trustServerCertificate: true
    // });


    //     var pool = new sql.ConnectionPool({
    //     user: 'stadmin',
    //     password: 'bismillah',
    //     server: 'LAPTOP-HTLEJA3V',
    //     database: 'st2023',
    //     trustServerCertificate: true
    // });
    // var param = req.body;
    // var pool = new sql.ConnectionPool({
    //     user: param.user,
    //     password: param.password,
    //     server: param.server,
    //     database: param.database,
    //     trustServerCertificate: true
    // });
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
    // sql.close();
    // res.send(pool);
    // pool.connect(function(err) {
    //     // if (err) throw err;
    //     // console.log("Connected!");

    // // res.send(err);
    //     // con.query(sql, function (err, result) {
    //     //   if (err) throw err;
    //     //   console.log("Result: " + result);
    //     // });
    //   }).then(pol=>{
    //     res.send(pool);

    //   });

    // pool.query('SELECT 1 + 1 AS solution', (error, results) => {
    //     // if (error) res.send(error);
    //     // console.log('The solution is: ', results[0].solution);
    //     res.send(results);
    // });

    // res.send(pool);
    // res.send({
    //     user: param.user,
    //     password: param.password,
    //     server: param.server,
    //     database: param.database});
    // pool.request().query('select * from test', (err, result) => {
    //     console.dir(result)
    //     res.send(result);
    // })
});

app.get('/', function (req, res) {


    //   const pool = new sql.ConnectionPool({
    //         user: 'sa',
    //     password: 'P@ssw0rd1',
    //     server: '10.1.7.82', 
    //     database: 'simpeg41' ,
    //     trustServerCertificate: true
    // });

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
    //simple query
    // pool.request().query('select * from test', (err, result) => {
    //     console.dir(result)
    //     res.send(result);
    // })
    //query from server
    // pool.request().query('select * from temp_log_test', (err, result) => {
    //   console.dir(result)
    //   res.send(result);
    // })
});

app.get('/surat', function (req, res) {
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
    // res.send("exec GetSurat " + query);
    //simple query
    // pool.request().query(`exec GetSurat ${query}`, (err, result) => {
    //     console.dir(result)
    //     res.send(result);
    // })
});

app.post('/test-post', function (req, res) {
    var param = req.body;
    // res.send(req.body);
    res.send(param);
    //simple query
    // pool.request().query("exec GetSurat "+query, (err, result) => {
    //     console.dir(result)
    //     res.send(result);
    // })
});


app.get('/tim', function (req, res) {
    // var param = req.body;
    // res.send(req.body);
    // res.send(param);

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
    //simple query
    // pool.request().query("select * from tim", (err, result) => {
    //     console.dir(result)
    //     res.send(result);
    // })
});
app.get('/klasifikasi', function (req, res) {
    // var param = req.body;
    // res.send(req.body);
    // res.send(param);

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
    //simple query
    // pool.request().query("select * from klasifikasi", (err, result) => {
    //     console.dir(result)
    //     res.send(result);
    // })
});

app.post('/generate-surat', function (req, res) {
    var param = req.body;
    // res.send(req.body);
    // res.send(param);

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

    //simple query
    // pool.request().query(`exec AddSurat @nomor_surat = '${param.nomor_surat}', @tujuan='${param.tujuan}', @perihal='${param.perihal}', @jumlah=${param.jumlah}`, (err, result) => {
    //     console.dir(result)
    //     res.send(result);
    // });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});