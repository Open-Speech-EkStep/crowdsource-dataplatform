require('dotenv').config();
const cors = require('cors');
const objectStorage = process.argv[2] || 'gcp';
const fetch = require('node-fetch');

const { uploader } = require('./uploader/objUploader');
const { calculateSNR } = require('./audio_attributes/snr');
const profanityApi = require('./profanityChecker')

const helmet = require('helmet');
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const router = express.Router();

const {
    updateDbWithAudioPath,
    updateAndGetMedia,
    getContributionList,
    getAllDetails,
    getAllInfo,
    updateTablesAfterValidation,
    getMediaObject,
    insertFeedback,
    saveReport,
    markContributionSkipped,
    getRewards,
    getRewardsInfo,
    updateDbWithUserInput,
    getAvailableLanguages,
    getTargetInfo
} = require('./dbOperations');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const { ONE_YEAR, MOTHER_TONGUE, LANGUAGES, WADASNR_BIN_PATH, MIN_SNR_LEVEL } = require('./constants');
const {
    validateUserInputAndFile,
    validateUserInfo,
    validateUserInputForFeedback,
    validateInputForSkip,
    validateRewardsInput,
    validateRewardsInfoInput,
    validateContributedMediaInput,
    validateInputsForValidateEndpoint,
    validateGetContributionsInput,
    validateMediaTypeInput
} = require('./middleware/validateUserInputs');

// const Ddos = require('ddos');
// const ddos = new Ddos({ burst: 12, limit: 70 })
// app.use(ddos.express);


app.enable('trust proxy');

// const privateKey = fs.readFileSync('./vakyansh.key', 'utf8');
// const certificate = fs.readFileSync('./vakyansh_in.crt', 'utf8');
// const ca = fs.readFileSync('./vakyansh_in.ca-bundle', 'utf8');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca
// };

const randomString = () => {
    return (Math.random() + 1).toString(36).substring(2, 10);
};

const currentDateAndTime = () => {
    return new Date().toISOString().replace(/[-:T.]/g, '');
};

const multer = require('multer');
const xss = require('xss');
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
            console.log('Created directory uploads');
        }
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, currentDateAndTime() + '_' + randomString() + '.wav');
    },
});
const upload = multer({ storage: multerStorage });
const corsOptions = {
    origin: [/vakyansh\.in$/, /nplt\.in$/],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(upload.single('audio_data'));
app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(helmet());
app.disable('x-powered-by');
app.use(compression());
app.use(cookieParser());
// app.use(i18n.init)
app.use(function (req, res, next) {
    let cookie = req.cookies.userId;
    if (cookie === undefined) {
        res.cookie('userId', uuidv4(), {
            maxAge: ONE_YEAR,
            httpOnly: true,
            secure: true,
        });
    }
    next();
});

app.use(express.static('../crowdsource-ui/target'));

app.get('/changeLocale/:locale', function (req, res) {
    if (
        ['hi', 'en', 'ta', 'kn', 'gu', 'mr', 'te', 'bn', 'as', 'pa', 'or', 'ml'].indexOf(req.params.locale) > -1
    ) {
        res.cookie('contributionLanguage', req.params.locale);
        res.cookie('i18n', req.params.locale);
    } else {
        res.cookie('contributionLanguage', req.params.locale);
        res.cookie('i18n', 'en');
    }
    res.redirect(req.headers.referer);
});

router.get('/', function (req, res) {
    res.redirect('en/home.html');
});

router.get('/profanity/:type', function (req, res) {
    const type = req.params.type;
    if(!['sunoindia','likhoindia','dekhoindia','boloindia'].includes(type)){
       res.redirect('/en/not-found.html');
       return; 
    }
    res.redirect(`/en/profanity-home.html?type=${type}`);
});

router.get('/getDetails/:language', async function (req, res) {
    try {
        const currentLanguage = req.params.language;
        const allDetails = await getAllDetails(currentLanguage);
        res.status(200).send(allDetails);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/getAllInfo/:language', async function (req, res) {
    try {
        const currentLanguage = req.params.language;
        const allDetails = await getAllInfo(currentLanguage);

        res.status(200).send({
            genderData: allDetails[0],
            ageGroups: allDetails[1],
            motherTongues: allDetails[2],
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/media/:type', validateUserInfo, (req, res) => updateAndGetMedia(req, res));

router.get('/contributions/:type', validateGetContributionsInput, (req, res) => getContributionList(req, res));

router.post('/validate/:contributionId/:action', validateInputsForValidateEndpoint, (req, res) => updateTablesAfterValidation(req, res))

router.post('/media-object/:source/:entityId', validateContributedMediaInput, (req, res) => getMediaObject(req, res, objectStorage))

router.post('/report', async (req, res) => {
    const userId = req.cookies.userId || '';
    //in case source is validation, we get the contribution id in the sentenceId field, for easier tracking
    const { sentenceId = '', reportText = '', language = '', userName = '', source = '' } = req.body;
    if (
        sentenceId === '' ||
        reportText === '' ||
        language === '' ||
        userId === '' ||
        !['contribution', 'validation'].includes(source)
    ) {
        return res.send({ statusCode: 400, message: 'Input values missing' });
    }
    try {
        await saveReport(userId, sentenceId, reportText, language, userName, source);
    } catch (err) {
        console.log(err);
        return res.send({ statusCode: 500, message: err.message });
    }
    return res.send({ statusCode: 200, message: 'Reported successfully.' });
});

router.post('/skip', validateInputForSkip, (req, res) => {
    const language = req.body.language || ''
    markContributionSkipped(req.cookies.userId, req.body.sentenceId, req.body.userName, language)
        .then(() => {
            return res.send({ statusCode: 200, message: 'Skipped successfully.' });
        })
        .catch(err => {
            console.log(err);
            return res.send({ statusCode: 500, message: err.message });
        });
});

router.post('/store', validateUserInputAndFile, (req, res) => {
    const file = req.file;
    const datasetId = req.body.sentenceId;
    const { userId } = req.cookies;
    const { speakerDetails, language, state = '', country = '' } = req.body;
    const speakerDetailsJson = JSON.parse(speakerDetails);
    const { userName, age = '', motherTongue = '', gender = '' } = speakerDetailsJson;

    if (file) {
        const audioDuration = req.body.audioDuration;
        const uploadFile = uploader(objectStorage)

        uploadFile(file.path, userName, userId, language)
            .then(() => {
                const audioPath = `raw/landing/${language}/audio/users/${userId}/${userName}/uploads/${file.filename}`;
                updateDbWithAudioPath(audioPath, datasetId, userId, userName, state, country, audioDuration, language, age, gender, motherTongue,
                    (resStatus, resBody) => {
                        removeTempFile(file);
                        res.status(resStatus).send(resBody);
                    });
            })
            .catch((err) => {
                console.error(err);
                res.sendStatus(500);
            });
    }
    else {
        const userInput = xss(req.body.userInput);
        updateDbWithUserInput(userName, userId, language, userInput, datasetId, state, country, age, gender, motherTongue,
            (resStatus, resBody) => {
                res.status(resStatus).send(resBody);
            })
            .catch((err) => {
                console.error(err);
                res.sendStatus(500);
            });
    }
});

router.post('/audio/snr', async (req, res) => {
    const file = req.file;
    const filePath = file.path;
    const command = buildWadaSnrCommand(filePath);
    const onSuccess = snr => {
        const ambient_noise = snr < MIN_SNR_LEVEL ? true : false;
        removeTempFile(file);
        console.log('success:' + res.headersSent);
        res.status(200).send({ snr: snr, ambient_noise: ambient_noise });
        console.log('success:' + res.headersSent);
    };
    const onError = snr => {
        console.log('error...' + res.headersSent);
    };
    calculateSNR(command, onSuccess, onError);
});

router.get('/location-info', (req, res) => {
    const ip = req.query.ip || null;
    if (ip === null) {
        res.sendStatus(400);
        return;
    }
    fetch(`http://ip-api.com/json/${ip}?fields=country,regionName`).then(jsonRes => jsonRes.json()).then(response => {
        res.send(response);
    }).catch(err => {
        res.sendStatus(500);
    })
        .catch(err => {
            res.sendStatus(500);
        });
});

app.get('/get-locale-strings/:locale', function (req, res) {
    let locale = req.params.locale;
    fs.readFile(`${__dirname}/../locales/${locale}.json`, (err, body) => {
        if (err) {
            return res.sendStatus(500);
        }
        const data = JSON.parse(body);
        const list = [
            'hrs recorded in',
            'hrs validated in',
            'hours',
            'minutes',
            'seconds',
            'Recording for 5 seconds',
            'Recording for 4 seconds',
            'Recording for 3 seconds',
            'Recording for 2 seconds',
            'Recording for 1 seconds',
            'Playingback Audio',
            'Playing',
            'Test Mic',
            'Test Speakers',
            'Congratulations!!! You have completed this batch of sentences',
            'social sharing text with rank',
            'social sharing text without rank',
            'SKIP',
            'Next',
            'Back',
            'CLOSE',
            'You can select the language in which you want to participate',
            'You can change the language in which you want to read content',
            'Click on the card to start contributing your voice',
            'Click on the card to validate what others have spoken',
            'Level',
            'Sentences',
            'bronze',
            'silver',
            'gold',
            'platinum',
            'N/A',
        ];

        const langSttr = {};
        list.forEach(key => {
            langSttr[key] = data[key];
        });
        res.send(langSttr);
    });
});

router.post('/feedback', validateUserInputForFeedback, (req, res) => {
    const feedback = req.body.feedback.trim();
    const category = req.body.category.trim();
    const language = req.body.language.trim();
    const module = req.body.module;
    const target_page = req.body.target_page;
    const opinion_rating = req.body.opinion_rating;

    insertFeedback(feedback, category, language, module, target_page, opinion_rating)
        .then(() => {
            console.log('Feedback is inserted into the DB.');
            res.send({
                statusCode: 200,
                message: 'Feedback submitted successfully.',
            });
        })
        .catch(e => {
            console.log(`Error while insertion ${e}`);
            res.send({ statusCode: 502, message: 'Failed to submit feedback.' });
        });
});

router.get('/rewards', validateRewardsInput, async (req, res) => {
    const userId = req.cookies.userId;
    const { type, source, language, userName = '' } = req.query;
    try {
        const data = await getRewards(userId, userName, language, source, type);
        return res.send(data);
    } catch (error) {
        res.status(502).send({ statusCode: 502, message: error.message });
    }
});

router.get('/rewards-info', validateRewardsInfoInput, async (req, res) => {
    const { type, source, language } = req.query;

    const info = await getRewardsInfo(type, source, language);
    if (info && info.length > 0) {
        return res.send(info);
    }

    return res.status(404).send('Data not found');
});

router.get('/available-languages/:type', validateMediaTypeInput, (req, res) => getAvailableLanguages(req, res));

router.get('/target-info/:type/:sourceLanguage', (req, res) => getTargetInfo(req, res));

profanityApi(router)
require('./dashboard-api')(router);


app.use('/', router);

function buildWadaSnrCommand(filePath) {
    return `${WADASNR_BIN_PATH}/WADASNR -i ${filePath} -t ${WADASNR_BIN_PATH}/Alpha0.400000.txt -ifmt mswav`;
}

function removeTempFile(file) {
    fs.unlink(file.path, function (err) {
        if (err) {
            console.log(`File ${file.path} not deleted!`);
            console.log(err);
        }
    });
}

module.exports = app;
