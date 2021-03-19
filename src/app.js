require('dotenv').config();
const cors = require('cors');
const objectStorage = process.argv[2] || 'gcp';
const fetch = require('node-fetch');
const cors = require('cors');
const { uploader } = require('./uploader/objUploader')
const { calculateSNR } = require('./audio_attributes/snr')

const helmet = require('helmet')
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const router = express.Router();

const {
  updateDbWithAudioPath,
  updateAndGetSentences,
  getValidationSentences,
  getAllDetails,
  getAllInfo,
  updateTablesAfterValidation,
  getAudioClip,
  insertFeedback
} = require('./dbOperations');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const { ONE_YEAR, MOTHER_TONGUE, LANGUAGES, WADASNR_BIN_PATH } = require('./constants');
const {
  validateUserInputAndFile,
  validateUserInfo,
  validateUserInputForFeedback
} = require('./middleware/validateUserInputs');

// const Ddos = require('ddos');
// const ddos = new Ddos({ burst: 12, limit: 70 })
// app.use(ddos.express);

const { I18n } = require('i18n');
const i18n = new I18n({
  locales: ['as', 'bn', 'en', 'gu', 'hi', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'doi', 'mai', 'ur', 'kr', 'kd', 'mnibn', 'mnimm', 'satol', 'satdv', 'sa'],
  directory: './locales',
  cookie: 'i18n'
})


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
const corsOptions = {
  origin: /vakyansh\.in$/,
}
const upload = multer({ storage: multerStorage });
const corsOptions = {
  origin: /vakyansh\.in$/,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(upload.single('audio_data'));
app.use('/sentences', validateUserInfo);
app.use('/upload', validateUserInputAndFile);
app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(helmet());
app.disable('x-powered-by');
app.use(compression());
app.use(cookieParser());
app.use(i18n.init)
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

app.use(express.static('public'));

app.get('/changeLocale/:locale', function (req, res) {
  res.cookie('i18n', req.params.locale);
  res.redirect(req.headers.referer);
});
app.set('view engine', 'ejs');

router.get('/', function (req, res) {
  res.redirect("en/home.html");
  // res.sendFile(__dirname + "/public/en/home.html");
  // const localLanguage = req.cookies.i18n;
  // const isCookiePresent = localLanguage ? true : false;
  // res.render('home.ejs', { MOTHER_TONGUE, LANGUAGES, isCookiePresent, defaultLang: localLanguage });
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

router.get('/feedback', function (req, res) {
  res.render('feedback.ejs');
});

router.get('/about-us', function (req, res) {
  res.render('about-us.ejs', { MOTHER_TONGUE, LANGUAGES });
});
router.get('/terms-and-conditions', function (req, res) {
  res.render('terms-and-conditions.ejs');
});
router.get('/thank-you', function (req, res) {
  res.render('thank-you.ejs');
});
router.get('/record', (req, res) => {
  res.render('record.ejs');
});
router.get('/validator-page', (req, res) => {
  res.render('validator-prompt-page.ejs');
});
router.get('/dashboard', function (req, res) {
  const isCookiePresent = req.cookies.userId ? true : false;
  res.render('dashboard.ejs', { MOTHER_TONGUE, LANGUAGES, isCookiePresent });
});
router.post('/sentences', (req, res) => updateAndGetSentences(req, res));

router.get('/validation/sentences/:language', (req, res) => getValidationSentences(req, res));

router.post('/validation/action', (req, res) => updateTablesAfterValidation(req, res))

router.post('/audioClip', (req, res) => getAudioClip(req, res, objectStorage))

router.post('/upload', (req, res) => {
  const file = req.file;
  const sentenceId = req.body.sentenceId;
  const speakerDetails = req.body.speakerDetails;
  const audioDuration = req.body.audioDuration;
  const speakerDetailsJson = JSON.parse(speakerDetails);
  const userName = speakerDetailsJson.userName;
  const userId = req.cookies.userId;
  const language = speakerDetailsJson.language;
  const audioPath = `raw/landing/${language}/audio/users/${userId}/${userName}/uploads/${file.filename}`;

  const state = req.body.state || "";
  const country = req.body.country || "";

  const uploadFile = uploader(objectStorage)

  uploadFile(file.path, userName, userId, language)
    .then(() => {
      updateDbWithAudioPath(
        audioPath,
        sentenceId,
        speakerDetails,
        userId,
        userName,
        state,
        country,
        audioDuration,
        (resStatus, resBody) => {
          res.status(resStatus).send(resBody);
        }
      );
      removeTempFile(file);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.post('/audio/snr', async (req, res) => {
  const file = req.file;
  const filePath = file.path
  const command = buildWadaSnrCommand(filePath)
  const onSuccess = (snr) => {
    removeTempFile(file);
    res.status(200).send({ 'snr': snr });
  }
  const onError = (snr) => {
    removeTempFile(file);
    res.sendStatus(502);
  }
  calculateSNR(command, onSuccess, onError)
});

router.get('/location-info', (req, res) => {
  const ip = req.query.ip || null;
  if (ip === null) {
    res.sendStatus(400);
    return;
  }
  fetch(`http://ip-api.com/json/${ip}?fields=country,regionName`).then(res => res.json()).then(response => {
    res.send(response);
  }).catch(err => {
    res.sendStatus(500);
  })
});

app.get('/get-locale-strings/:locale', function (req, res) {
  let locale = req.params.locale;
  fs.readFile(`${__dirname}/../locales/${locale}.json`, (err, body) => {
    if (err) {
      return res.sendStatus(500);
    }
    const data = JSON.parse(body);
    const list = ['hrs recorded in', 'hrs validated in', 'hours', 'minutes', 'seconds', 'Recording', 'Playing', 'Test mic', 'Test Speakers'];

    const langSttr = {};
    list.forEach((key) => {
      langSttr[key] = data[key];
    });
    res.send(langSttr);
  });
});

router.post('/feedback', validateUserInputForFeedback, (req, res) => {
  const feedback = req.body.feedback.trim();
  const subject = req.body.subject.trim();
  const language = req.body.language.trim();
  insertFeedback(subject, feedback, language).then(() => {
    console.log("Feedback is inserted into the DB.")
    res.send({ statusCode:200, message: "Feedback submitted successfully." });
  }).catch(e => {
    console.log(`Error while insertion ${e}`)
    res.send({ statusCode: 502, message: "Failed to submit feedback." });
  })

})

require('./dashboard-api')(router);

app.use('/', router);

app.get('*', (req, res) => {
  res.render('not-found.ejs');
});

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
