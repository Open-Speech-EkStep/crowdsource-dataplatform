const {
    MAX_SIZE,
    VALID_FILE_TYPE,
    MOBILE_REGEX,
    EMAIL_REGEX,
    GENDER,
    AGE_GROUP,
    MOTHER_TONGUE,
    MAX_LENGTH,
    CATEGORY_MAX_LENGTH,
    FEEDBACK_MAX_LENGTH,
    LANGUAGES,
    VALIDATION_ACTIONS,
    SOURCES,
    MEDIA_TYPES
} = require("../constants")


const convertIntoMB = (fileSizeInByte) => {
    return Math.round(fileSizeInByte / (1024 * 1000));
}

const validateUserInputAndFile = function (req, res, next) {
    const speakerDetails = req.body.speakerDetails;
    const speakerDetailsJson = JSON.parse(speakerDetails);
    const isInvalidParams = !(speakerDetailsJson.userName != undefined && speakerDetailsJson.userName.length <= MAX_LENGTH && !MOBILE_REGEX.test(speakerDetailsJson.userName) && !EMAIL_REGEX.test(speakerDetailsJson.userName));

    const MIN_INPUT_LENGTH = 2;
    const allLanguages = LANGUAGES.map(lang => lang.value)

    const invalidMotherTongue = (speakerDetailsJson.motherTongue && !MOTHER_TONGUE.includes(speakerDetailsJson.motherTongue));
    const invalidGender = (speakerDetailsJson.gender && !GENDER.includes(speakerDetailsJson.gender));
    const invalidAgeGroup = (speakerDetailsJson.age && !AGE_GROUP.includes(speakerDetailsJson.age));
    const invalidLanguage = (!req.body.language || !allLanguages.includes(req.body.language))

    if (invalidAgeGroup || invalidGender || invalidMotherTongue || invalidLanguage)
        return res.status(400).send("Bad request");

    let isInvalidReqParams = false;
    if (req.file) {
        const file = req.file;
        const fileSizeInMB = convertIntoMB(file.size);
        const isInvalidFileParam = fileSizeInMB > MAX_SIZE || file.mimetype != VALID_FILE_TYPE;
        isInvalidReqParams = isInvalidFileParam || isInvalidParams
    }
    else if (req.body.userInput) {
        isInvalidReqParams = isInvalidParams || req.body.userInput.length <= MIN_INPUT_LENGTH;
    }
    else {
        isInvalidReqParams = true;
    }

    if (isInvalidReqParams) {
        return res.status(400).send("Bad request");
    }
    next()
}

const validateUserInfo = function (req, res, next) {
    const userName = req.body.userName;
    const type = req.params.type;
    const userId = req.cookies.userId;
    const language = req.body.language;

    if (!userId || userName === null || userName === undefined) {
        return res.status(400).send({ error: 'required parameters missing' });
    }

    const isValidType = (MEDIA_TYPES.includes(type));

    if (userName.length > MAX_LENGTH || MOBILE_REGEX.test(userName) ||
        EMAIL_REGEX.test(userName) || !isValidType || !language) {
        return res.status(400).send("Bad request");
    }
    next()
}

const validateUserInputForFeedback = function (req, res, next) {
    const feedback = req.body.feedback;
    const category = req.body.category;
    const language = req.body.language
    const module = req.body.module; 
    const target_page = req.body.target_page; 
    const opinion_rating = parseInt(req.body.opinion_rating);

    const allLanguages = LANGUAGES.map(lang => lang.value)

    const invalidLanguage = !allLanguages.includes(language)

    const invalidCategory = (!(category.trim().length == 0 || category.trim().length < CATEGORY_MAX_LENGTH))
    const invalidFeedback = (!(feedback || feedback.trim().length == 0) || feedback.trim().length > FEEDBACK_MAX_LENGTH 
    || (category.trim().length == 0 && feedback.trim().length != 0));

    const invalidModule = (!module || !module.trim().length)
    
    const invalidTargetPage = (!target_page || !target_page.trim().length)

    const invalidOpinionRating = (!opinion_rating || !(opinion_rating >= 1) || !(opinion_rating <= 5))

    if (invalidFeedback || invalidCategory || invalidLanguage || invalidOpinionRating || invalidModule || invalidTargetPage) {
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

const validateRewardsInput = (req, res, next) => {
    const userId = req.cookies.userId || "";
    const { type, source, language } = req.query;

    if (userId === "") {
        return res.status(400).send("User Id missing");
    }

    if (!(type && source && language && MEDIA_TYPES.includes(type) && SOURCES.includes(source))) {
        return res.status(400).send("Invalid query");
    }

    next();
}

const validateRewardsInfoInput = (req, res, next) => {
    const { type, source, language } = req.query;

    if (!(type && source && language && MEDIA_TYPES.includes(type) && SOURCES.includes(source))) {
        return res.status(400).send("Invalid query");
    }

    next();
}

const validateContributedMediaInput = (req, res, next) => {
    if (!(req.params && req.params.entityId && req.params.source && SOURCES.includes(req.params.source))) {
        return res.status(400).send('Invalid params.');
    }

    next();
}

const validateInputsForValidateEndpoint = (req, res, next) => {
    if (!(req.cookies && req.cookies.userId && req.body && req.body.sentenceId
        && req.params && req.params.contributionId && req.params.action
        && VALIDATION_ACTIONS.includes(req.params.action))) {
        return res.status(400).send('Invalid params.');
    }
    next();
}

const validateGetContributionsInput = (req, res, next) => {
    const validLanguages = LANGUAGES.map((item) =>
        item.value
    )
    const validUserId = (req.cookies && req.cookies.userId);
    const validMediaType = (req.params && req.params.type && MEDIA_TYPES.includes(req.params.type));
    const validFromLanguage = (req.query && req.query.from && validLanguages.includes(req.query.from));
    const validToLanguage = (req.query && req.query.to && validLanguages.includes(req.query.to));

    if (!(validUserId && validMediaType && validFromLanguage && (req.params.type != 'parallel' || validToLanguage))) {
        res.status(400).send('Invalid params.');
    }
    else { next(); }
}

const validateMediaTypeInput = (req, res, next) => {
    if (!(req.params && req.params.type && MEDIA_TYPES.includes(req.params.type))) {
        return res.status(400).send("Invalid params");
    }
    next();
}

const validateUserInfoForProfanity = (req, res, next) => {
    const validLanguages = LANGUAGES.map((item) =>
        item.value
    )
    if (!(req.params && req.params.type && MEDIA_TYPES.includes(req.params.type))) {
        return res.status(400).send("Invalid params");
    }
    if (!req.query && !req.query.username && !EMAIL_REGEX.test(req.query.username)) {
        return res.status(400).send("Invalid username");
    }
    if(!validLanguages.includes(req.query.language)){
        return res.status(400).send("Invalid language");
    }
    next();
}

module.exports = { validateUserInputAndFile, validateUserInfo, convertIntoMB, validateUserInputForFeedback, validateInputForSkip, validateRewardsInput, validateRewardsInfoInput, validateContributedMediaInput, validateInputsForValidateEndpoint, validateGetContributionsInput, validateMediaTypeInput, validateUserInfoForProfanity }
