const {
    MAX_SIZE,
    VALID_FILE_TYPE,
    MOBILE_REGEX,
    EMAIL_REGEX,
    GENDER,
    AGE_GROUP,
    MOTHER_TONGUE,
    MAX_LENGTH,
    SUBJECT_MAX_LENGTH,
    FEEDBACK_MAX_LENGTH,
    LANGUAGES
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
    const type = req.params.type;
    const userId = req.cookies.userId;

    if (!userId || userName === null || userName === undefined) {
        return res.status(400).send({ error: 'required parameters missing' });
    }

    const validTypes = ['parallel', 'ocr', 'text', 'asr'];
    const isValidType = (validTypes.includes(type));

    const invalidMotherTongue = (!MOTHER_TONGUE.includes(motherTongue) && (motherTongue.length));

    if (userName.length > MAX_LENGTH || MOBILE_REGEX.test(userName) ||
        EMAIL_REGEX.test(userName) || !AGE_GROUP.includes(ageGroup) ||
        !GENDER.includes(gender) || invalidMotherTongue || !isValidType) {
        return res.status(400).send("Bad request");
    }
    next()
}

const validateUserInputForFeedback = function (req, res, next) {
    const feedback = req.body.feedback;
    const subject = req.body.subject;
    const language = req.body.language

    const allLanguage = LANGUAGES.map(language => language.value)

    const invalidLanguage = !allLanguage.includes(language)

    const invalidSubject = (!subject || !subject.trim().length || subject.trim().length > SUBJECT_MAX_LENGTH)

    const invalidFeedback = (!feedback || !feedback.trim().length || feedback.trim().length > FEEDBACK_MAX_LENGTH);

    if (invalidFeedback || invalidSubject || invalidLanguage) {
        return res.status(400).send("Bad request");
    }
    next()
}

const validateInputForSkip = function (req, res, next) {
    const sentenceId = req.body.sentenceId;
    const userName = req.body.userName;
    const userId = req.cookies.userId;

    const invalid = !sentenceId || userName == undefined || !userId;

    if (invalid) {
        return res.status(400).send("Bad request");
    }
    next();
}

const validateRewardsInput = function (req, res, next) {
    const userId = req.cookies.userId || "";
    const { language = "" } = req.query;

    if (language === "" || userId === "") {
        return res.status(400).send("Input values missing");
    }
    next();
}

const validateRewardsInfoQuery = function (req, res, next) {
    const { language } = req.query;

    if (!language) {
        return res.status(400).send("Query parameter language missing");
    }
    next();
}

module.exports = { validateUserInputAndFile, validateUserInfo, convertIntoMB, validateUserInputForFeedback, validateInputForSkip, validateRewardsInput, validateRewardsInfoQuery }
