require('dotenv').config();
const { uploadFile } = require("./uploader");
const helmet = require('helmet')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const router = express.Router();
const { updateDbWithFileName, updateAndGetSentences, getAllDetails, getAllInfo } = require('./dbOperations')
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const https = require('https');
const http = require('http');
const { ONE_YEAR } = require("./constants");
const { validateUserInputAndFile, validateUserInfo } = require("./middleware/validateUserInputs")
const Ddos = require('ddos')
const ddos = new Ddos({ burst: 6, limit: 30 })
app.use(ddos.express);
app.enable('trust proxy');

// const privateKey = fs.readFileSync('./vakyansh.key', 'utf8');
// const certificate = fs.readFileSync('./vakyansh_in.crt', 'utf8');
// const ca = fs.readFileSync('./vakyansh_in.ca-bundle', 'utf8');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca
// };

const randomString = () => { return (Math.random() + 1).toString(36).substring(2, 10) }

const currentDateAndTime = () => { return new Date().toISOString().replace(/[-:T.]/g, "") }

const multer = require('multer')
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
            console.log('Created directory uploads');
        }
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, currentDateAndTime() + "_" + randomString() + ".wav")
    }
})
const upload = multer({ storage: multerStorage })
app.use(express.json());
app.use(upload.single('audio_data'));
app.use("/sentences", validateUserInfo)
app.use("/upload", validateUserInputAndFile)
app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(helmet())
app.disable('x-powered-by');
app.use(compression());
app.use(cookieParser());
app.use(function (req, res, next) {
    let cookie = req.cookies.userId;
    if (cookie === undefined) {
        res.cookie('userId', uuidv4(), {
            maxAge: ONE_YEAR,
            httpOnly: true,
            secure: true
        });
    }
    next();
});
app.use(express.static('public'))
app.set('view engine', 'ejs');

router.get('/', function (req, res) {
    res.render('home.ejs');
});

router.get("/getDetails",async function (req, res) {
    try{
        const allDetails = await getAllDetails();
        res.status(200).send(allDetails);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.get("/getAllInfo", async function (req, res) {
    try{
        const allDetails = await getAllInfo();
        res.status(200).send({ genderData: allDetails[0], ageGroups: allDetails[1], motherTongues: allDetails[2] });
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/about-us', function (req, res) {
    res.render('about-us.ejs');
});
router.get('/terms-and-conditions', function (req, res) {
    res.render('terms-and-conditions.ejs');
});
router.get('/thank-you', function (req, res) {
    res.render('thank-you.ejs');
});
router.get('/record', (req, res) => {
    res.render('record.ejs')
})
router.post('/sentences', (req, res) => updateAndGetSentences(req, res));
router.post("/upload", (req, res) => {
    const file = req.file;
    const sentenceId = req.body.sentenceId;
    const speakerDetails = req.body.speakerDetails;
    const speakerDetailsJson = JSON.parse(speakerDetails);
    const userName = speakerDetailsJson.userName
    const userId = req.cookies.userId
    const language = speakerDetailsJson.language;
    uploadFile(file.path,userName,userId,language)
        .then(data => {
            updateDbWithFileName(file.filename, sentenceId, speakerDetails, userId, (resStatus, resBody) => {
                res.status(resStatus).send(resBody);
            })
            fs.unlink(file.path, function (err) {
                if (err) {
                    console.log(`File ${file.path} not deleted!`);
                    console.log(err);
                }
            });
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
})
router.get("*", (req, res) => {
    res.render('not-found.ejs');
});

app.use('/', router);

//const PORT = process.env.PORT || 8080;

 const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

//app.listen(PORT, () => {
//    console.log(`App listening on port ${PORT}`);
//    console.log('Press Ctrl+C to quit.');
//  });
 httpServer.listen(8080, () => {
     console.log('HTTP Server running on port 8080');
 });

// httpsServer.listen(443, () => {
//     console.log('HTTPS Server running on port 443');
// });

module.exports = app;
