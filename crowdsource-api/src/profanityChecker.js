const { getSentencesForProfanityChecking, updateProfanityStatus,releaseMedia,userVerify } = require('./dbOperations');
const {validateUserInfoForProfanity} = require('./middleware/validateUserInputs')


const profanityCheckerApi = function (router) {

    router.post('/profanity/verify', async (req, res) => {
        const { userName } = req.body;
        try{
            await userVerify(userName, "ROLE_PROFANITY");
            res.sendStatus(200);
        }catch(err){
            // console.log(err);
            res.sendStatus(401);
        }
    })

    router.get('/sentences-for-profanity-check/:type',validateUserInfoForProfanity, async (req, res) => {
        const type = req.params.type;
        const userName = req.query.username || '';
        const language = req.query.language || '';
        const sentences = await getSentencesForProfanityChecking(userName, type, language)
        
        res.status(200).send({ data: sentences, count: sentences.length });
    })

    router.put('/profanity-status/:type', async (req, res) => {
        const { profanityStatus, userName, sentenceId } = req.body;
        await updateProfanityStatus(userName, sentenceId, profanityStatus)
        res.sendStatus(200)
    })

    router.put('/profanity-skip/:type', async (req, res) => {
        const { sentenceId } = req.body;

        await releaseMedia(sentenceId)
        res.sendStatus(200)
    })
}

module.exports = profanityCheckerApi;