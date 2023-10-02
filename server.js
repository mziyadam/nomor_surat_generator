var express = require('express');
var app = express();
// var sql = require('mssql/msnodesqlv8');
var sql = require('mssql');
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
app.use(express.urlencoded({ extended: true }));     // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 
const pool = new sql.ConnectionPool({
    user: 'stadmin',
    password: 'bismillah',
    server: 'LAPTOP-HTLEJA3V',
    database: 'st2023',
    trustServerCertificate: true
});
pool.connect();
app.get('/', function (req, res) {


    //   const pool = new sql.ConnectionPool({
    //         user: 'sa',
    //     password: 'P@ssw0rd1',
    //     server: '10.1.7.82', 
    //     database: 'simpeg41' ,
    //     trustServerCertificate: true
    // });

    //simple query
    pool.request().query('select * from test', (err, result) => {
        console.dir(result)
        res.send(result);
    })
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

    // res.send("exec GetSurat " + query);
    //simple query
    pool.request().query("exec GetSurat " + query, (err, result) => {
        console.dir(result)
        res.send(result);
    })
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
    //simple query
    pool.request().query("select * from tim", (err, result) => {
        console.dir(result)
        res.send(result);
    })
});
app.get('/klasifikasi', function (req, res) {
    // var param = req.body;
    // res.send(req.body);
    // res.send(param);
    //simple query
    pool.request().query("select * from klasifikasi", (err, result) => {
        console.dir(result)
        res.send(result);
    })
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});