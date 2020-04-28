const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const router = express.Router();
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:1234@localhost:2345/CrowdSource');
app.use(cookieParser());
app.use(express.static('public'));
const { v4: uuidv4 } = require('uuid');

var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + ".wav")
    }
})
var upload = multer({ storage: storage })
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
    const file = req.body.speakerDetails;

    res.sendStatus(200);
})



app.use('/', router);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))