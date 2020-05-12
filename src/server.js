require('dotenv').config();
const { uploadFile } = require("./uploader");
const helmet = require('helmet')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const router = express.Router();
const { updateDbWithFileName, updateAndFetch } = require('./dbQuerys')
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const https = require('https');
const http = require('http');
// const Ddos = require('ddos')
// const ddos = new Ddos({ burst: 6, limit: 50 })
// app.use(ddos.express);
//
const privateKey = fs.readFileSync('/etc/letsencrypt/live/codmento.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/codmento.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/codmento.com/chain.pem', 'utf8');

const credentials = {
	  key: privateKey,
          cert: certificate,
	  ca: ca
};

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
app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.use(helmet())
app.disable('x-powered-by');
app.use(compression());
app.use(cookieParser());
app.use(express.json())
app.use(function (req, res, next) {
    let cookie = req.cookies.userId;
    if (cookie === undefined) {
        res.cookie('userId', uuidv4(), {
            maxAge: 60 * 60 * 24 * 365*1000,
            httpOnly: true,
            // secure: true,
        });
    }
    next();
});
app.use(express.static('public'))
app.set('view engine', 'ejs');



router.get('/', function (req, res) {
    res.render('home.ejs');
});
router.get('/about-us', function (req, res) {
    res.render('about-us.ejs');
});
router.get('/contact-us', function (req, res) {
    res.render('contact-us.ejs');
});
router.get('/terms-and-conditions', function (req, res) {
    res.render('terms-and-conditions.ejs');
});
router.get('/privacy-policy', function (req, res) {
    res.render('privacy-policy.ejs');
});
router.get('/thank-you', function (req, res) {
    res.render('thank-you.ejs');
});

router.get('/record', (req, res) => {
    res.render('record.ejs')
})


router.get('/sentences', (req, res) => updateAndFetch(req, res));

router.post("/contact-us", (req, res) => {
    res.status(200).send({ success: true })
})

router.post("/upload", upload.any(), (req, res) => {
    const file = req.files[0];
    const userId = req.body.sentenceId;
    const speakerDetails = req.body.speakerDetails;   
    updateDbWithFileName(file.filename, userId,speakerDetails)
    uploadFile(file.path)
        .then(data => {
            res.status(200).send({ success: true })
            fs.unlink(file.path, function (err) {
                if (err) console.log(err);
                console.log('File deleted!');
            });
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
})
//router.get("*", (req, res) => {
  //  res.render('not-found.ejs');
//});

app.use('/', router);
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	    console.log('HTTPS Server running on port 443');
});

module.exports = app;
