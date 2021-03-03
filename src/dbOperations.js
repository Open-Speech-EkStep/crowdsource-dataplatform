const {encrypt} = require('./encryptAndDecrypt');
const { downloader } = require('./downloader/objDownloader')
const {
    UpdateAudioPathAndUserDetails,
    setNewUserAndFileName,
    unassignIncompleteSentences,
    updateAndGetSentencesQuery,
    updateAndGetUniqueSentencesQuery,
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
const {
    topLanguagesBySpeakerContributions, 
    topLanguagesByHoursContributed, 
    cumulativeCount, 
    cumulativeDataByState, 
    cumulativeDataByLanguage, 
    cumulativeDataByLanguageAndState, 
    listLanguages, 
    dailyTimeline, 
    ageGroupContributions, 
    genderGroupContributions, 
    dailyTimelineCumulative,
    weeklyTimeline,
    weeklyTimelineCumulative,
    monthlyTimeline,
    monthlyTimelineCumulative,
    quarterlyTimeline,
    quarterlyTimelineCumulative
} = require('./dashboardDbQueries');

const { KIDS_AGE_GROUP, ADULT, KIDS } = require('./constants');
const envVars = process.env;
const pgp = require('pg-promise')();
const showUniqueSentences = envVars.UNIQUE_SENTENCES_FOR_CONTRIBUTION == 'true';

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
                    .then(() => cb(200, { success: true }))
                    .catch((err) => {
                        console.log(err);
                        cb(500, { error: true });
                    });
            } else {
                cb(200, { success: true });
            }
        })
        .catch((err) => {
            console.log(err);
            cb(500, { error: true });
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
    let query = updateAndGetSentencesQuery;

    if (ageGroup === KIDS_AGE_GROUP) {
        languageLabel = KIDS;
    }

    if( showUniqueSentences) {
        query = updateAndGetUniqueSentencesQuery
    }

    return (db.many(query, [
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
        res.status(400).send({ error: 'required parameters missing' });
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
            res.status(200).send({ data: response[0], count: response[1].count });
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
            res.status(200).send({ data: response })
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

const getAudioClip = function (req, res, objectStorage) {
    if (!(req.body && req.body.file)) {
        res.status(400).send('No file selected.');
        return;
    }


  const downloadFile = downloader(objectStorage);

    const file = downloadFile(req.body.file);
    file.exists().then((result)=>{
        if(result[0]){
            const readStream = file.createReadStream();
            readStream.pipe(res);
        }
        else
            res.sendStatus(404);
    })
}

const updateTablesAfterValidation = function (req, res) {
    const validatorId = req.cookies.userId;
    const { sentenceId, action } = req.body
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


const getTopLanguageByHours = () => {
    return db.any(topLanguagesByHoursContributed);
};

const getTopLanguageBySpeakers = () => {
    return db.any(topLanguagesBySpeakerContributions);
};

const getAggregateDataCount = (language, state) => {
    let query = "";
    if (language && state) {
        query = cumulativeDataByLanguageAndState;
    } else if (language) {
        query = cumulativeDataByLanguage;
    } else if (state) {
        query = cumulativeDataByState;
    } else {
        query = cumulativeCount;
    }
    return db.any(query);
}

const getLanguages = () => {
    return db.any(listLanguages, []);
}
const normalTimeLineQueries = {
    "weekly": weeklyTimeline,
    "daily": dailyTimeline,
    "monthly": monthlyTimeline,
    "quarterly": quarterlyTimeline
}

const cumulativeTimeLineQueries = {
    "weekly": weeklyTimelineCumulative,
    "daily": dailyTimelineCumulative,
    "monthly": monthlyTimelineCumulative,
    "quarterly": quarterlyTimelineCumulative
}
const getTimeline = (language = "", timeframe) => {
    timeframe = timeframe.toLowerCase();
    if (language.length !== 0) {
        languageFilter = `language iLike '${language}'`
        let filter = pgp.as.format('$1:raw', [languageFilter])
        let query = normalTimeLineQueries[timeframe] || weeklyTimeline;
        return db.any(query, filter);
    } else {
        let query = cumulativeTimeLineQueries[timeframe] || weeklyTimelineCumulative;
        return db.any(query, []);
    }
}

const getGenderGroupData = (language = '') => {
    let languageFilter = 'true';
    if (language.length !== 0) {
        languageFilter = `language iLike '${language}'`
    }
    let filter = pgp.as.format('$1:raw', [languageFilter])
    console.log(filter);
    return db.any(genderGroupContributions, filter);
}

const getAgeGroupData = (language = '') => {
    let languageFilter = "true";
    if (language.length !== 0) {
        languageFilter = `language iLike '${language}'`
    }
    let filter = pgp.as.format('$1:raw', [languageFilter])
    return db.any(ageGroupContributions, filter);
}

module.exports = {
    updateAndGetSentences,
    getValidationSentences,
    updateDbWithAudioPath,
    updateTablesAfterValidation,
    getAllDetails,
    getAllInfo,
    getAudioClip,
    getTopLanguageByHours,
    getAggregateDataCount,
    getTopLanguageBySpeakers,
    getLanguages,
    getTimeline,
    getAgeGroupData,
    getGenderGroupData
};
