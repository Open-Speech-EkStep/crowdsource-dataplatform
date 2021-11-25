require('dotenv').config();
const cors = require('cors');
const objectStorage = process.argv[2] || 'gcp';
const fetch = require('node-fetch');

const { uploader } = require('./uploader/objUploader');
const { calculateSNR } = require('./audio_attributes/snr');
const profanityApi = require('./profanityChecker');

const helmet = require('helmet');
const express = require('express');
const app = express();
app.disable('x-powered-by');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();

const {
  updateDbWithAudioPath,
  updateAndGetMedia,
  getContributionList,
  updateTablesAfterValidation,
  insertFeedback,
  saveReport,
  markContributionSkipped,
  getRewards,
  getRewardsInfo,
  updateDbWithUserInput,
  userVerify,
  getUserRewards,
} = require('./dbOperations');

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const { ONE_YEAR, WADASNR_BIN_PATH, MIN_SNR_LEVEL, ROLE_UAT } = require('./constants');
const {
  validateUserInputAndFile,
  validateUserInfo,
  validateUserInputForFeedback,
  validateInputForSkip,
  validateRewardsInput,
  validateRewardsInfoInput,
  validateInputsForValidateEndpoint,
  validateGetContributionsInput,
  validateReportInputs,
} = require('./middleware/validateUserInputs');
const { markContributionSkippedInCache } = require('./middleware/cacheMiddleware');

app.use(bodyParser.json());
// morganBody(app, {
//     logAllReqHeader: true,
//     noColors: true
// });


app.enable('trust proxy');

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
  origin: [/vakyansh\.in$/, /nplt\.in$/, /azureedge\.net$/, /azurefd\.net$/, /gov\.in$/],
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
      sameSite: 'none',
    });
  }
  next();
});

app.use(express.static('../crowdsource-ui/target', { redirect: false }));

router.get('/get-userid', (req, res) => {
  res.sendStatus(200);
});

router.get('/profanity/:type', function (req, res) {
  // #swagger.ignore = true
  const type = req.params.type;
  if (!['asr', 'parallel', 'ocr', 'text'].includes(type)) {
    res.redirect('/en/not-found.html');
    return;
  }
  // res.redirect(`/en/profanity-home.html?type=${type}`);
  res.redirect(`/en/profanity.html?type=${type}`);
});

router.post('/verify-user', async (req, res) => {
  // #swagger.tags = ['uat']
  /* #swagger.parameters['userName'] = {
                in: 'body',
                type: 'string',
                description: 'media type',
                required: true,
                schema: "name"
        }*/
  const { userName } = req.body;
  try {
    await userVerify(userName, ROLE_UAT);
    res.status(200).send({ message: 'User Verified Successfully' });
  } catch (err) {
    // console.log(err);
    res.sendStatus(401);
  }
});

router.post('/media/:type', validateUserInfo, (req, res) => {
  //  #swagger.tags = ['Contribution'],
  //  #swagger.description = 'Endpoint to get media for contribution',
  /*  #swagger.parameters['type'] = {
                type: 'string',
                description: 'media type',
                required: true,
                schema: "asr"
        },
        #swagger.parameters['obj'] = {
                in: 'body',
                type: 'object',
                description: 'User info',
                required: true,
                schema: {"userName": "name", "language": "Hindi", "toLanguage": "English", "age": "upto 10" }
        }
        #swagger.parameters['userId'] = {
                in: 'cookies',
                type: 'string',
                description: 'user id cookie',
                required: true,
                schema: 123
        }
        #swagger.responses[200] = {
        description: 'response data',
        schema: {"data": [{"dataset_row_id": "123", "media_data": "qwe", "source_info": "abc"}]}
        } */
  return updateAndGetMedia(req, res);
});

router.get('/contributions/:type', validateGetContributionsInput, (req, res) => {
  //  #swagger.tags = ['Validation']
  //  #swagger.description = 'Endpoint to get contributed data for validation. parameter "to" is only required if type=parallel.',
  /*  #swagger.parameters['userId'] = {
                in: 'cookies',
                type: 'string',
                description: 'user id cookie',
                required: true,
                schema: 123
        }
        #swagger.parameters['type'] = {
                type: 'string',
                description: 'media type',
                required: true,
                schema: "asr"
        },
        #swagger.parameters['from'] = {
                in: 'query',
                type: 'string',
                description: 'From language',
                required: true,
                schema: "Hindi"
        }
        #swagger.parameters['to'] = {
                in: 'query',
                type: 'string',
                description: 'To language',
                required: true,
                schema: "English"
        }
        #swagger.responses[200] = {
        description: 'response data',
        schema: {"data": [{"contribution_id": "123", "dataset_row_id":321, "sentence": "Text 1", "contribution":"contribution/1", "source_info": "info"}]}
        } */
  return getContributionList(req, res);
});

router.post('/validate/:contributionId/:action', validateInputsForValidateEndpoint, (req, res) => {
  // #swagger.tags = ['Validation']
  //  #swagger.description = 'Endpoint to store validation for a contributed data.',
  /*  #swagger.parameters['userId'] = {
                in: 'cookies',
                type: 'string',
                description: 'user id cookie',
                required: true,
                schema: 123
        }
        #swagger.parameters['contributionId'] = {
                type: 'string',
                required: true,
                schema: 123
        },
        #swagger.parameters['action'] = {
                type: 'string',
                description: 'Validation action taken (accept/reject/skip)',
                required: true,
                schema: 'accept'
        }
        #swagger.parameters['obj'] = {
                in: 'body',
                type: 'object',
                description: 'Validation details',
                required: true,
                schema: {
                    "sentenceId": 1123,
                    "state": "Punjab",
                    "country": "India",
                    "userName": "name",
                    "device": "device",
                    "browser": "browser_name",
                    "type": "asr",
                    "fromLanguage": "Hindi",
                    "language": "English"
                        }
        }*/
  return updateTablesAfterValidation(req, res);
});

router.post('/report', validateReportInputs, async (req, res) => {
  /*  #swagger.tags = ['Support']
        #swagger.description = 'Endpoint to store report entry.',
        #swagger.parameters['userId'] = {
                in: 'cookies',
                type: 'string',
                description: 'user id cookie',
                required: true,
                schema: 123
        }
        #swagger.parameters['obj'] = {
                in: 'body',
                type: 'object',
                required: true,
                schema: {
                    "sentenceId": 123,
                    "reportText": "Report message",
                    "language": "Hindi",
                    "userName": "name",
                    "source": "contribution"
                }
        }, */

  try {
    const userId = req.cookies.userId || '';
    //in case source is validation, we get the contribution id in the sentenceId field, for easier tracking
    const { sentenceId = '', reportText = '', language = '', userName = '', source = '' } = req.body;

    await saveReport(userId, sentenceId, reportText, language, userName, source);
  } catch (err) {
    console.log(err);
    return res.send({ statusCode: 500, message: err.message });
  }
  return res.send({ statusCode: 200, message: 'Reported successfully.' });
});

router.post('/skip', validateInputForSkip, markContributionSkippedInCache, (req, res) => {
  /*  #swagger.tags = ['Contribution']
        #swagger.description = 'Endpoint to mark contribution as skipped',
        #swagger.parameters['userId'] = {
                in: 'cookies',
                type: 'string',
                description: 'user id cookie',
                required: true,
                schema: 123
        }
        #swagger.parameters['obj'] = {
        in: 'body',
        type: 'object',
        required: true,
        schema: {"language": "Hindi",
                    "sentenceId": 123,
                    "userName": "name",
                    "fromLanguage": "English",
                    "state_region": "Punjab",
                    "country": "India",
                    "device": "deviceName",
                    "browser": "browserName",
                    "type": "parallel"}
    } */
  const language = req.body.language || '';
  markContributionSkipped(
    req.cookies.userId,
    req.body.sentenceId,
    req.body.userName,
    language,
    req.body.state_region,
    req.body.country,
    req.body.device,
    req.body.browser
  )
    .then(() => {
      return res.send({ statusCode: 200, message: 'Skipped successfully.' });
    })
    .catch(err => {
      console.log(err);
      return res.send({ statusCode: 500, message: 'Some error occured' });
    });
});

router.post('/store', validateUserInputAndFile, (req, res) => {
  /*  #swagger.tags = ['Contribution']
        #swagger.description = 'Endpoint to store contribution data',
        #swagger.parameters['userId'] = {
                in: 'cookies',
                type: 'string',
                description: 'user id cookie',
                required: true,
                schema: 123
        }
        #swagger.parameters['obj'] = {
        in: 'body',
        type: 'object',
        required: true,
        schema: {
            "sentenceId": 123,
            "audioDuration": 3,
            "userInput": 'text contribution sentence',
            "speakerDetails": {"userName":  "name",
                                "motherTongue": "Hindi",
                                "gender": "Male",
                                "age": "upto 10",
                                },
            "language": "Hindi",
            "state": "Punjab",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel",
            "fromLanguage": "English"
            }
    } */
  const file = req.file;
  const datasetId = req.body.sentenceId;
  const { userId } = req.cookies;
  const {
    speakerDetails,
    language,
    state = '',
    country = '',
    device = '',
    browser = '',
    type,
    fromLanguage = '',
  } = req.body;
  const speakerDetailsJson = JSON.parse(speakerDetails);
  const { userName, age = '', motherTongue = '', gender = '' } = speakerDetailsJson;

  if (file) {
    const audioDuration = req.body.audioDuration;
    const uploadFile = uploader(objectStorage);

    uploadFile(file.path, userName, userId, language)
      .then(() => {
        const audioPath = `raw/landing/${language}/audio/users/${userId}/${userName}/uploads/${file.filename}`;
        updateDbWithAudioPath(
          audioPath,
          datasetId,
          userId,
          userName,
          state,
          country,
          audioDuration,
          language,
          age,
          gender,
          motherTongue,
          device,
          browser,
          type,
          (resStatus, resBody) => {
            removeTempFile(file);
            res.status(resStatus).send(resBody);
          }
        );
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  } else {
    const userInput = xss(req.body.userInput);
    updateDbWithUserInput(
      userName,
      userId,
      language,
      userInput,
      datasetId,
      state,
      country,
      age,
      gender,
      motherTongue,
      device,
      browser,
      type,
      fromLanguage,
      (resStatus, resBody) => {
        res.status(resStatus).send(resBody);
      }
    ).catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
  }
});

router.post('/audio/snr', async (req, res) => {
  // #swagger.tags = ['Support']
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
  // #swagger.tags = ['Support']
  // #swagger.description = 'Endpoint to get location info'
  /*  #swagger.parameters['ip'] = {
                in: 'query',
                required: true,
        }, */
  const ip = req.query.ip || null;
  if (ip === null) {
    res.sendStatus(400);
    return;
  }
  fetch(`http://ip-api.com/json/${ip}?fields=country,regionName`)
    .then(jsonRes => jsonRes.json())
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.sendStatus(500);
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

app.get('/get-locale-strings/:locale', function (req, res) {
  //  #swagger.tags = ['Support']
  //  #swagger.description = 'Endpoint to get translated string for locale'
  /*  #swagger.parameters['locale'] = {
        type: 'string',
        required: true,
        schema: 'hi'} */
  let locale = req.params.locale;
  fs.readFile(`${__dirname}/../locales/${locale}.json`, (err, body) => {
    if (err) {
      return res.sendStatus(500);
    }
    const data = JSON.parse(body);
    const list = [
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
      'Level',
      'Sentences',
      'Recording',
      'Labelling',
      'Transcribing',
      'Translating',
      'Images',
      'Validating',
      'Telugu',
      'Marathi',
      'Tamil',
      'Kannada',
      'Malayalam',
      'Odia',
      'Assamese',
      'Punjabi',
      'Gujarati',
      'Hindi',
      'English',
      'Bengali',
      'All Languages',
      'Validation so far in <y> - <x>',
      'Contribution so far in <y> - <x>',
      'minute(s)',
      'second(s)',
      'hour(s)',
      'Validation',
      'Contribution',
      'Transcription (in sentences)',
      'Recordings (in hours)',
      'Translation (in sentences)',
      'Labelled (in images)',
      'Validation (in sentences)',
      'Validation (in image labels)',
      'Contribution (in hours)',
      'Contribution (total images)',
      'Contribution (total translations)',
      'Contribution (total speakers)',
      'Contribution (total sentences)',
      'Translations',
      'Speakers',
      'images',
      'Contribute',
      'Validate',
      'Telangana',
      'Andaman and Nicobar Islands',
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jammu & Kashmir',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Lakshadweep',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Chandigarh',
      'Puducherry',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
      'Odisha',
      'Dadra and Nagar Haveli and Daman and Diu',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'National Capital Territory of Delhi',
      'Ladakh',
      'recordings',
      'image labels',
      'Contributed',
      'Validated',
      'Transcribed',
      'Translations done',
      'Translations validated',
      'Male',
      'Female',
      'Transgender - He',
      'Transgender - She',
      'Rather Not Say',
      'Others',
      'Not Specified',
      'upto 10 years',
      '10 - 30 years',
      '30 - 60 years',
      '60+ years',
      'Month',
      'No badge earned for <initiative>',
      'People',
      'Labelled',
      'Translated',
      'Images labelled',
      'Images validated',
      'An unexpected error has occurred.',
      'We are processing multiple requests at the moment. Please try again after sometime.',
      'bronze',
      'silver',
      'gold',
      'platinum',
      'Bolo India',
      'Suno India',
      'Dekho India',
      'Likho India',
      'Bhasha Daan: A crowdsourcing initiative for Indian languages',
    ];

    const langSttr = {};
    list.forEach(key => {
      langSttr[key] = data[key];
    });
    res.send(langSttr);
  });
});

router.post('/feedback', validateUserInputForFeedback, (req, res) => {
  //  #swagger.tags = ['Support']
  //  #swagger.description = 'Endpoint to store user feedbacks'
  /*  #swagger.parameters['obj'] = {
        type: 'object',
        required: true,
        in: 'body',
        schema: {
            "feedback": "user feedback text",
            "category": "Complaint",
            "language": "Hindi",
            "email": "email@mail.com",
            "module": "Bolo India",
            "target_page": "Home page",
            "opinion_rating": "5",
            "recommended": "Yes",
            "revisit": "Yes"
        }} */
  const feedback = req.body.feedback.trim();
  const category = req.body.category.trim();
  const language = req.body.language.trim();
  const email = req.body.email.trim();
  const module = req.body.module;
  const target_page = req.body.target_page;
  const opinion_rating = req.body.opinion_rating;
  const recommended = req.body.recommended;
  const revisit = req.body.revisit;

  insertFeedback(
    email,
    feedback,
    category,
    language,
    module,
    target_page,
    opinion_rating,
    recommended,
    revisit
  )
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
  // #swagger.tags = ['Thank you']
  //  #swagger.description = 'Endpoint for reward details of user'
  /*
        #swagger.parameters['userId'] = {
                in: 'cookies',
                type: 'string',
                description: 'user id cookie',
                required: true,
                schema: 123
        }
        #swagger.parameters['type'] = {
        in: 'query',
        type: 'string',
        description: 'Type of initiative (asr/text/ocr/parallel)',
        required: true,
        schema: 'asr'
        }
        #swagger.parameters['source'] = {
        type: 'string',
        required: true,
        description: 'Source (contribute/validate)',
        in: 'query',
        schema: 'contribute'
        }
        #swagger.parameters['language'] = {
        type: 'string',
        required: true,
        in: 'query',
        schema: 'Hindi'
        }
        #swagger.parameters['userName'] = {
        type: 'string',
        required: true,
        in: 'query',
        schema: 'name'
        }
        #swagger.responses[200] = {
        description: 'response data',
        schema: {
            "badgeId": "1324",
            "currentBadgeType": "silver",
            "nextBadgeType": "gold",
            "sequence": "3rd",
            "currentMilestone": "25",
            "nextMilestone": "100",
            "contributionCount": "30",
            "isNewBadge": 'true',
            "badges": "[{ 'grade': 'bronze, 'generated_badge_id': '3321' }]",
            "currentAmount": "0.62",
            "languageGoal": "100"
            }
        } */
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
  // #swagger.tags = ['Thank you']
  /* #swagger.parameters['type'] = {
        in: 'query',
        type: 'string',
        description: 'Type of initiative (asr/text/ocr/parallel)',
        required: true,
        schema: 'asr'
        }
        #swagger.parameters['source'] = {
        type: 'string',
        required: true,
        description: 'Source (contribute/validate)',
        in: 'query',
        schema: 'contribute'
        }
        #swagger.parameters['language'] = {
        type: 'string',
        required: true,
        in: 'query',
        schema: 'Hindi'
        }
        #swagger.responses[200] = {
        description: 'response data',
        schema: [{
            "contributions": "50",
            "badge": "bronze"
            },
            {
            "contributions": "100",
            "badge": "silver"
            }]
        } */
  const { type, source, language } = req.query;

  const info = await getRewardsInfo(type, source, language);
  if (info && info.length > 0) {
    return res.send(info);
  }

  return res.status(404).send('Data not found');
});

router.get('/user-rewards/:username?', async (req, res) => {
  // #swagger.tags = ['Badges']
  /*
        #swagger.parameters['userId'] = {
                in: 'cookies',
                type: 'string',
                description: 'user id cookie',
                required: true,
                schema: 123
        }
        #swagger.parameters['username?'] = {
        type: 'string',
        required: false,
        in: 'query',
        schema: 'name'
        }
        #swagger.responses[200] = {
        description: 'response data',
        schema: [{
            "generated_at": "10:00",
            "generated_badge_id": "113",
            "language": "Hindi",
            "milestone": "100",
            "type": 'asr',
            "category": 'contribute',
            "grade": "bronze"
            }]
        } */
  const userId = req.cookies.userId || '';
  const userName = req.params.username || '';
  try {
    const rewardData = await getUserRewards(userId, userName);
    return res.send(rewardData);
  } catch (error) {
    console.log(error);
    res.status(502).send({ statusCode: 502, message: error.message });
  }
});

profanityApi(router);

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
