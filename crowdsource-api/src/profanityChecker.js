const { getSentencesForProfanityChecking, updateProfanityStatus, releaseMedia, userVerify, getSentencesForProfanityCheckingForCorrection, updateProfanityStatusForCorrection, releaseMediaForCorrection } = require('./dbOperations');
const { validateUserInfoForProfanity } = require('./middleware/validateUserInputs')


const profanityCheckerApi = function (router) {

    router.post('/profanity/verify', async (req, res) => {
        const { userName } = req.body;
        try {
            await userVerify(userName, "ROLE_PROFANITY");
            res.sendStatus(200);
        } catch (err) {
            // console.log(err);
            res.sendStatus(401);
        }
    })

    router.get('/sentences-for-profanity-check/:type', validateUserInfoForProfanity, async (req, res) => {
        const type = req.params.type;
        const userName = req.query.username || '';
        const language = req.query.language || '';
        let sentences = [];
        if (userName.includes("profanity_")) {
            sentences = await getSentencesForProfanityCheckingForCorrection(userName, type, language);
        } else {
            sentences = await getSentencesForProfanityChecking(userName, type, language);
        }
        res.status(200).send({ data: sentences, count: sentences.length });
    })

    router.put('/profanity-status/:type', async (req, res) => {
        const { profanityStatus, userName, sentenceId } = req.body;
        if (userName.includes("profanity_")) {
            await updateProfanityStatusForCorrection(userName, sentenceId, profanityStatus)
        } else {
            await updateProfanityStatus(userName, sentenceId, profanityStatus)
        }
        res.sendStatus(200)
    })

    router.put('/profanity-skip/:type', async (req, res) => {
        const { sentenceId, userName } = req.body;
        console.log(req.body);
        if (userName.includes("profanity_")) {
            await releaseMediaForCorrection(sentenceId)
        } else {
            await releaseMedia(sentenceId)
        }
        res.sendStatus(200)
    })
}

module.exports = profanityCheckerApi;