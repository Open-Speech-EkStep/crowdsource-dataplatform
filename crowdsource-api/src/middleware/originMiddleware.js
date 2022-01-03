const { VALID_ORIGINS } = require('../constants');

const checkOriginHeader = function (req, res, next) {
    const reqOriginHeader = req.headers.origin;
    if (!reqOriginHeader || !matchInArray(reqOriginHeader, VALID_ORIGINS)) {
        console.log('in if')
        return res.status(422).send("Bad request");        
    }
    next()
}

function matchInArray(string, expressions) {
    var len = expressions.length,
        i = 0;
    for (; i < len; i++) {
        if (string.match(expressions[i])) {
            console.log(i)
            return true;
        }
    }
    return false;
}
module.exports = { checkOriginHeader }