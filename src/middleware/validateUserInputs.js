const { MAX_SIZE, VALID_FILE_TYPE, MOBILE_REGEX, EMAIL_REGEX, GENDER, AGE_GROUP, MOTHER_TONGUE, MAX_LENGTH } = require("../constants")


const convertIntoMB = (fileSizeInByte) => { return Math.round(fileSizeInByte / (1024 * 1000)); }

const validateUserInputAndFile = function (req, res, next) {
    const speakerDetails = req.body.speakerDetails;
    const speakerDetailsJson = JSON.parse(speakerDetails);
    const file = req.files[0];
    const fileSizeInMB = convertIntoMB(file.size);
    const gender = speakerDetailsJson.gender;
    const motherTongue = speakerDetailsJson.motherTongue;
    if (fileSizeInMB > MAX_SIZE || file.mimetype != VALID_FILE_TYPE
        || !GENDER.includes(gender) || !MOTHER_TONGUE.includes(motherTongue)) {
        return res.status(400).send("Bad request");
    }
    next()
}

const validateUserInfo = function (req, res, next) {
    const userName = req.body.userName;
    const ageGroup = req.body.age;
    if (userName.length > MAX_LENGTH || MOBILE_REGEX.test(userName) || EMAIL_REGEX.test(userName) || !AGE_GROUP.includes(ageGroup)) {
        return res.status(400).send("Bad request");;
    }
    next()
}


module.exports = { validateUserInputAndFile, validateUserInfo }