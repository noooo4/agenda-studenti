const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
module.exports = function (nconf, pool) {
    const route = express.Router();
    route.use(express.static(__dirname));
    route.use(bodyParser.json());




    //MATERIE
    route.get('/teaching/:subject', function (req, res) {
        console.log(req.params);
        pool.query("SELECT * FROM materie WHERE subject=?", req.params.subject, function (err, records) {
            console.log("RECORDS", records)
            if (err) {
                console.log('err', err)
            } else {
                console.log(records);
            }
            return res.send('complimenti');
        });
    }); //fatto
    route.post('/teaching', function (req, res) {
        var subject = req.body.subject;
        var teacher = req.body.teacher;
        pool.query("INSERT INTO materie ( subject, teacher) VALUES (?, ?)", [req.body.subject, req.body.teacher], function (err, result) {
            if (err) throw err;
            console.log(" Un professore aggiunto ");
        });
        res.send(' Professore aggiunto ');
        res.send(subject, teacher);
    }); //fatto
    route.delete('/teaching/:student', function (req, res) {
        console.log(req.params);
        pool.query("DELETE FROM materie WHERE teacher = ?", req.params.teacher, function (err, result) {
            if (err) throw err;
            console.log(" Professore eliminato ");
        });
        res.send(' Professore eliminato ');
    });//fatto


    //STUDENTI
    route.get('/student/:username', function (req, res) {
        console.log(req.params);
        pool.query("SELECT * FROM studenti WHERE username=?", req.params.username, function (err, records) {
            console.log("RECORDS", records)
            if (err) {
                console.log('err', err)
            } else {
                console.log(records);
            }
            return res.send('completed');
        });
    }); //fatto
    route.post('/student', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        pool.query("INSERT INTO studenti ( username, password, email ) VALUES (?, SHA2(?, 512), ?)", [req.body.username, req.body.password, req.body.email], function (err, result) {
            if (err) throw err;
            console.log(" Uno studente aggiunto ");
        });
        res.send(username, password, email);
    }); //fatto
    route.delete('/student/:username', function (req, res) {
        console.log(req.params);
        pool.query("DELETE FROM studenti WHERE username = ?", req.params.username, function (err, result) {
            if (err) throw err;
            console.log(" Studente eliminato ");
        });
        res.send('complimenti');
    });//fatto

    route.get('/home', function (request, response) {
        if (request.session.loggedin) {
            response.send('Welcome back, ' + request.session.username + '!');
        } else {
            response.send('Please login to view this page!');
        }
        response.end();
    });


    //LOGIN
    route.post('/login', function (request, response) {
        let username = request.body.username;
        let password = request.body.password;
        let email = request.body.email;
        if (username && password) {
            pool.query('SELECT * FROM studenti WHERE username = ? AND password = SHA2(?, 512) AND email = ?', [username, password, email], function (error, results, fields) {
                if (error) error;
                if (results.length > 0) {
                    response.send(' Funziona ti sei Loggato ');
                    console.log(" Funziona ti sei Loggato ");
                } else {
                    response.status(400).send(' Password, Email e/o Username Sbagliati ');
                    console.log(" Password, Email e/o Username Sbagliati ");
                    return
                }
                response.end();
            });
        }
    });//fatto

    return route;
}