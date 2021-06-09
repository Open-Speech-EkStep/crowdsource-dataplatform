const { getSentencesForProfanityChecking, updateProfanityStatus, releaseMedia, userVerify, getSentencesForProfanityCheckingForCorrection, updateProfanityStatusForCorrection, releaseMediaForCorrection } = require('./dbOperations');
const { validateUserInfoForProfanity } = require('./middleware/validateUserInputs')


const profanityCheckerApi = function (router) {

    router.post('/profanity/verify', async (req, res) => {
        let userName = req.body.userName || '';
        userName = userName.toLowerCase();
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
        let userName = req.query.username || '';
        const language = req.query.language || '';
        userName = userName.toLowerCase();
        let sentences = [];
        if (userName.includes("profanity_")) {
            sentences = await getSentencesForProfanityCheckingForCorrection(userName, type, language);
        } else {
            sentences = await getSentencesForProfanityChecking(userName, type, language);
        }
        res.status(200).send({ data: sentences, count: sentences.length });
    })

    router.put('/profanity-status/:type', async (req, res) => {
        const { profanityStatus, sentenceId } = req.body;
        let userName = req.query.username || '';
        userName = userName.toLowerCase();
        if (userName.includes("profanity_")) {
            await updateProfanityStatusForCorrection(userName, sentenceId, profanityStatus)
        } else {
            await updateProfanityStatus(userName, sentenceId, profanityStatus)
        }
        res.sendStatus(200)
    })

    router.put('/profanity-skip/:type', async (req, res) => {
        const { sentenceId } = req.body;
        let userName = req.query.username || '';
        userName = userName.toLowerCase();
        if (userName.includes("profanity_")) {
            await releaseMediaForCorrection(sentenceId)
        } else {
            await releaseMedia(sentenceId)
        }
        res.sendStatus(200)
    })
}

module.exports = profanityCheckerApi;