require('dotenv').config();
const { uploadFile } = require("./uploader");
const helmet = require('helmet')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const router = express.Router();
const {
  updateDbWithFileName,
  updateAndGetSentences,
  getAllDetails,
  getAllInfo,
} = require('./dbOperations');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const { ONE_YEAR, MOTHER_TONGUE, LANGUAGES } = require('./constants');
const {
  validateUserInputAndFile,
  validateUserInfo,
} = require('./middleware/validateUserInputs');
const Ddos = require('ddos');
const ddos = new Ddos({ burst: 12, limit: 70 });
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
const upload = multer({ storage: multerStorage });
app.use(express.json());
app.use(upload.single('audio_data'));
app.use('/sentences', validateUserInfo);
app.use('/upload', validateUserInputAndFile);
app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(helmet());
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
app.use(express.static('public'));
app.set('view engine', 'ejs');



/*** block start */

var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_ISSUER_BASE_URL.replace("https://", "").replace("/", ""),
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:8080/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    // console.log("access_token", accessToken);
    profile.accessToken = accessToken;
    return done(null, profile);
  }
);
passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());



var session = require('express-session');

// config express-session
var sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

app.use(session(sess));

app.use('/', require('./authroute'));

/*** block end */

router.get('/', function (req, res) {
  res.render('home.ejs', { MOTHER_TONGUE, LANGUAGES });
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

router.get('/validator/prompt-page', (req, res) => {
  res.render('validator-prompt-page.ejs');
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
  res.render('record.ejs');
});
router.post('/sentences', (req, res) => updateAndGetSentences(req, res));
router.post('/upload', (req, res) => {
  const file = req.file;
  const sentenceId = req.body.sentenceId;
  const speakerDetails = req.body.speakerDetails;
  const speakerDetailsJson = JSON.parse(speakerDetails);
  const userName = speakerDetailsJson.userName;
  const userId = req.cookies.userId;
  const language = speakerDetailsJson.language;
  uploadFile(file.path, userName, userId, language)
    .then(() => {
      updateDbWithFileName(
        file.filename,
        sentenceId,
        speakerDetails,
        userId,
        (resStatus, resBody) => {
          res.status(resStatus).send(resBody);
        }
      );
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
});

app.use('/', router);
// Any routes added after this secure route should be authorized urls only otherwise you will get 401 because of middleware added.
app.use('/', require('./secureroute'));

app.get('*', (req, res) => {
  res.render('not-found.ejs');
});

module.exports = app;

