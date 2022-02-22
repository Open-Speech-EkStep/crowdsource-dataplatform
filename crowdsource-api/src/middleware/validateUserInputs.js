const config = require('config');

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
    REPORT_SOURCES,
    MEDIA_TYPES,
    OPTIONAL_FIELD_MAX_LENGTH,
    FEEDBACK_RESPONSES
} = require("../constants")

const convertIntoMB = (fileSizeInByte) => {
    return Math.round(fileSizeInByte / (1024 * 1000));
}

function isValidLanguage(language) {
    return LANGUAGES.includes(language)
}

const validateUserInputAndFile = function (req, res, next) {
    const speakerDetails = req.body.speakerDetails;
    const speakerDetailsJson = JSON.parse(speakerDetails);
    const isEmailInUserName = EMAIL_REGEX.test(speakerDetailsJson.userName)

    const isInvalidParams = !(speakerDetailsJson.userName != undefined && speakerDetailsJson.userName.length <= MAX_LENGTH && !MOBILE_REGEX.test(speakerDetailsJson.userName));

    const MIN_INPUT_LENGTH = 2;

    const invalidMotherTongue = (speakerDetailsJson.motherTongue && !MOTHER_TONGUE.includes(speakerDetailsJson.motherTongue));
    const invalidGender = (speakerDetailsJson.gender && !GENDER.includes(speakerDetailsJson.gender));
    const invalidAgeGroup = (speakerDetailsJson.age && !AGE_GROUP.includes(speakerDetailsJson.age));
    const invalidLanguage = (!req.body.language || !LANGUAGES.includes(req.body.language))
    console.log(config.get('whitelistingEmail') != "enabled", "config.get('whitelistingEmail') != 'enabled'")
    console.log(isEmailInUserName, "isEmailInUserName")
    console.log(config.get('whitelistingEmail') != "enabled" && isEmailInUserName, "config.get('whitelistingEmail') != 'enabled' && isEmailInUserName")
    if (config.get('whitelistingEmail') != "enabled" && isEmailInUserName){
        return res.status(400).send("Bad request username contain email address");
    }

    const invalidBrowser = isBrowserInvalid(req);
    const invalidDevice = isDeviceInvalid(req);
    const invalidCountry = isCountryInvalid(req);
    const invalidState = isStateInvalid(req);

    const invalidType = isTypeInvalid(req);

    if (invalidAgeGroup || invalidGender || invalidMotherTongue || invalidLanguage || invalidType || invalidBrowser || invalidDevice || invalidCountry || invalidState)
        return res.status(400).send("Bad request");

    let isInvalidReqParams = false;
    if (req.file) {
        const file = req.file;
        const fileSizeInMB = convertIntoMB(file.size);
        const audioDuration = req.body.audioDuration;
        const isInvalidFileParam = fileSizeInMB > MAX_SIZE || file.mimetype != VALID_FILE_TYPE || isNaN(audioDuration);
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

    console.log(config.get('whitelistingEmail') != "enabled", "config.get('whitelistingEmail') != 'enabled'")
    console.log(userName.length > MAX_LENGTH, "userName.length > MAX_LENGTH")
    console.log(MOBILE_REGEX.test(userName), "MOBILE_REGEX.test(userName)")
    console.log(EMAIL_REGEX.test(userName), "EMAIL_REGEX.test(userName)")
    console.log(!isValidType, "!isValidType")
    console.log(!language, "!language")
    console.log((userName.length > MAX_LENGTH || MOBILE_REGEX.test(userName) || EMAIL_REGEX.test(userName) || !isValidType || !language), "(userName.length > MAX_LENGTH || MOBILE_REGEX.test(userName) || EMAIL_REGEX.test(userName) || !isValidType || !language)")

    if (config.get('whitelistingEmail') != "enabled" && (userName.length > MAX_LENGTH || MOBILE_REGEX.test(userName) || EMAIL_REGEX.test(userName) || !isValidType || !language) ){
        return res.status(400).send("Bad request");
    }

    next()
}

const validateUserInputForFeedback = function (req, res, next) {
    const email = req.body.email;
    const feedback = req.body.feedback;
    const category = req.body.category;
    const language = req.body.language;
    const module = req.body.module;
    const target_page = req.body.target_page;
    const opinion_rating = parseInt(req.body.opinion_rating);
    const recommended = req.body.recommended;
    const revisit = req.body.revisit;

    const invalidRecommended = recommended && (recommended.length > 5 || !FEEDBACK_RESPONSES.includes(recommended.toLowerCase()));
    const invalidRevisit = revisit && (revisit.length > 5 || !FEEDBACK_RESPONSES.includes(revisit.toLowerCase()));

    const invalidEmail = !email || isUserNameInvalid(email);
    const invalidLanguage = !LANGUAGES.includes(language)

    const invalidCategory = (!(category.trim().length == 0 || category.trim().length < CATEGORY_MAX_LENGTH))
    const invalidFeedback = !(feedback || feedback.trim().length == 0) || feedback.trim().length > FEEDBACK_MAX_LENGTH;

    const invalidModule = (!module || !module.trim().length || module.trim().length > 20)

    const invalidTargetPage = (!target_page || !target_page.trim().length || target_page.trim().length > 50)

    const invalidOpinionRating = (!opinion_rating || opinion_rating < 1 || opinion_rating > 5)
    
    if (invalidEmail || invalidFeedback || invalidCategory || invalidLanguage || invalidOpinionRating || invalidModule || invalidTargetPage
        || invalidRecommended || invalidRevisit) {
        return res.status(400).send("Bad request");
    }
    next()
}

const validateInputForSkip = function (req, res, next) {
    const sentenceId = req.body.sentenceId;
    const userName = req.body.userName;
    const userId = req.cookies.userId;

    const invalid = !sentenceId || userName == undefined || !userId || isLanguageInvalid(req.body.language) || isLanguageInvalid(req.body.fromLanguage) || isTypeInvalid(req) 
        || isDeviceInvalid(req) || isBrowserInvalid(req) || isCountryInvalid(req) || isStateInvalid(req);

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

    if (!(type && source && language && MEDIA_TYPES.includes(type) && SOURCES.includes(source))
        || isUserNameInvalid(req.query.userName)
        || isLanguageInvalid(language)) {
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

const validateInputsForValidateEndpoint = (req, res, next) => {
    if (!(req.cookies && req.cookies.userId && req.body && req.body.sentenceId
        && req.params && req.params.contributionId && req.params.action
        && VALIDATION_ACTIONS.includes(req.params.action)) 
        || isTypeInvalid(req) 
        || isBrowserInvalid(req) || isCountryInvalid(req) || isStateInvalid(req) || isDeviceInvalid(req)
        || isUserNameInvalid(req.body.userName)
        || isLanguageInvalid(req.body.fromLanguage)
        || isLanguageInvalid(req.body.language)) {
        return res.status(400).send('Invalid params.');
    }
    next();
}

const validateGetContributionsInput = (req, res, next) => {
    const validUserId = (req.cookies && req.cookies.userId);
    const validMediaType = (req.params && req.params.type && MEDIA_TYPES.includes(req.params.type));
    const validFromLanguage = (req.query && req.query.from && isValidLanguage(req.query.from));
    const validToLanguage = (req.query && req.query.to && isValidLanguage(req.query.to));

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

const validateReportInputs = (req, res, next) => {
    const userId = req.cookies.userId || '';
    const { sentenceId = '', reportText = '', language = '', userName = '' } = req.body;
    if (
        sentenceId === '' ||
        isReportTextInvalid(reportText) ||
        isLanguageInvalid(language) ||
        userId === '' ||
        isSourceInvalid(req)
        || isUserNameInvalid(userName)
    ) {
        return res.send({ statusCode: 400, message: 'Input values missing' });
    }
    next();
}

function isReportTextInvalid(text) {
    return !(text && text.length < FEEDBACK_MAX_LENGTH); 
}

function isTypeInvalid(req) {
    return !(req.body.type && MEDIA_TYPES.includes(req.body.type));
}

function isSourceInvalid(req) {
    return !(req.body.source && REPORT_SOURCES.includes(req.body.source))
}

function isStateInvalid(req) {
    return req.body.state && req.body.state.length > OPTIONAL_FIELD_MAX_LENGTH;
}

function isCountryInvalid(req) {
    return req.body.country && req.body.country.length > OPTIONAL_FIELD_MAX_LENGTH;
}

function isDeviceInvalid(req) {
    return req.body.device && req.body.device.length > OPTIONAL_FIELD_MAX_LENGTH;
}

function isBrowserInvalid(req) {
    return req.body.browser && req.body.browser.length > OPTIONAL_FIELD_MAX_LENGTH;
}

function isUserNameInvalid(userName) {
    return !(userName != undefined && userName.length <= MAX_LENGTH && !MOBILE_REGEX.test(userName) && !EMAIL_REGEX.test(userName));
} 

function isLanguageInvalid(language) {
    return language && !LANGUAGES.includes(language);
}

module.exports = { validateUserInputAndFile, validateUserInfo, convertIntoMB, validateUserInputForFeedback, validateInputForSkip, validateRewardsInput, validateRewardsInfoInput, validateInputsForValidateEndpoint, validateGetContributionsInput, validateMediaTypeInput, validateReportInputs }
