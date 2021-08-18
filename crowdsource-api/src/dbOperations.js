const { downloader } = require('./downloader/objDownloader')
const moment = require('moment');

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
    updateViews,
    getBadges,
    addContributorQuery,
    getContributionHoursForLanguage,
    getLanguageGoalQuery,
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
    getValidationAmount,
    getUserRewardsQuery,
    getContributionDataForCaching
} = require('./dbQuery');

const {
    topLanguagesBySpeakerContributions,
    topLanguagesByHoursContributed,
    cumulativeCount,
    cumulativeDataByState,
    cumulativeDataByLanguage,
    cumulativeDataByLanguageV2,
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
    topLanguagesByContributionCount,
    languageGoalQuery,
    currentProgressQuery,
    participationStatsQuery
} = require('./dashboardDbQueries');

const {
    getSentencesForProfanityCheck,
    updateSentenceWithProfanity,
    releaseMediaQuery,
    getSentencesForProfanityCheckForCorrection,
    updateSentenceWithProfanityForCorrection,
    releaseMediaQueryForCorrection
} = require('./profanityCheckerQueries')

const { KIDS_AGE_GROUP, ADULT, KIDS, AGE_GROUP, BADGE_SEQUENCE } = require('./constants');

const cacheOperation = require('./cache/cacheOperations')

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
    type,
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
            db.result(updateMediaWithContributedState, [datasetId]).then(result=>{
                if(result.rowCount == 0){
                    console.log(`Update Query Failure: Dataset with id = ${datasetId} , failed to be updated by contributor with id = ${contributor_id}`)
                }
            });
            db.none(updateViews).then();
            cb(200, { success: true });
            cacheOperation.removeItemFromCache(datasetId, type, language, '');
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

const updateAndGetMedia = async (req, res) => {
    const userId = req.cookies.userId;
    const userName = req.body.userName;
    const language = req.body.language;
    const toLanguage = req.body.toLanguage || '';
    const type = req.params.type;

    const ageGroup = req.body.age;
    const cacheResponse = await cacheOperation.getDataForContribution(type, language, toLanguage, userId, userName);
    if (cacheResponse) {// && cacheResponse.length > 0
        console.log("from cache")
        res.status(200).send({ data: cacheResponse });
        return;
    }

    const media = getMediaBasedOnAge(
        ageGroup,
        userId,
        userName,
        language,
        type,
        toLanguage
    );
    Promise.all([media])
        .then((response) => {
            res.status(200).send({ data: response[0] });
            cacheOperation.setContributionDataForCaching(db, type, language, toLanguage);
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
    const cacheResponse = await cacheOperation.getDataForValidation(type, fromLanguage, toLanguage, userId, userName);
    if (cacheResponse) {// && cacheResponse.length > 0
        console.log("from cache")
        res.status(200).send({ data: cacheResponse });
        return;
    }
    const query = type == 'parallel' ? getContributionListForParallel : getContributionListQuery
    db.any(query, [contributorId, type, fromLanguage, toLanguage])
        .then((response) => {
            res.status(200).send({ data: response });
            cacheOperation.setValidationDataForCaching(db, type, fromLanguage, toLanguage);
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
    const { sentenceId, state = "", country = "", userName = "", device = "", browser = "", type, fromLanguage, language = "" } = req.body;
    const { action, contributionId } = req.params;
    const validatorId = await getContributorId(userId, userName);
    return db.result(addValidationQuery, [validatorId, sentenceId, action, contributionId, state, country, device, browser])
        .then(async (insertResult) => {
            if(insertResult && insertResult.rowCount === 0){
                res.status(422).send("Contributor cannot validate his own contribution");
                return;
            }
            if (action !== 'skip') {
                db.result(updateMediaWithValidatedState, [sentenceId, contributionId]).then(result=>{
                    if(result.rowCount == 0){
                        console.log(`Update Query Failure: Sentence with id = ${sentenceId} , failed to be updated by contributor with id = ${contributionId}`)
                    }
                })
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    });
                db.none(updateViews).then().catch(console.log);
                res.status(200).send({message: "Validate Successfull"});
            }
            else  res.status(200).send({message: "Skip Successfull"});

            cacheOperation.updateCacheAfterValidation(contributionId, type, fromLanguage, language, action, userId, userName);
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

const getAggregateDataCountV2 = (language, state, type) => {
    const typeFilter = `type='${type}'`;
    let filter = pgp.as.format('$1:raw', [typeFilter])
    let query = "select 1";
    if (typeof language !== "boolean") {
        language = language === 'true' ? true : false;
    }
    if (typeof state !== "boolean") {
        state = state === 'true' ? true : false;
    }
    if (language && state && language === true && state === true) {
        // query = cumulativeDataByLanguageAndState;
    } else if (language && language === true) {
        query = cumulativeDataByLanguageV2;
    } else if (state && state === true) {
        // query = cumulativeDataByState;
    } else {
        // query = cumulativeCount;
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

const insertFeedback = (email, feedback, category, language, module, target_page, opinion_rating, recommended, revisit) => {
    return db.any(feedbackInsertion, [email, feedback, category, language, module, target_page, opinion_rating, recommended, revisit]);
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
    const sequence = BADGE_SEQUENCE[nextBadgeType] || '';
    const currentMilestone = currentMilestoneData.milestone || 0;
    const nextMilestone = nextMilestoneData.milestone || 0;
    const languageGoal = await getLanguageGoal(language, source, type);
    const currentAmount = await getCurrentAmountForLanguage(type, source, language);
    return {
        "badgeId": generatedBadgeId,
        "currentBadgeType": currentBadgeType,
        "nextBadgeType": nextBadgeType,
        "sequence": sequence,   
        "currentMilestone": currentMilestone,
        "nextMilestone": nextMilestone,
        "contributionCount": Number(total_count),
        "isNewBadge": isNewBadge,
        'badges': badges,
        'currentAmount': currentAmount,
        'languageGoal': languageGoal
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

    const currentLanguageAmount = await db.oneOrNone(query, [language, type]);
    return parseFloat(currentLanguageAmount['amount']);
}

const getLanguageGoal = async (language, source, type) => {
    const languageGoal = await db.oneOrNone(getLanguageGoalQuery, [source, type, language]);
    return languageGoal['goal'];
}

const languageGoal = async (req, res) => {
    try {
        const { type, language, source } = req.params;
        const goal = await getLanguageGoal(language, source, type);
        res.status(200).send({ goal });
    } catch (err) {
        console.log(err);
        res.send(500);
    }
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
    type,
    fromLanguage,
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
            db.result(updateMediaWithContributedState, [datasetId]).then(result=>{
                if(result.rowCount == 0){
                    console.log(`Update Query Failure: Dataset with id = ${datasetId} , failed to be updated by contributor with id = ${contributor_id}`)
                }
            });
            db.none(updateViews).then();
            
            if (type != 'parallel') {
                fromLanguage = language;
                language = '';
            }
            cacheOperation.removeItemFromCache(datasetId, type, fromLanguage, language);
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
    const toLanguage = type == 'parallel' ? targetLanguage : sourceLanguage;
    const hasTargetQ = db.one(hasTargetQuery, [type, sourceLanguage, toLanguage]);
    const isAllContributedQ = db.one(isAllContributedQuery, [type, sourceLanguage, toLanguage]);
    Promise.all([hasTargetQ, isAllContributedQ])
    .then(response => {
        res.status(200).send({ hasTarget: response[0].result, isAllContributed: response[1].result });
    })    
}

const getSentencesForProfanityChecking = (username, type, language) => {
    const currentTime = moment().utcOffset("+05:30").format()
    return db.any(getSentencesForProfanityCheck, [username, currentTime, type, language])
}

const getSentencesForProfanityCheckingForCorrection = (username, type, language) => {
    const currentTime = moment().utcOffset("+05:30").format()
    return db.any(getSentencesForProfanityCheckForCorrection, [username, currentTime, type, language])
}

const updateProfanityStatus = (userName, sentenceId, profanityStatus) => {
    const currentTime = moment().utcOffset("+05:30").format()
    return db.any(updateSentenceWithProfanity, [profanityStatus, sentenceId, userName, currentTime])
}

const updateProfanityStatusForCorrection = (userName, sentenceId, profanityStatus) => {
    const currentTime = moment().utcOffset("+05:30").format()
    return db.any(updateSentenceWithProfanityForCorrection, [profanityStatus, sentenceId, userName, currentTime])
}

const releaseMedia = (dataset_id) => {
    return db.any(releaseMediaQuery, [dataset_id])
}

const releaseMediaForCorrection = (dataset_id) => {
    return db.any(releaseMediaQueryForCorrection, [dataset_id])
}

const userVerify = async (userName, role) => {
    let result = await db.any(userVerifyQuery, [userName, role]);
    if (result.length === 0) {
        throw new Error("No user found")
    }
}

const getUserRewards = async (userId, userName) => {
    const contributor_id = await getContributorId(userId, userName);
    return db.any(getUserRewardsQuery, [contributor_id]);
}

const addRemainingGenders = (genderGroupData, allGenders) => {
    const haveDataForGenders = genderGroupData.map(gd => gd.gender);

    allGenders.forEach((gender) => {
        if (!haveDataForGenders.includes(gender)) {
            genderGroupData.push({
                gender: gender,
                contributions: '0',
                hours_contributed: '0',
                hours_validated: '0',
                speakers: '0'
            });
        }
    });
    return genderGroupData;
}

const getGoalForContributionProgress = async(type, language, source) => {
    if(type === 'parallel'){
        language = language.split('-')[0];
    }
    let goalFilter = `1=1`;
    if (type && type.length !== 0) {
        goalFilter += ` and type = '${type}'`
    }
    if (language && language.length !== 0) {
        goalFilter += ` and LOWER(language) = LOWER('${language}')`;
    }
    if (source && source.length !== 0) {
        goalFilter += ` and category = '${source}'`
    }
    
    let filter = pgp.as.format('$1:raw', [goalFilter]);
    const goalResult = await db.any(languageGoalQuery, filter);
    
    return goalResult && goalResult[0] && goalResult[0].goal ? goalResult[0].goal : 0;
}
const getProgressForContributionProgress = async (type, language) => {
    let progressFilter = `1=1`;
    if (type && type.length !== 0) {
        progressFilter += ` and type = '${type}'`
    }
    if (language && language.length !== 0) {
        progressFilter +=` and LOWER(language) = LOWER('${language}')`;
    }
    let filter = pgp.as.format('$1:raw', [progressFilter]);
    
    const progressResult = await db.any(currentProgressQuery, filter);

    return progressResult && progressResult[0] ? progressResult[0] : { total_contributions: 0, total_validations: 0, total_contribution_count: 0, total_validation_count: 0 };
}
const getProgressResultBasedOnTypeAndSource = (progressResult, type, source) => {
    let progress = 0;
    if (progressResult && progressResult.length != 0) {

        let resultObj = { contribute: 0, validate: 0 };

        if (['text', 'asr'].includes(type)) {
            resultObj.contribute = progressResult.total_contributions;
            resultObj.validate = progressResult.total_validations;
        }
        else {
            resultObj.contribute = progressResult.total_contribution_count;
            resultObj.validate = progressResult.total_validation_count;
        }

        if (source && source.length > 0) {
            progress = Number(resultObj[source] || 0);
        }
        else {
            progress = (Number(resultObj['contribute'] || 0) + Number(resultObj['validate']) || 0) || 0;
        }
    }
    if (['text', 'asr'].includes(type)) {
        return progress.toFixed(3);
    }
    return progress;
}

const increaseGoalIfLessThanCurrentProgress = (progress, goal) => {
    if (goal === 0) return goal;
    while(goal - 5 < progress) {
        goal *= 2;
    }
    return goal;
}

const getContributionProgress = async (type, language, source) => {
    let goal = await getGoalForContributionProgress(type, language, source);
    
    const progressResult = await getProgressForContributionProgress(type, language);
    
    const progress = getProgressResultBasedOnTypeAndSource(progressResult, type, source);
    
    goal = increaseGoalIfLessThanCurrentProgress(progress, goal);

    return {
        'goal': goal,
        'currentProgress': progress
    }
}

const getParticipationStats = () => {
    return db.many(participationStatsQuery);
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
    getSentencesForProfanityCheckingForCorrection,
    updateProfanityStatusForCorrection,
    releaseMediaForCorrection,
    getAggregateDataCount,
    getAggregateDataCountV2,
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
    languageGoal,
    updateDbWithUserInput,
    getAvailableLanguages,
    getTargetInfo,
    getSentencesForProfanityChecking,
    updateProfanityStatus,
    releaseMedia,
    getUserRewards,
    addRemainingGenders,
    getContributionProgress,
    getGoalForContributionProgress,
    getProgressForContributionProgress,
    getProgressResultBasedOnTypeAndSource,
    increaseGoalIfLessThanCurrentProgress,
    getParticipationStats
};
