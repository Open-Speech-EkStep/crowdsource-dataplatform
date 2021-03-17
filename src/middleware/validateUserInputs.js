const {
    MAX_SIZE,
    VALID_FILE_TYPE,
    MOBILE_REGEX,
    EMAIL_REGEX,
    GENDER,
    AGE_GROUP,
    MOTHER_TONGUE,
    MAX_LENGTH,
    FEEDBACK_MIN_LENGTH,
    FEEDBACK_MAX_LENGTH
} = require("../constants")


const convertIntoMB = (fileSizeInByte) => {
    return Math.round(fileSizeInByte / (1024 * 1000));
}

const validateUserInputAndFile = function (req, res, next) {
    const speakerDetails = req.body.speakerDetails;
    const speakerDetailsJson = JSON.parse(speakerDetails);
    const file = req.file;
    const fileSizeInMB = convertIntoMB(file.size);
    const userName = speakerDetailsJson.userName;

    const isValidReqParams = fileSizeInMB > MAX_SIZE || file.mimetype != VALID_FILE_TYPE
        userName.length > MAX_LENGTH || MOBILE_REGEX.test(userName) || EMAIL_REGEX.test(userName);

    if (isValidReqParams) {
        return res.status(400).send("Bad request");
    }
    next()
}

const validateUserInfo = function (req, res, next) {
    const userName = req.body.userName;
    const ageGroup = req.body.age;
    const gender = req.body.gender;
    const motherTongue = req.body.motherTongue;

    const invalidMotherTongue = (!MOTHER_TONGUE.includes(motherTongue) && (motherTongue.length));

    if (userName.length > MAX_LENGTH || MOBILE_REGEX.test(userName) ||
        EMAIL_REGEX.test(userName) || !AGE_GROUP.includes(ageGroup) ||
        !GENDER.includes(gender) || invalidMotherTongue) {
        return res.status(400).send("Bad request");
    }
    next()
}

const validateUserInputForFeedback = function (req, res, next) {
    const feedback = req.body.feedback;

    const feedbackLength = feedback.trim().length

    const invalidFeedback = (!feedback || feedbackLength < FEEDBACK_MIN_LENGTH || feedbackLength > FEEDBACK_MAX_LENGTH);

    if (invalidFeedback) {
        return res.status(400).send("Bad request");
    }
    next()
}

module.exports = {validateUserInputAndFile, validateUserInfo, convertIntoMB,validateUserInputForFeedback}
