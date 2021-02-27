const {encrypt} = require('./encryptAndDecrypt');
const {getFile} = require('./downloader')
const {
    UpdateAudioPathAndUserDetails,
    setNewUserAndFileName,
    unassignIncompleteSentences,
    updateAndGetSentencesQuery,
    getValidationSentencesQuery,
    sentencesCount,
    getCountOfTotalSpeakerAndRecordedAudio,
    getGenderData,
    getAgeGroupsData,
    getMotherTonguesData,
    unassignIncompleteSentencesWhenLanChange,
    updateSentencesWithContributedState,
    addValidationQuery,
    updateSentencesWithValidatedState
} = require('./dbQuery');
const {KIDS_AGE_GROUP, ADULT, KIDS} = require('./constants');
const process = require('process');
const envVars = process.env;
const pgp = require('pg-promise')();

let cn = {
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
    host: envVars.DB_HOST,
    logging: false,
    dialect: 'postgres',
    ssl: false,
    dialectOptions: {
        ssl: false,
    },
    operatorsAliases: false,
};

const db = pgp(cn);

const updateDbWithAudioPath = function (
    audioPath,
    sentenceId,
    speakerDetails,
    userId,
    userName,
    state,
    country,
    cb
) {
    const speakerDetailsJson = JSON.parse(speakerDetails);
    let ageGroup = null,
        gender = null,
        motherTongue = null;
    if (speakerDetailsJson) {
        ageGroup = speakerDetailsJson.age;
        gender = speakerDetailsJson.gender;
        motherTongue = speakerDetailsJson.motherTongue;
    }
    const encryptUserId = encrypt(userId);
    db.any(UpdateAudioPathAndUserDetails, [
        audioPath,
        ageGroup,
        gender,
        motherTongue,
        sentenceId,
        encryptUserId,
        userName,
        state,
        country
    ])
        .then((data) => {
            db.none(updateSentencesWithContributedState, [sentenceId]).then();
            if (!data || !data.length) {
                db.any(setNewUserAndFileName, [audioPath, encryptUserId, sentenceId])
                    .then(() => cb(200, {success: true}))
                    .catch((err) => {
                        console.log(err);
                        cb(500, {error: true});
                    });
            } else {
                cb(200, {success: true});
            }
        })
        .catch((err) => {
            console.log(err);
            cb(500, {error: true});
        });
};

const getSentencesBasedOnAge = function (
    ageGroup,
    encryptedUserId,
    userName,
    language,
    motherTongue,
    gender
) {
    let languageLabel = ADULT;
    if (ageGroup === KIDS_AGE_GROUP) {
        languageLabel = KIDS;
    }
    return (db.many(updateAndGetSentencesQuery, [
        encryptedUserId,
        userName,
        languageLabel,
        language,
        motherTongue,
        gender,
        ageGroup
    ]));
};

const updateAndGetSentences = function (req, res) {
    const userId = req.cookies.userId;
    const userName = req.body.userName;
    const language = req.body.language;
    const motherTongue = req.body.motherTongue;
    const gender = req.body.gender;
    if (!userId || userName === null || userName === undefined) {
        res.status(400).send({error: 'required parameters missing'});
        return;
    }
    const ageGroup = req.body.age;
    const encryptedUserId = encrypt(userId);
    const sentences = getSentencesBasedOnAge(
        ageGroup,
        encryptedUserId,
        userName,
        language,
        motherTongue,
        gender
    );
    const count = db.one(sentencesCount, [encryptedUserId, userName, language]);
    const unAssign = db.any(unassignIncompleteSentences, [
        encryptedUserId,
        userName,
    ]);
    const unAssignWhenLanChange = db.any(
        unassignIncompleteSentencesWhenLanChange,
        [encryptedUserId, userName, language]
    );
    Promise.all([sentences, count, unAssign, unAssignWhenLanChange])
        .then((response) => {
            res.status(200).send({data: response[0], count: response[1].count});
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

const getValidationSentences = function (req, res) {
    const language = req.params.language;
    db.any(getValidationSentencesQuery, [language])
        .then((response) => {
            res.status(200).send({data: response})
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

const getAudioClip = function (req, res) {
    if (!(req.body && req.body.file)) {
        res.status(400).send('No file selected.');
        return;
    }
    const file = getFile(req.body.file)
    file.exists().then((result)=>{
        if(result[0]){
            const readStream = file.createReadStream();
            readStream.pipe(res);
        }
        else
            res.sendStatus(500);
    })
}

const updateTablesAfterValidation = function (req, res) {
    const validatorId = req.cookies.userId;
    const {sentenceId, action} = req.body
    return db.none(addValidationQuery, [validatorId, sentenceId, action]).then(() => {
        if (action !== 'skip')
            db.none(updateSentencesWithValidatedState, [sentenceId]).then(() => {
                res.sendStatus(200);
            })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
        else res.sendStatus(200);
    })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

const getAllDetails = function (language) {
    return db.any(getCountOfTotalSpeakerAndRecordedAudio, [language]);
};

const getAllInfo = function (language) {
    const genderData = db.any(getGenderData, [language]);
    const ageGroups = db.any(getAgeGroupsData, [language]);
    const motherTongues = db.any(getMotherTonguesData, [language]);
    return Promise.all([genderData, ageGroups, motherTongues]);
};

module.exports = {
    updateAndGetSentences,
    getValidationSentences,
    updateDbWithAudioPath,
    updateTablesAfterValidation,
    getAllDetails,
    getAllInfo,
    getAudioClip
};
