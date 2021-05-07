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
    getMultiplierForHourGoal,
    getOrderedMediaQuery,
    getContributionLanguagesQuery,
    getDatasetLanguagesQuery
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

const updateDbWithAudioPath = async (
    audioPath,
    sentenceId,
    userId,
    userName,
    state,
    country,
    audioDuration,
    language,
    age,
    gender,
    motherTongue,
    cb
) => {
    const roundedAudioDuration = audioDuration ? Number(Number(audioDuration).toFixed(3)) : 0;

    const contributor_id = await getContributorId(userId, userName, age, gender, motherTongue,)

    db.any(updateContributionDetails, [
        sentenceId,
        contributor_id,
        audioPath,
        language,
        roundedAudioDuration,
        state,
        country
    ])
        .then(() => {
            db.none(updateMediaWithContributedState, [sentenceId]).then();
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
    type
) {
    let languageLabel = ADULT;
    // let query = updateAndGetMediaQuery;

    if (ageGroup === KIDS_AGE_GROUP) {
        languageLabel = KIDS;
    }

    if (showUniqueMedia) {
        // query = updateAndGetUniqueMediaQuery;
    }

    let query = getOrderedMediaQuery;
    const launchUser = envVars.LAUNCH_USER || 'launch_user';
    const launchIds = envVars.LAUNCH_IDS || '';

    if (userName == launchUser) {
        // query = getMediaForLaunch;
    }

    return (db.many(query, [
        userId,
        userName,
        languageLabel,
        language,
        type,
        launchIds.split(', ')
    ]));
};

const updateAndGetMedia = function (req, res) {
    const userId = req.cookies.userId;
    const userName = req.body.userName;
    const language = req.body.language;
    const type = req.params.type;

    const ageGroup = req.body.age;
    const media = getMediaBasedOnAge(
        ageGroup,
        userId,
        userName,
        language,
        type
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

const getContributionList = function (req, res) {
    const fromLanguage = req.query.from;
    const toLanguage = req.query.to;
    const type = req.params.type;
    const userId = req.cookies.userId;
    db.any(getContributionListQuery, [userId, type, fromLanguage, toLanguage])
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

const updateTablesAfterValidation = (req, res) => {
    const validatorId = req.cookies.userId;
    const { sentenceId, state = "", country = "" } = req.body;
    const { action, contributionId } = req.params;
    return db.none(addValidationQuery, [validatorId, sentenceId, action, contributionId, state, country])
        .then(async () => {
            if (action !== 'skip') {
                db.none(updateMediaWithValidatedState, [sentenceId, contributionId]).then(() => {
                    res.sendStatus(200);
                })
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    });
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
    let filter = pgp.as.format('$1:raw', [typeFilter])
    return filter;
}

const getTopLanguageByHours = (type) => {
    const filter = getTypeFilter(type);
    return db.any(topLanguagesByHoursContributed, filter);
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

const getTimeline = (language = "", timeframe, type) => {
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

const getGenderGroupData = (language = '', type) => {
    let languageFilter = `type = '${type}'`;
    if (language.length !== 0) {
        languageFilter += ` and language iLike '${language}'`
    }
    let filter = pgp.as.format('$1:raw', [languageFilter])
    return db.any(genderGroupContributions, filter);
}

const getAgeGroupData = async (language = '', type) => {
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

const insertFeedback = (subject, feedback, language) => {
    return db.any(feedbackInsertion, [subject, feedback, language]);
}

const saveReport = async (userId, sentenceId, reportText, language, userName, source) => {
    const contributor_id = await getContributorId(userId, userName)
    await db.any(saveReportQuery, [contributor_id, sentenceId, reportText, language, source]);
    if (source === "validation") {
        await db.any(markContributionReported, [userId, userName, sentenceId]);
    }
    else if (source === "contribution") {
        await db.any(markMediaReported, [userId, userName, sentenceId]);
    }
}

const markContributionSkipped = async (userId, sentenceId, userName) => {
    const contributor_id = await getContributorId(userId, userName);
    await db.any(markContributionSkippedQuery, [contributor_id, sentenceId]);
}

const getContributorId = async (userId, userName, age = '', gender = '', motherTongue = '') => {
    let contributorInfo = await db.oneOrNone(getContributorIdQuery, [userId, userName]);

    if (!contributorInfo) {
        contributorInfo = await db.one(addContributorQuery, [userId, userName, age, gender, motherTongue]);
    }

    const contributor_id = contributorInfo.contributor_id;
    return contributor_id;
}

const createBadge = async (contributor_id, language, currentMilestoneData, category) => {
    let isNewBadge = false, generatedBadgeId = '';

    let acquiredBadges = await db.any(findRewardInfo, [contributor_id, language, category]);
    const currentMilestoneBadgeMatch = acquiredBadges.filter(function (value) {
        if (value.reward_catalogue_id === currentMilestoneData.id) {
            return value
        }
    })

    acquiredBadges = acquiredBadges.map((value) => {
        return { 'grade': value.grade, 'generated_badge_id': value.generated_badge_id }
    })

    if (currentMilestoneBadgeMatch.length === 0) {
        let insertResponse = await db.any(insertRewardQuery, [contributor_id, language, currentMilestoneData.id, category]);
        isNewBadge = true;
        generatedBadgeId = insertResponse[0].generated_badge_id;
        acquiredBadges.push({ 'grade': currentMilestoneData.grade, 'generated_badge_id': generatedBadgeId })
    }

    return { isNewBadge, generatedBadgeId, badges: acquiredBadges };
}

const getNextMilestoneData = async (contribution_count, language) => {
    let nextMilestoneData = await db.oneOrNone(checkNextMilestoneQuery, [contribution_count, language]);
    if (!nextMilestoneData) {
        nextMilestoneData = {
            'grade': '',
            'milestone': 0
        }
    }
    return nextMilestoneData;
}

const getCurrentMilestoneData = async (contribution_count, language) => {
    let currentMilestoneData = await db.oneOrNone(checkCurrentMilestoneQuery, [contribution_count, language]);
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

const getRewards = async (userId, userName, language, category) => {
    const contributor_id = await getContributorId(userId, userName);
    let contributions = await db.any(getTotalUserContribution, [contributor_id, language]);
    let contribution_count = 0;
    if (contributions) {
        contribution_count = contributions.length;
    }

    const { isCurrentAvailable, currentMilestoneData } = await getCurrentMilestoneData(contribution_count, language);

    let isNewBadge = false, generatedBadgeId = '', badges = [];
    if (isCurrentAvailable /* && contribution_count !== 0*/) {
        ({ isNewBadge, generatedBadgeId, badges } = await createBadge(contributor_id, language, currentMilestoneData, category));
    }

    const nextMilestoneData = await getNextMilestoneData(contribution_count, language);
    const currentBadgeType = currentMilestoneData.grade || '';
    const nextBadgeType = nextMilestoneData.grade || '';
    const currentMilestone = currentMilestoneData.milestone || 0;
    const nextMilestone = nextMilestoneData.milestone || 0;
    const nextHourGoal = await getHourGoalForLanguage(language);
    return {
        "badgeId": generatedBadgeId,
        "currentBadgeType": currentBadgeType,
        "nextBadgeType": nextBadgeType,
        "currentMilestone": currentMilestone,
        "nextMilestone": nextMilestone,
        "contributionCount": Number(contribution_count),
        "isNewBadge": isNewBadge,
        'badges': badges,
        'nextHourGoal': nextHourGoal
    }
}

const getRewardsInfo = (language) => {
    return db.any(rewardsInfoQuery, [language]);
}

const getHourGoalForLanguage = async (language) => {
    const result = await db.one(getContributionHoursForLanguage, [language]);
    const multiplierResult = await db.oneOrNone(getMultiplierForHourGoal, [language]);
    let multiplier = 100;
    if (multiplierResult) {
        multiplier = multiplierResult['multiplier'];
    }
    return parseInt((Math.ceil(result['hours'] / parseFloat(multiplier))) * multiplier);
}

const updateDbWithUserInput = async (
    userName,
    userId,
    language,
    userInput,
    sentenceId,
    state,
    country,
    age,
    gender,
    motherTongue,
    cb) => {
    const contributor_id = await getContributorId(userId, userName, age, gender, motherTongue,)

    db.any(updateContributionDetailsWithUserInput, [
        sentenceId,
        contributor_id,
        userInput,
        language,
        state,
        country
    ])
        .then(() => {
            db.none(updateMediaWithContributedState, [sentenceId]).then();
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
    try {
        const datasetLanguageList = await db.many(getDatasetLanguagesQuery, [type]);
        const contributionLanguageList = await db.many(getContributionLanguagesQuery, [type]);

        const datasetLanguages = datasetLanguageList.map((value) => value.data_language);
        const contributionLanguages = {};
        contributionLanguageList.forEach((entry) => {
            if (contributionLanguages[entry.from_language]) {
                contributionLanguages[entry.from_language].push(entry.to_language);
            }
            else contributionLanguages[entry.from_language] = [entry.to_language];
        })
        res.status(200).send({ datasetLanguages, contributionLanguages })

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    updateAndGetMedia,
    getContributionList,
    updateDbWithAudioPath,
    updateTablesAfterValidation,
    getAllDetails,
    getAllInfo,
    getMediaObject,
    getTopLanguageByHours,
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
    getAvailableLanguages
};
