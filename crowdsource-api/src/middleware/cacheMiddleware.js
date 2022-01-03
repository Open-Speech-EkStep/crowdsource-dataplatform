const cacheOperation = require('../cache/cacheOperations');

module.exports = {
    markContributionSkippedInCache: function (req, res, next) {
        const userId = req.cookies.userId
        let { userName, sentenceId, language, fromLanguage, type } = req.body;
        if (type != 'parallel') {
            fromLanguage = language;
            language = '';
        }
        next();
        cacheOperation.markContributionSkippedInCache(type, fromLanguage, language, sentenceId, userId, userName);
    }
}