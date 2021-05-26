const { getSentencesForProfanityChecking, updateProfanityStatus } = require('./dbOperations');

const profanityCheckerApi = function (router) {

    router.get('/sentences-for-profanity-check/:type', async (req, res) => {
        const type = req.params.type;
        const userName = req.query.username || '';
        const language = req.query.language || '';
        const sentences = await getSentencesForProfanityChecking(userName, type, language)
        res.status(200).send({ data: sentences, count: sentences.length });
    })

    router.put('/profanity-status/:type', async (req, res) => {
        // const type = req.params.type;
        const { profanityStatus, userName, sentenceId } = req.body;

        await updateProfanityStatus(userName, sentenceId, profanityStatus)
        res.sendStatus(200)
    })
}

module.exports = profanityCheckerApi;