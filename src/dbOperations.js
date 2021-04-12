const { downloader } = require('./downloader/objDownloader')
const moment = require('moment');

const {
    updateContributionDetails,
    unassignIncompleteSentences,
    updateAndGetSentencesQuery,
    updateAndGetUniqueSentencesQuery,
    updateAndGetOrderedSentencesQuery,
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
    saveReportQuery,
    getSentencesForLaunch,
    markContributionSkippedQuery,
    rewardsInfoQuery,
    getTotalUserContribution,
    getTotalUserValidation,
    checkCurrentMilestoneQuery,
    checkNextMilestoneQuery,
    insertRewardQuery,
    getContributorIdQuery,
    findRewardInfo,
    markSentenceReported,
    markContributionReported,
    updateMaterializedViews,
    getBadges,
    addContributorQuery,
    getContributionHoursForLanguage,
    getMultiplierForHourGoal
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

const voteLimit = Number(envVars.VOTE_LIMIT);

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
    const roundedAudioDuration = audioDuration ? Number(Number(audioDuration).toFixed(3)) : 0;

    db.any(updateContributionDetails, [
        audioPath,
        ageGroup,
        gender,
        motherTongue,
        sentenceId,
        userId,
        userName,
        state,
        country,
        roundedAudioDuration
    ])
        .then(() => {
            db.none(updateSentencesWithContributedState, [sentenceId]).then();
            db.none(updateMaterializedViews).then();
            cb(200, { success: true });
        })
        .catch((err) => {
            console.log(err);
            cb(500, { error: true });
        });
};

const getSentencesBasedOnAge = function (
    ageGroup,
    userId,
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
        query = updateAndGetUniqueSentencesQuery;
    }

    query = updateAndGetOrderedSentencesQuery;
    const launchUser = envVars.LAUNCH_USER || 'launch_user';
    const launchIds = envVars.LAUNCH_IDS || '';

    if (userName == launchUser) {
        query = getSentencesForLaunch;
    }

    return (db.many(query, [
        userId,
        userName,
        languageLabel,
        language,
        motherTongue,
        gender,
        ageGroup,
        launchIds.split(', ')
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
    const sentences = getSentencesBasedOnAge(
        ageGroup,
        userId,
        userName,
        language,
        motherTongue,
        gender
    );
    const count = db.one(sentencesCount, [userId, userName, language]);
    const unAssign = db.any(unassignIncompleteSentences, [
        userId,
        userName,
    ]);
    const unAssignWhenLanChange = db.any(
        unassignIncompleteSentencesWhenLanChange,
        [userId, userName, language]
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
    const userId = req.cookies.userId;
    db.any(getValidationSentencesQuery, [language, userId])
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
    ;
}

const updateTablesAfterValidation = (req, res) => {
    const validatorId = req.cookies.userId;
    const { sentenceId, action, contributionId, state = "", country = "" } = req.body
    return db.none(addValidationQuery, [validatorId, sentenceId, action, contributionId, state, country])
        .then(async () => {
            if (action !== 'skip') {
                db.none(updateSentencesWithValidatedState, [sentenceId, contributionId]).then(() => {
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

const getAgeGroupData = async (language = '') => {
    let languageFilter = "true";
    if (language.length !== 0) {
        languageFilter = `language iLike '${language}'`
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
        await db.any(markSentenceReported, [userId, userName, sentenceId]);
    }
}

const markContributionSkipped = (userId, sentenceId, userName) => {
    return db.any(markContributionSkippedQuery, [userId, userName, sentenceId]);
}

const getContributorId = async (userId, userName) => {
    let contributorInfo = await db.oneOrNone(getContributorIdQuery, [userId, userName]);

    if (!contributorInfo) {
        contributorInfo = await db.one(addContributorQuery, [userId, userName]);
    }

    const contributor_id = contributorInfo.contributor_id;
    return contributor_id;
}

const createBadge = async (contributor_id, language, currentMilestoneData, category) => {
    let isNewBadge = false, generatedBadgeId = '';
    let actualBadges = await db.any(getBadges, [currentMilestoneData.milestone, language]);

    let badges = await db.any(findRewardInfo, [contributor_id, language, category]);
    const matchedBadge = badges.filter(function (value) {
        if (value.reward_catalogue_id === currentMilestoneData.id) {
            return value
        }
    })

    let filteredBadges = actualBadges.filter(function (actualValue) {
        if ((!badges.includes(actualValue)) && (actualValue.id !== currentMilestoneData.id)) {
            return actualValue;
        }
    })

    badges = badges.map((value) => {
        return { 'grade': value.grade, 'generated_badge_id': value.generated_badge_id }
    })

    if (matchedBadge.length === 0) {
        filteredBadges.forEach(async value => {
            let resp = await db.any(insertRewardQuery, [contributor_id, language, value.id, category]);
            badges.push({ 'grade': value.grade, 'generated_badge_id': resp[0].generated_badge_id })
        })
        let insertResponse = await db.any(insertRewardQuery, [contributor_id, language, currentMilestoneData.id, category]);
        if (currentMilestoneData.grade)
            isNewBadge = true;
        generatedBadgeId = insertResponse[0].generated_badge_id;
        badges.push({ 'grade': currentMilestoneData.grade, 'generated_badge_id': generatedBadgeId })
    }

    return { isNewBadge, generatedBadgeId, badges };
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
    let validation_count = 0;
    if (contributions) {
        contributions = contributions.map(data => data['contribution_id']);
        contribution_count = contributions.length;
    }
    if (contribution_count !== 0) {
        ({ validation_count } = await db.one(getTotalUserValidation, [contributions]))
    }

    const { isCurrentAvailable, currentMilestoneData } = await getCurrentMilestoneData(contribution_count, language);

    let isNewBadge = false, generatedBadgeId = '', badges = [];
    if (isCurrentAvailable && contribution_count !== 0) {
        let validationPercent = (validation_count / contribution_count) * 100;
        if (currentMilestoneData.grade === 'Bronze' || validationPercent >= 80) {
            ({
                isNewBadge,
                generatedBadgeId,
                badges
            } = await createBadge(contributor_id, language, currentMilestoneData, category, isNewBadge, generatedBadgeId));
        }
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
    if(multiplierResult){
        multiplier = multiplierResult['multiplier'];
    }
    return parseInt((Math.ceil(result['hours']/parseFloat(multiplier)))*multiplier);
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
    saveReport,
    markContributionSkipped,
    getRewards,
    getRewardsInfo,
    getBadges
};
