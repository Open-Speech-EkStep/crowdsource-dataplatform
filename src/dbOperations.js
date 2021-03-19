const { encrypt } = require('./encryptAndDecrypt');
const { downloader } = require('./downloader/objDownloader')
const moment = require('moment');

const {
    updateContributionDetails,
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
    updateSentencesWithValidatedState,
    feedbackInsertion,
    getAudioPath,
    saveReportQuery
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
    quarterlyTimelineCumulative,
    lastUpdatedAtQuery
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
    audioDuration,
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
    const roundedAudioDuration = Number(Number(audioDuration).toFixed(3));

    db.any(updateContributionDetails, [
        audioPath,
        ageGroup,
        gender,
        motherTongue,
        sentenceId,
        encryptUserId,
        userName,
        state,
        country,
        roundedAudioDuration
    ])
        .then(() => {
            db.none(updateSentencesWithContributedState, [sentenceId]).then();
            cb(200, { success: true });
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

    if (showUniqueSentences) {
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
    if (!(req.body && req.body.contributionId)) {
        res.status(400).send('No file selected.');
        return;
    }

    const contributionId = req.body.contributionId;
    db.one(getAudioPath, [contributionId]).then(async (data) => {
        const downloadFile = downloader(objectStorage);

        try {
            const file = await downloadFile(data.audio_path);

            if (file == null) {
                res.sendStatus(404);
            }
            else {
                const readStream = file.createReadStream();
                readStream.pipe(res);
            }
        }
        catch (err) {
            res.sendStatus(500);
        }
    })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });;
}

const updateTablesAfterValidation = function (req, res) {
    const validatorId = req.cookies.userId;
    const { sentenceId, action, contributionId, state = "", country = "" } = req.body
    return db.none(addValidationQuery, [validatorId, sentenceId, action, contributionId, state, country]).then(() => {
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
    if (typeof language !== "boolean") {
        language = language === 'true' ? true : false;
    }
    if (typeof state !== "boolean") {
        state = state === 'true' ? true : false;
    }
    if (language && state && language === true && state === true) {
        query = cumulativeDataByLanguageAndState;
    } else if (language && language === true) {
        query = cumulativeDataByLanguage;
    } else if (state && state === true) {
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

const getLastUpdatedAt = async () => {
    const lastUpdatedAt = await db.one(lastUpdatedAtQuery, []);
    let lastUpdatedDateTime = "";
    if ("timezone" in lastUpdatedAt) {
        try {
            lastUpdatedDateTime = moment(lastUpdatedAt['timezone']).format('DD-MM-YYYY, h:mm:ss a');
        } catch (err) {
            console.log(err);
        }
    }
    return lastUpdatedDateTime;
}

const insertFeedback = (subject, feedback, language) => {
    return db.any(feedbackInsertion, [subject, feedback, language]);
}

const saveReport = async (userId, sentenceId, reportText, language, userName) => {
    await db.any(saveReportQuery,[userId, userName, sentenceId, reportText, language])
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
    getGenderGroupData,
    getLastUpdatedAt,
    getSentencesBasedOnAge,
    insertFeedback,
    saveReport
};
