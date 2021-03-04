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
            res.send({ "data": { "top-languages-by-hours":topLanguagesByHours, "top-languages-by-speakers": topLanguagesBySpeakers} , last_updated_at: lastUpdatedDateTime});
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    });

    router.get('/aggregate-data-count', async (req, res) => {
        const byLanguage = req.query.byLanguage || false;
        const byState = req.query.byState || false;

        let aggregateData = await getAggregateDataCount(byLanguage, byState);
        aggregateData = aggregateData.map(data => {
            data.last_updated_at = new Date(data.last_updated_at).toLocaleString()
            return data;
        })
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": aggregateData , last_updated_at: lastUpdatedDateTime});
    });

    router.get('/languages', async (req, res) => {
        const languagesData = await getLanguages();
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": languagesData.map(data => data.language) , last_updated_at: lastUpdatedDateTime});
    });

    router.get('/contributions/age', async (req, res) => {
        const language = req.query.language || '';

        const ageGroupData = await getAgeGroupData(language);
        const lastUpdatedDateTime = await getLastUpdatedAt();
        res.send({ "data": ageGroupData , last_updated_at: lastUpdatedDateTime});
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