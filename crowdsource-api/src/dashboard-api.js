const { getLastUpdatedAt, getTopLanguageByHours, getTopLanguageBySpeakers, getAggregateDataCount, getLanguages, getTimeline, getGenderGroupData, getAgeGroupData } = require('./dbOperations');
const { validateMediaTypeInput } = require("./middleware/validateUserInputs")
let isFieldsMentioned = (fieldsArray) => {
    for (let key in fieldsArray) {
        if (fieldsArray[key] !== null && fieldsArray[key] === 'true') {
            return true
        }
    }
    return false;
}
let verifyAndRemoveField = (resultObject, avoidUnMentioned) => {
    let finalResultObject = { ...resultObject };
    for (let key in resultObject) {
        if ((avoidUnMentioned && resultObject[key] === null) || resultObject[key] === 'false') {
            delete finalResultObject[key];
        }
    }
    return finalResultObject;
}

let validateAndReturnRequiredStatsFields = (queryObject) => {
    const topLanguageByHoursFlag = queryObject.topLanguageByHours || null;
    const topLanguageBySpeakersFlag = queryObject.topLanguageBySpeakers || null;
    const languageDataFlag = queryObject.languageData || null;
    const aggregateDataByLanguageFlag = queryObject.aggregateDataByLanguage || null;
    const aggregateDataByStateFlag = queryObject.aggregateDataByState || null;
    const aggregateDataCountFlag = queryObject.aggregateDataCount || null;
    const aggregateDataByStateAndLanguageFlag = queryObject.aggregateDataByStateAndLanguage || null;

    let resultObject = {
        'top_language_by_hours': topLanguageByHoursFlag,
        'top_language_by_speakers': topLanguageBySpeakersFlag,
        'languages': languageDataFlag,
        'aggregate_data_by_state': aggregateDataByStateFlag,
        'aggregate_data_by_language': aggregateDataByLanguageFlag,
        'aggregate_data_by_state_and_language': aggregateDataByStateAndLanguageFlag,
        'aggregate_data_count': aggregateDataCountFlag
    }

    let avoidUnMentioned = isFieldsMentioned(resultObject);

    return verifyAndRemoveField(resultObject, avoidUnMentioned);
}

let validateAndReturnRequiredStatsCategoryFields = (queryObject) => {
    const ageGroupFlag = queryObject.ageGroup || null;
    const genderGroupFlag = queryObject.genderGroup || null;
    const timeLineFlag = queryObject.timeline || null;


    let resultObject = {
        'age_group_data': ageGroupFlag,
        'gender_group_data': genderGroupFlag,
        'timeline': timeLineFlag
    }

    let avoidUnMentioned = isFieldsMentioned(resultObject);

    return verifyAndRemoveField(resultObject, avoidUnMentioned);
}


const dashboardRoutes = (router) => {

    // Optional
    router.get('/top-languages-by-hours', async (req, res) => {
        try {
            const topLanguagesByHours = await getTopLanguageByHours();
            res.send({ "data": topLanguagesByHours });
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }

    });

    // Optional
    router.get('/top-languages-by-speakers', async (req, res) => {
        const topLanguagesBySpeakers = await getTopLanguageBySpeakers();
        res.send({ "data": topLanguagesBySpeakers });
    });

    router.get('/top-languages', async (req, res) => {
        try {
            const topLanguagesByHours = await getTopLanguageByHours();
            const topLanguagesBySpeakers = await getTopLanguageBySpeakers();
            const lastUpdatedDateTime = await getLastUpdatedAt();
            res.send({ "data": { "top-languages-by-hours": topLanguagesByHours, "top-languages-by-speakers": topLanguagesBySpeakers }, last_updated_at: lastUpdatedDateTime });
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    });

    //Optional
    router.get('/aggregate-data-count/:type', validateMediaTypeInput, async (req, res) => {
        const byLanguage = req.query.byLanguage || false;
        const byState = req.query.byState || false;
        const type = req.params.type;

        let aggregateData = await getAggregateDataCount(byLanguage, byState, type);
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": aggregateData, last_updated_at: lastUpdatedDateTime });
    });

    //Optional
    router.get('/languages', async (req, res) => {
        const languagesData = await getLanguages();
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": languagesData.map(data => data.language), last_updated_at: lastUpdatedDateTime });
    });


    router.get('/stats/summary/:type', validateMediaTypeInput, async (req, res) => {

        const resultFields = Object.keys(validateAndReturnRequiredStatsFields(req.query));
        const type = req.params.type;

        let result = {};
        if (resultFields.includes('top_language_by_hours')) {
            const topLanguagesByHours = await getTopLanguageByHours(type);
            result['top_languages_by_hours'] = topLanguagesByHours;
        }
        if (resultFields.includes('top_language_by_speakers')) {
            const topLanguagesBySpeakers = await getTopLanguageBySpeakers(type);
            result['top_languages_by_speakers'] = topLanguagesBySpeakers;
        }
        if (resultFields.includes('languages')) {
            let languagesData = await getLanguages(type);
            languagesData = languagesData.map(data => data.language);
            result['languages'] = languagesData;
        }
        if (resultFields.includes('aggregate_data_by_state')) {
            const aggregateDataByDate = await getAggregateDataCount(false, true, type);
            result['aggregate_data_by_state'] = aggregateDataByDate;
        }
        if (resultFields.includes('aggregate_data_by_language')) {
            const aggregateDataByLanguage = await getAggregateDataCount(true, false, type);
            result['aggregate_data_by_language'] = aggregateDataByLanguage;
        }
        if (resultFields.includes('aggregate_data_by_state_and_language')) {
            const aggregateDataByDateAndLanguage = await getAggregateDataCount(false, true, type);
            result['aggregate_data_by_state_and_language'] = aggregateDataByDateAndLanguage;
        }
        if(resultFields.includes('aggregate_data_count')){
            const aggregateCount = await getAggregateDataCount(false, false, type);
            result['aggregate_data_count'] = aggregateCount;
        }
        
        const lastUpdatedDateTime = await getLastUpdatedAt();
        result['last_updated_at'] = lastUpdatedDateTime;
        res.send(result);
    });

    router.get('/stats/categories', async (req, res) => {
        let result = {};

        const resultFields = Object.keys(validateAndReturnRequiredStatsCategoryFields(req.query));

        const language = req.query.language || '';

        if (resultFields.includes('timeline')) {
            const timeframe = req.query.timeframe || 'monthly';
            const allowedTimeFrames = ['weekly', 'monthly', 'daily', 'quarterly'];

            if (!allowedTimeFrames.includes(timeframe.toLowerCase())) {
                res.status(400).send("Timeframe mentioned is invalid");
                return;
            }

            const timelineData = await getTimeline(language, timeframe);
            let hoursContributed = 0, hoursValidated = 0;

            if (timelineData.length !== 0) {
                hoursContributed = timelineData[timelineData.length - 1]['cumulative_contributions'] || 0;
                hoursValidated = timelineData[timelineData.length - 1]['cumulative_validations'] || 0;
            }
            result['total-hours-contributed'] = hoursContributed;
            result['total-hours-validated'] = hoursValidated;
            result['timeline'] = timelineData;
        }

        if (resultFields.includes('age_group_data')) {
            const ageGroupData = await getAgeGroupData(language);
            result['age_group_data'] = ageGroupData;
        }
        if (resultFields.includes('gender_group_data')) {
            const genderGroupData = await getGenderGroupData(language);
            result['gender_group_data'] = genderGroupData;
        }
        const lastUpdatedDateTime = await getLastUpdatedAt();
        result['last_updated_at'] = lastUpdatedDateTime;
        res.send(result);
    });

    // Optional
    router.get('/stats/contributions/age/:type', validateMediaTypeInput, async (req, res) => {
        const language = req.query.language || '';
        const type = req.params.type;

        const ageGroupData = await getAgeGroupData(language, type);
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": ageGroupData, last_updated_at: lastUpdatedDateTime });
    });

    //Optional
    router.get('/stats/contributions/gender/:type', validateMediaTypeInput, async (req, res) => {
        const language = req.query.language || '';
        const type = req.params.type;

        const genderGroupData = await getGenderGroupData(language, type);
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": genderGroupData, last_updated_at: lastUpdatedDateTime });
    });

    //Optional
    router.get('/timeline/:type', validateMediaTypeInput, async (req, res) => {
        const allowedTimeFrames = ['weekly', 'monthly', 'daily', 'quarterly'];

        const language = req.query.language || '';
        const timeframe = req.query.timeframe || 'weekly';
        const type = req.params.type;

        if (!allowedTimeFrames.includes(timeframe.toLowerCase())) {
            res.status(400).send("Timeframe mentioned is invalid");
            return;
        }

        const timelineData = await getTimeline(language, timeframe, type);
        let hoursContributed = 0, hoursValidated = 0;

        if (timelineData.length !== 0) {
            hoursContributed = timelineData[timelineData.length - 1]['cumulative_contributions'] || 0;
            hoursValidated = timelineData[timelineData.length - 1]['cumulative_validations'] || 0;
        }
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({
            'total-hours-contributed': hoursContributed,
            'total-hours-validated': hoursValidated,
            "data": timelineData,
            last_updated_at: lastUpdatedDateTime
        });
    });

};

module.exports = dashboardRoutes;