const moment = require('moment');

const {
    updateContributionDetails,
    updateContributionDetailsWithUserInput,
    userVerifyQuery,
    getContributionListQuery,
    updateMediaWithContributedState,
    addValidationQuery,
    updateMediaWithValidatedState,
    feedbackInsertion,
    saveReportQuery,
    markContributionSkippedQuery,
    rewardsInfoQuery,
    getTotalUserContribution,
    getTotalUserValidation,
    checkCurrentMilestoneQuery,
    checkNextMilestoneQuery,
    insertRewardQuery,
    findRewardInfo,
    markMediaReported,
    markContributionReported,
    addContributorIfNotExistQuery,
    getLanguageGoalQuery,
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
    getUserRewardsQuery
} = require('./dbQuery');

const {
    getSentencesForProfanityCheck,
    updateSentenceWithProfanity,
    releaseMediaQuery,
    getSentencesForProfanityCheckForCorrection,
    updateSentenceWithProfanityForCorrection,
    releaseMediaQueryForCorrection
} = require('./profanityCheckerQueries')

const { KIDS_AGE_GROUP, ADULT, KIDS, BADGE_SEQUENCE } = require('./constants');

const cacheOperation = require('./cache/cacheOperations')
const queueOperations = require('./event_queue/queueOperations')

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

    if (ageGroup === KIDS_AGE_GROUP) {
        languageLabel = KIDS;
    }

    const launchIds = envVars.LAUNCH_IDS || '';

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
    const cacheResponse = await cacheOperation.getDataForContribution(type, language, toLanguage, userId, userName, db);
    if (cacheResponse) {
        console.log("from cache")
        res.status(200).send({ data: cacheResponse });
        return;
    }
    console.log("from db")
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
    const cacheResponse = await cacheOperation.getDataForValidation(type, fromLanguage, toLanguage, userId, userName,db);
    if (cacheResponse) {
        console.log("from cache")
        res.status(200).send({ data: cacheResponse });
        return;
    }
    const contributorId = await getContributorId(userId, userName);
    const query = type == 'parallel' ? getContributionListForParallel : getContributionListQuery
    db.any(query, [contributorId, type, fromLanguage, toLanguage])
        .then((response) => {
            res.status(200).send({ data: response });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

const updateTablesAfterValidation = async (req, res) => {
    const userId = req.cookies.userId;
    const { sentenceId, state = "", country = "", userName = "", device = "", browser = "", type, fromLanguage, language = "" } = req.body;
    const { action, contributionId } = req.params;
    const validatorId = await getContributorId(userId, userName);
    return db.result(addValidationQuery, [validatorId, sentenceId, action, contributionId, state, country, device, browser])
        .then(async (insertResult) => {
            console.log("/validate after validation insertion " + contributionId)
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
                res.status(200).send({message: "Validate Successfull"});
            }
            else  res.status(200).send({message: "Skip Successfull"});

            console.log("/validate after response set " + contributionId)
            cacheOperation.updateCacheAfterValidation(contributionId, type, fromLanguage, language, action, userId, userName);
            console.log("/validate after cache set " + contributionId)
        })
        .catch((err) => {
            console.log(err);
            if (err.message.includes('uc_validated_contribution')) {
                res.status(200).send({message: "Successfull"});
                cacheOperation.updateCacheAfterValidation(contributionId, type, fromLanguage, language, action, userId, userName);
                return;
            }
            res.sendStatus(500);
        });
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
    let contributorInfo = await db.one(addContributorIfNotExistQuery, [userId, userName, age, gender, motherTongue]);

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
        .then((contributionInsertResult) => {
            console.log("/store after contribution insertion" + datasetId)
            db.result(updateMediaWithContributedState, [datasetId]).then(result=>{
                if(result.rowCount == 0){
                    console.log(`Update Query Failure: Dataset with id = ${datasetId} , failed to be updated by contributor with id = ${contributor_id}`)
                }
            });
            
            cb(200, { success: true });
            if (type != 'parallel') {
                fromLanguage = language;
                language = '';
            }
            console.log("/store after response set " + datasetId);
            console.log(contributionInsertResult)
            cacheOperation.removeItemFromCache(datasetId, type, fromLanguage, language);
            queueOperations.sendForAutoValidation(contributionInsertResult[0].contribution_id)
            console.log("/store after cache updated" + datasetId)
        })
        .catch((err) => {
            console.log(err);
            cb(500, { error: true });
        });
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

module.exports = {
    userVerify,
    updateAndGetMedia,
    getContributionList,
    updateDbWithAudioPath,
    updateTablesAfterValidation,
    getSentencesForProfanityCheckingForCorrection,
    updateProfanityStatusForCorrection,
    releaseMediaForCorrection,
    getMediaBasedOnAge,
    insertFeedback,
    saveReport,
    markContributionSkipped,
    getRewards,
    getRewardsInfo,
    updateDbWithUserInput,
    getSentencesForProfanityChecking,
    updateProfanityStatus,
    releaseMedia,
    getUserRewards,
    addRemainingGenders
};
