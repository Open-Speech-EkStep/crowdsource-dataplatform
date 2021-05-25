const { getSentencesForProfanityChecking, updateProfanityStatus} = require('./dbOperations');

const profanityCheckerApi = function(router){

    router.get('/sentences-for-profanity-check/:type',async (req,res)=>{
        const type = req.params.type;
        const userId = req.cookies.userId;
        const userName = req.query.username || '';

        sentences = await getSentencesForProfanityChecking(userName,type)
        res.send(sentences)
    })

    router.post('/profanity-status/:type',async (req,res)=>{
        const type = req.params.type;
        const profanityStatus = req.params.profanityStatus;
        const userId = req.cookies.userId;
        const userName = req.query.username;
        const sentenceId = req.params.sentenceId;

        sentences = await updateProfanityStatus(userName,type,sentenceId,profanityStatus)
        res.sendStatus(200)
    })
}

module.exports = profanityCheckerApi;