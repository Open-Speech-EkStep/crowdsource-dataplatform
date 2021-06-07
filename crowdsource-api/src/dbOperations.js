const { downloader } = require('./downloader/objDownloader')
const moment = require('moment');
const { uploader } = require('./uploader/objUploader')

const {
    updateContributionDetails,
    updateContributionDetailsWithUserInput,
    unassignIncompleteMedia,
    updateAndGetMediaQuery,
    updateAndGetUniqueMediaQuery,
    updateAndGetOrderedMediaQuery,
    userVerifyQuery,
    getContributionListQuery,
    mediaCount,
    getCountOfTotalSpeakerAndRecordedAudio,
    getGenderData,
    getAgeGroupsData,
    getMotherTonguesData,
    unassignIncompleteMediaWhenLanChange,
    updateMediaWithContributedState,
    addValidationQuery,
    updateMediaWithValidatedState,
    feedbackInsertion,
    getPathFromContribution,
    getPathFromMasterDataSet,
    saveReportQuery,
    getMediaForLaunch,
    markContributionSkippedQuery,
    rewardsInfoQuery,
    getTotalUserContribution,
    getTotalUserValidation,
    checkCurrentMilestoneQuery,
    checkNextMilestoneQuery,
    insertRewardQuery,
    getContributorIdQuery,
    findRewardInfo,
    markMediaReported,
    markContributionReported,
    updateMaterializedViews,
    getBadges,
    addContributorQuery,
    getContributionHoursForLanguage,
    getLanguageGoal,
    getOrderedMediaQuery,
    getContributionLanguagesQuery,
    getDatasetLanguagesQuery,
    hasTargetQuery,
    isAllContributedQuery,
    getDataRowInfo,
    getOrderedUniqueMediaQuery,
    getOrderedUniqueMediaForParallel,
    getContributionListForParallel,
    getContributionHoursForAsr,
    getValidationHoursForAsr,
    getContributionHoursForText,
    getValidationHoursForText,
    getContributionAmount,
    getValidationAmount
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
    lastUpdatedAtQuery,
    topLanguagesByContributionCount
} = require('./dashboardDbQueries');

const {
    getSentencesForProfanityCheck,
    updateSentenceWithProfanity,
    releaseMediaQuery
} = require('./profanityCheckerQueries')

const { KIDS_AGE_GROUP, ADULT, KIDS, AGE_GROUP } = require('./constants');

const envVars = process.env;
const pgp = require('pg-promise')();

const showUniqueMedia = envVars.UNIQUE_SENTENCES_FOR_CONTRIBUTION == 'true';

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

const checkLanguageValidity = async (datasetId, language) => {
    const dataRowInfo = await db.oneOrNone(getDataRowInfo, [datasetId]);

    const invalidLanguage = dataRowInfo.type == 'parallel' ? dataRowInfo.language == language : dataRowInfo.language != language;

    return !invalidLanguage;
}

const updateDbWithAudioPath = async (
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
    cb
) => {
    const validLanguage = await checkLanguageValidity(datasetId, language)
    if (!validLanguage) {
        cb(400, { error: 'Bad Request' });
        return
    }

    const roundedAudioDuration = audioDuration ? Number(Number(audioDuration).toFixed(3)) : 0;

    const contributor_id = await getContributorId(userId, userName, age, gender, motherTongue)

    db.any(updateContributionDetails, [
        datasetId,
        contributor_id,
        audioPath,
        language,
        roundedAudioDuration,
        state,
        country,
        device,
        browser
    ])
        .then(() => {
            db.none(updateMediaWithContributedState, [datasetId]).then();
            db.none(updateMaterializedViews).then();
            cb(200, { success: true });
        })
        .catch((err) => {
            console.log(err);
            cb(500, { error: true });
        });
};

const getMediaBasedOnAge = function (
    ageGroup,
    userId,
    userName,
    language,
    type,
    toLanguage
) {
    let languageLabel = ADULT;
    // let query = updateAndGetMediaQuery;

    if (ageGroup === KIDS_AGE_GROUP) {
        languageLabel = KIDS;
    }

    if (showUniqueMedia) {
        // query = updateAndGetUniqueMediaQuery;
    }

    const launchUser = envVars.LAUNCH_USER || 'launch_user';
    const launchIds = envVars.LAUNCH_IDS || '';

    if (userName == launchUser) {
        // query = getMediaForLaunch;
    }

    let query = getOrderedUniqueMediaQuery;
    let params = [userId, userName, languageLabel, language, type, launchIds.split(', ')];
    if (type === 'parallel') {
        query = getOrderedUniqueMediaForParallel;
        params = [userId, userName, languageLabel, language, type, toLanguage, launchIds.split(', ')]
    }

    return (db.any(query, params));
};

const updateAndGetMedia = function (req, res) {
    const userId = req.cookies.userId;
    const userName = req.body.userName;
    const language = req.body.language;
    const toLanguage = req.body.toLanguage || '';
    const type = req.params.type;

    const ageGroup = req.body.age;
    const media = getMediaBasedOnAge(
        ageGroup,
        userId,
        userName,
        language,
        type,
        toLanguage
    );
    const count = db.one(mediaCount, [userId, userName, language]);
    const unAssign = db.any(unassignIncompleteMedia, [
        userId,
        userName,
    ]);
    const unAssignWhenLanChange = db.any(
        unassignIncompleteMediaWhenLanChange,
        [userId, userName, language]
    );
    Promise.all([media, count, unAssign, unAssignWhenLanChange])
        .then((response) => {
            res.status(200).send({ data: response[0], count: response[1].count });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

const getContributionList = async function (req, res) {
    const fromLanguage = req.query.from;
    const toLanguage = req.query.to || '';
    const type = req.params.type;
    const userId = req.cookies.userId;
    const userName = req.query.username || '';
    const contributorId = await getContributorId(userId, userName);
    const query = type == 'parallel' ? getContributionListForParallel : getContributionListQuery
    db.any(query, [contributorId, type, fromLanguage, toLanguage])
        .then((response) => {
            res.status(200).send({ data: response })
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

const getMediaObject = (req, res, objectStorage) => {
    const entityId = req.params.entityId;
    const query = req.params.source == "contribute" ? getPathFromMasterDataSet : getPathFromContribution;
    db.one(query, [entityId]).then(async (data) => {
        const downloadFile = downloader(objectStorage);

        try {
            const file = await downloadFile(data.path);

            if (file == null) {
                res.sendStatus(404);
            } else {
                const readStream = file.createReadStream();
                readStream.pipe(res);
            }
        } catch (err) {
            res.sendStatus(500);
        }
    })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });

}

const updateTablesAfterValidation = async (req, res) => {
    const userId = req.cookies.userId;
    const { sentenceId, state = "", country = "", userName = "", device = "", browser = "" } = req.body;
    const { action, contributionId } = req.params;
    const validatorId = await getContributorId(userId, userName);
    return db.none(addValidationQuery, [validatorId, sentenceId, action, contributionId, state, country, device, browser])
        .then(async () => {
            if (action !== 'skip') {
                db.none(updateMediaWithValidatedState, [sentenceId, contributionId]).then()
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    });
                db.none(updateMaterializedViews).then();
                res.sendStatus(200);
            }
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

const getTypeFilter = (type) => {
    const typeFilter = `type='${type}'`;
    return pgp.as.format('$1:raw', [typeFilter])
}

const getTopLanguageByHours = (type) => {
    const filter = getTypeFilter(type);
    return db.any(topLanguagesByHoursContributed, filter);
};

const getTopLanguageByContributionCount = (type) => {
    const filter = getTypeFilter(type);
    return db.any(topLanguagesByContributionCount, filter);
};

const getTopLanguageBySpeakers = (type) => {
    const filter = getTypeFilter(type);
    return db.any(topLanguagesBySpeakerContributions, filter);
};

const getAggregateDataCount = (language, state, type) => {
    const typeFilter = `type='${type}'`;
    let filter = pgp.as.format('$1:raw', [typeFilter])
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
    return db.any(query, filter);
}

const getLanguages = (type) => {
    const filter = getTypeFilter(type);
    return db.any(listLanguages, filter);
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

const getTimeline = (timeframe, type, language = "") => {
    timeframe = timeframe.toLowerCase();
    const typeFilter = `type='${type}'`;
    if (language.length !== 0) {
        let languageFilter = `language iLike '${language}'`
        let filter = pgp.as.format('$1:raw', [`${typeFilter} and ${languageFilter}`])
        let query = normalTimeLineQueries[timeframe] || weeklyTimeline;
        return db.any(query, filter);
    } else {
        let query = cumulativeTimeLineQueries[timeframe] || weeklyTimelineCumulative;
        let filter = pgp.as.format('$1:raw', [typeFilter])
        return db.any(query, filter);
    }
}

const getGenderGroupData = (type, language = '') => {
    let languageFilter = `type = '${type}'`;
    if (language.length !== 0) {
        languageFilter += ` and language iLike '${language}'`
    }
    let filter = pgp.as.format('$1:raw', [languageFilter])
    return db.any(genderGroupContributions, filter);
}

const getAgeGroupData = async (type, language = '') => {
    let languageFilter = `type = '${type}'`;
    if (language.length !== 0) {
        languageFilter += ` and language iLike '${language}'`
    }
    let filter = pgp.as.format('$1:raw', [languageFilter])
    const data = await db.any(ageGroupContributions, filter);
    let response = [];
    for (let ind in AGE_GROUP) {
        const age = AGE_GROUP[ind];
        let isPresent = false, item = {};
        for (let d in data) {
            item = data[d];
            if (item['age_group'] === age) {
                isPresent = true;
                break;
            }
        }
        if (isPresent) {
            response.push(item);
        } else {
            response.push({ "age_group": age, "contributions": 0, "hours_contributed": 0, "hours_validated": 0, "speakers": 0 })
        }
    }
    return response;
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

const insertFeedback = (email, feedback, category, language, module, target_page, opinion_rating) => {
    return db.any(feedbackInsertion, [email, feedback, category, language, module, target_page, opinion_rating]);
}

const saveReport = async (userId, datasetId, reportText, language, userName, source) => {
    const contributor_id = await getContributorId(userId, userName)
    await db.any(saveReportQuery, [contributor_id, datasetId, reportText, language, source]);
    if (source === "validation") {
        await db.any(markContributionReported, [userId, userName, datasetId]);
    }
    else if (source === "contribution") {
        await db.any(markMediaReported, [userId, userName, datasetId]);
    }
}

const markContributionSkipped = async (userId, datasetId, userName, language, state_region = "", country = "", device = "", browser = "") => {
    const contributor_id = await getContributorId(userId, userName);
    await db.any(markContributionSkippedQuery, [contributor_id, datasetId, language, state_region, country, device, browser]);
}

const getContributorId = async (userId, userName, age = '', gender = '', motherTongue = '') => {
    let contributorInfo = await db.oneOrNone(getContributorIdQuery, [userId, userName]);

    if (!contributorInfo) {
        contributorInfo = await db.one(addContributorQuery, [userId, userName, age, gender, motherTongue]);
    }

    return contributorInfo.contributor_id;
}

const createBadge = async (contributor_id, language, currentMilestoneData, source, type) => {
    let isNewBadge = false, generatedBadgeId = '';

    let acquiredBadges = await db.any(findRewardInfo, [contributor_id, language, source, type]);
    const currentMilestoneBadgeMatch = acquiredBadges.filter(function (value) {
        if (value.milestone_id === currentMilestoneData.milestone_id) {
            return value
        }
    })

    acquiredBadges = acquiredBadges.map((value) => {
        return { 'grade': value.grade, 'generated_badge_id': value.generated_badge_id }
    })

    if (currentMilestoneBadgeMatch.length === 0) {
        isNewBadge = true;
        const insertResponse = await db.any(insertRewardQuery, [contributor_id, currentMilestoneData.milestone_id]);
        generatedBadgeId = insertResponse[0].generated_badge_id;
        acquiredBadges.push({ 'grade': currentMilestoneData.grade, 'generated_badge_id': generatedBadgeId })
    }

    return { isNewBadge, generatedBadgeId, badges: acquiredBadges };
}

const getNextMilestoneData = async (total_count, language, source, type) => {
    let nextMilestoneData = await db.oneOrNone(checkNextMilestoneQuery, [total_count, language, source, type]);
    if (!nextMilestoneData) {
        nextMilestoneData = {
            'grade': '',
            'milestone': 0
        }
    }
    return nextMilestoneData;
}

const getCurrentMilestoneData = async (total_count, language, type, source) => {
    let currentMilestoneData = await db.oneOrNone(checkCurrentMilestoneQuery, [total_count, language, type, source]);
    let isCurrentAvailable = true
    if (!currentMilestoneData) {
        isCurrentAvailable = false;
        currentMilestoneData = {
            'grade': '',
            'milestone': 0
        }
    }
    return { isCurrentAvailable, currentMilestoneData };
}

const getRewards = async (userId, userName, language, source, type) => {
    const contributor_id = await getContributorId(userId, userName);
    const getTotalEntriesQuery = source == 'contribute' ? getTotalUserContribution : getTotalUserValidation;
    let entries = await db.any(getTotalEntriesQuery, [contributor_id, language, type]);
    let total_count = 0;
    if (entries) {
        total_count = entries.length;
    }

    const { isCurrentAvailable, currentMilestoneData } = await getCurrentMilestoneData(total_count, language, type, source);

    let isNewBadge = false, generatedBadgeId = '', badges = [];
    if (isCurrentAvailable) {
        ({ isNewBadge, generatedBadgeId, badges } = await createBadge(contributor_id, language, currentMilestoneData, source, type));
    }

    const nextMilestoneData = await getNextMilestoneData(total_count, language, source, type);
    const currentBadgeType = currentMilestoneData.grade || '';
    const nextBadgeType = nextMilestoneData.grade || '';
    const currentMilestone = currentMilestoneData.milestone || 0;
    const nextMilestone = nextMilestoneData.milestone || 0;
    const hourGoal = await getHourGoalForLanguage(language, source, type);
    return {
        "badgeId": generatedBadgeId,
        "currentBadgeType": currentBadgeType,
        "nextBadgeType": nextBadgeType,
        "currentMilestone": currentMilestone,
        "nextMilestone": nextMilestone,
        "contributionCount": Number(total_count),
        "isNewBadge": isNewBadge,
        'badges': badges,
        'hourGoal': hourGoal
    }
}

const getRewardsInfo = (type, source, language) => {
    return db.any(rewardsInfoQuery, [type, source, language]);
}

async function getCurrentAmountForLanguage(type, source, language) {
    let query;
    if (type == 'asr') {
        if (source == 'contribute') {
            query = getContributionHoursForAsr;
        } else
            query = getValidationHoursForAsr;
    }
    else if (type == 'text') {
        if (source == 'contribute') {
            query = getContributionHoursForText;
        } else
            query = getValidationHoursForText;
    }
    else {
        if (source == 'contribute') {
            query = getContributionAmount;
        } else
            query = getValidationAmount;
    }

    const currentLanguageAmount = await db.one(query, [language, type]);
    return currentLanguageAmount;
}

const getHourGoalForLanguage = async (language, source, type) => {
    const languageGoal = await db.oneOrNone(getLanguageGoal, [source, type, language]);
    return languageGoal['goal'];
}

const updateDbWithUserInput = async (
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
    cb) => {
    const validLanguage = await checkLanguageValidity(datasetId, language)
    if (!validLanguage) {
        cb(400, { error: 'Bad Request' });
        return
    }
    const contributor_id = await getContributorId(userId, userName, age, gender, motherTongue,)

    db.any(updateContributionDetailsWithUserInput, [
        datasetId,
        contributor_id,
        userInput,
        language,
        state,
        country,
        device,
        browser
    ])
        .then(() => {
            db.none(updateMediaWithContributedState, [datasetId]).then();
            db.none(updateMaterializedViews).then();
            cb(200, { success: true });
        })
        .catch((err) => {
            console.log(err);
            cb(500, { error: true });
        });
}

const getAvailableLanguages = async (req, res) => {
    const type = req.params.type
    let datasetLanguageList = []
    try {
        datasetLanguageList = await db.any(getDatasetLanguagesQuery, [type]);

        const datasetLanguages = datasetLanguageList.map((value) => value.language);

        res.status(200).send({ datasetLanguages })

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

const getTargetInfo = async (req, res) => {
    const { type, sourceLanguage } = req.params;
    const { targetLanguage = '' } = req.query;
    let hasTarget = false, isAllContributed = false;
    const toLanguage = type == 'parallel' ? targetLanguage : sourceLanguage;
    hasTarget = (await db.one(hasTargetQuery, [type, sourceLanguage, toLanguage])).result;
    isAllContributed = (await db.one(isAllContributedQuery, [type, sourceLanguage, toLanguage])).result;
    res.status(200).send({ hasTarget, isAllContributed });
}

const getSentencesForProfanityChecking = (username, type, language) => {
    currentTime = moment().utcOffset("+05:30").format()
    return db.any(getSentencesForProfanityCheck, [username, currentTime, type, language])
}

const updateProfanityStatus = async (userName, sentenceId, profanityStatus) => {
    await db.any(updateSentenceWithProfanity, [profanityStatus, sentenceId, userName])
}

const releaseMedia = (dataset_id) => {
    return db.any(releaseMediaQuery, [dataset_id])
}

const userVerify = async (userName, role) => {
    let result = await db.any(userVerifyQuery, [userName, role]);
    if (result.length === 0) {
        throw new Error("No user found")
    }
}

module.exports = {
    userVerify,
    updateAndGetMedia,
    getContributionList,
    updateDbWithAudioPath,
    updateTablesAfterValidation,
    getAllDetails,
    getAllInfo,
    getMediaObject,
    getTopLanguageByHours,
    getTopLanguageByContributionCount,
    getAggregateDataCount,
    getTopLanguageBySpeakers,
    getLanguages,
    getTimeline,
    getAgeGroupData,
    getGenderGroupData,
    getLastUpdatedAt,
    getMediaBasedOnAge,
    insertFeedback,
    saveReport,
    markContributionSkipped,
    getRewards,
    getRewardsInfo,
    updateDbWithUserInput,
    getAvailableLanguages,
    getTargetInfo,
    getSentencesForProfanityChecking,
    updateProfanityStatus,
    releaseMedia
};
