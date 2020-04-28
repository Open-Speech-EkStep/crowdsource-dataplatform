require('dotenv').config();
const { uploadFile } = require("./uploader");
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const router = express.Router();
const pgp = require('pg-promise')();
const envVars = process.env;
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}:${envVars.DB_PORT}/${envVars.DB_NAME}`);
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const multer = require('multer')
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + ".wav")
    }
})
const upload = multer({ storage: multerStorage })


app.use(cookieParser());
app.use(express.static('public'));
app.use(function (req, res, next) {
    var cookie = req.cookies.userId;
    if (cookie === undefined) {
        res.cookie('userId', uuidv4(), { maxAge: 60 * 60 * 24 * 365, httpOnly: true });
    }
    next();
});
app.use(express.static('public'))
app.set('view engine', 'ejs');



router.get('/', function (req, res) {
    res.render('home.ejs');
});

router.get('/record', function (req, res) {
    db.many("select sentence from sentences limit 10")
        .then(data => {
            res.render('record.ejs', { sentences: data });
        })
        .catch(err => {
            res.sendStatus(500);
        })
});


router.post("/upload", upload.any(), (req, res) => {
    const file = req.files[0];
    uploadFile(file.path)
    .then(data => {
        res.sendStatus(200);
    })
    .catch((err) => {
        console.error(err);
        res.sendStatus(500);
    });
    
})


app.use('/', router);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))