const { getLastUpdatedAt, getTopLanguageByHours, getTopLanguageBySpeakers, getAggregateDataCount, getLanguages, getTimeline, getGenderGroupData, getAgeGroupData } = require('./dbOperations');

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
    router.get('/aggregate-data-count', async (req, res) => {
        const byLanguage = req.query.byLanguage || false;
        const byState = req.query.byState || false;

        let aggregateData = await getAggregateDataCount(byLanguage, byState);
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": aggregateData, last_updated_at: lastUpdatedDateTime });
    });

    //Optional
    router.get('/languages', async (req, res) => {
        const languagesData = await getLanguages();
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": languagesData.map(data => data.language), last_updated_at: lastUpdatedDateTime });
    });

    let checkValues = (fieldsArray) => {
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

    let validateAndReturn = (queryObject) => {
        const topLanguageByHoursFlag = queryObject.topLanguageByHours || null;
        const topLanguageBySpeakersFlag = queryObject.topLanguageBySpeakers || null;
        const languageDataFlag = queryObject.languageData || null;
        const aggregateDataByLanguageFlag = queryObject.aggregateDataByLanguage || null;
        const aggregateDataByDateFlag = queryObject.aggregateDataByDate || null;
        const aggregateDataByDateAndLanguageFlag = queryObject.aggregateDataByDateAndLanguage || null;

        let resultObject = {
            'top_language_by_hours': topLanguageByHoursFlag,
            'top_language_by_speakers': topLanguageBySpeakersFlag,
            'languages': languageDataFlag,
            'aggregate_data_by_date': aggregateDataByDateFlag,
            'aggregate_data_by_language': aggregateDataByLanguageFlag,
            'aggregate_data_by_date_and_language': aggregateDataByDateAndLanguageFlag
        }

        let avoidUnMentioned = checkValues(resultObject);

        return verifyAndRemoveField(resultObject, avoidUnMentioned);
    }

    router.get('/stats/summary', async (req, res) => {

        const resultFields = Object.keys(validateAndReturn(req.query));

        let result = {};
        if (resultFields.includes('top_language_by_hours')) {
            const topLanguagesByHours = await getTopLanguageByHours();
            result['top_languages_by_hours'] = topLanguagesByHours;
        }
        if (resultFields.includes('top_language_by_speakers')) {
            const topLanguagesBySpeakers = await getTopLanguageBySpeakers();
            result['top_languages_by_speakers'] = topLanguagesBySpeakers;
        }
        if (resultFields.includes('languages')) {
            let languagesData = await getLanguages();
            languagesData = languagesData.map(data => data.language);
            result['languages'] = languagesData;
        }
        if (resultFields.includes('aggregate_data_by_date')) {
            const aggregateDataByDate = await getAggregateDataCount(false, true);
            result['aggregate_data_by_date'] = aggregateDataByDate;
        }
        if (resultFields.includes('aggregate_data_by_language')) {
            const aggregateDataByLanguage = await getAggregateDataCount(true, false);
            result['aggregate_data_by_language'] = aggregateDataByLanguage;
        }
        if (resultFields.includes('aggregate_data_by_date_and_language')) {
            const aggregateDataByDateAndLanguage = await getAggregateDataCount(false, true);
            result['aggregate_data_by_date_and_language'] = aggregateDataByDateAndLanguage;
        }
        const lastUpdatedDateTime = await getLastUpdatedAt();
        result['last_updated_at'] = lastUpdatedDateTime;
        res.send(result);
    });

    router.get('/stats/categories', async (req, res) => {

    });

    router.get('/contributions/age', async (req, res) => {
        const language = req.query.language || '';

        const ageGroupData = await getAgeGroupData(language);
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": ageGroupData, last_updated_at: lastUpdatedDateTime });
    });

    router.get('/contributions/gender', async (req, res) => {
        const language = req.query.language || '';

        const genderGroupData = await getGenderGroupData(language);
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": genderGroupData, last_updated_at: lastUpdatedDateTime });
    });

    router.get('/timeline', async (req, res) => {
        const allowedTimeFrames = ['weekly', 'monthly', 'daily', 'quarterly'];

        const language = req.query.language || '';
        const timeframe = req.query.timeframe || 'weekly';

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