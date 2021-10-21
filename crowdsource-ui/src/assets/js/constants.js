const config = require('../../../brand/meity.json')
const { getEnabledLanguages, getAllLanguages } = require('./language-filter')
const { enabled_languages } = require('./env-api')

const DEFAULT_CON_LANGUAGE = "English";
const AUDIO_DURATION = 6;
const SIXTY = 60;
const HOUR_IN_SECONDS = 3600;
const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
const AGGREGATED_DATA_BY_LANGUAGE = "aggregateDataCountByLanguage";
const CUMULATIVE_DATA = "cumulativeDataByLanguage";
const LOCALE_STRINGS = 'localeString';
const CONTRIBUTION_LANGUAGE = "contributionLanguage";
const SPEAKER_DETAILS_KEY = 'speakerDetails';
const PARALLEL_TO_LANGUAGE = `${config.initiativeKey_3}_to-language`;
const PARALLEL_FROM_LANGUAGE = `${config.initiativeKey_3}_from-language`;
const CURRENT_MODULE = 'module';

const ErrorStatusCode = {
    SUCCESS: 200,
    TOO_MANY_REQUEST: 429,
    SERVICE_UNAVAILABLE: 503
};

let ALL_LANGUAGES = getAllLanguages()

if (enabled_languages != null && !enabled_languages.includes('@@')) {
    ALL_LANGUAGES = getEnabledLanguages(enabled_languages)
}

const INITIATIVES = {
    asr: {type: 'asr', value: config.initiativeKey_1,name :config.initiative_1},
    text: {type: 'text', value: config.initiativeKey_2, name :config.initiative_2},
    parallel: {type: 'parallel', value: config.initiativeKey_3,name :config.initiative_3},
    ocr: { type: 'ocr', value: config.initiativeKey_4,name :config.initiative_4}
};


const AGE_GROUP = [
    '',
    'upto 10',
    '10 - 30',
    '30 - 60',
    '60+',
  ];

const BADGES_NAME = {
    bronze : config.badge_1,
    silver : config.badge_2,
    gold : config.badge_3,
    platinum : config.badge_4,
}  

const BADGES_API_TEXT = {
    badge_1 : "bronze",
    badge_2 : "silver",
    badge_3 : "gold",
    badge_4 : "platinum",
}  

const INITIATIVES_NAME = {
    asr : config.initiative_1,
    text : config.initiative_2,
    parallel : config.initiative_3,
    ocr : config.initiative_4,
}

module.exports = {
    DEFAULT_CON_LANGUAGE,
    AUDIO_DURATION,
    SIXTY,
    HOUR_IN_SECONDS,
    ALL_LANGUAGES,
    TOP_LANGUAGES_BY_HOURS,
    TOP_LANGUAGES_BY_SPEAKERS,
    AGGREGATED_DATA_BY_LANGUAGE,
    LOCALE_STRINGS,
    CONTRIBUTION_LANGUAGE,
    SPEAKER_DETAILS_KEY,
    CURRENT_MODULE,
    PARALLEL_TO_LANGUAGE,
    PARALLEL_FROM_LANGUAGE,
    ErrorStatusCode,
    CUMULATIVE_DATA,
    AGE_GROUP,
    BADGES_NAME,
    INITIATIVES_NAME,config,BADGES_API_TEXT,INITIATIVES

}
