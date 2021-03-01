const { getTopLanguageByHours, getTopLanguageBySpeakers, getAggregateDataCount, getLanguages, getTimeline, getGenderGroupData, getAgeGroupData } = require('./dbOperations');

const dashboardRoutes = (router) => {

    router.get('/top-languages-by-hours', async (req, res) => {
        try {
            const topLanguagesByHours = await getTopLanguageByHours();
            res.send({ "data": topLanguagesByHours });
        } catch (err) {
            console.log(err);
            res.status(500);
        }

    });

    router.get('/top-languages-by-speakers', async (req, res) => {
        const topLanguagesBySpeakers = await getTopLanguageBySpeakers();
        res.send({ "data": topLanguagesBySpeakers });
    });

    router.get('/aggregate-data-count', async (req, res) => {
        const byLanguage = req.query.byLanguage || false;
        const byState = req.query.byState || false;

        const aggregateData = await getAggregateDataCount(byLanguage, byState);
        res.send({ "data": aggregateData });
    });

    router.get('/languages', async (req, res) => {
        const languagesData = await getLanguages();
        res.send({ "data": languagesData.map(data=>data.language) });
    });

    router.get('/contributions/age', async (req, res) => {
        const language = req.query.language || '';

        const ageGroupData = await getAgeGroupData(language);
        res.send({ "data": ageGroupData });
    });

    router.get('/contributions/gender', async (req, res) => {
        const language = req.query.language || '';

        const genderGroupData = await getGenderGroupData(language);
        res.send({ "data": genderGroupData });
    });

    router.get('/timeline', async (req, res) => {
        const language = req.query.language || '';

        const timelineData = await getTimeline(language);
        let hoursContributed = timelineData[timelineData.length - 1]['cumulative_contributions'];
        let hoursValidated = timelineData[timelineData.length - 1]['cumulative_validations'];

        res.send({
            'total-hours-contributed': hoursContributed,
            'total-hours-validated': hoursValidated,
            "data": timelineData
        });
    });

};

module.exports = dashboardRoutes;