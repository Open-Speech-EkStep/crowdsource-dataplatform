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
const AGGREGATED_DATA_BY_TOP_LANGUAGE = "aggregateDataCountByTopLanguage";
const LOCALE_STRINGS = 'localeString';
const CONTRIBUTION_LANGUAGE = "contributionLanguage";
const TO_LANGUAGE = "to-language";
const PARALLEL_TO_LANGUAGE = `${config.initiativeKey_3}_to-language`;
const PARALLEL_FROM_LANGUAGE = `${config.initiativeKey_3}_from-language`;
const SPEAKER_DETAILS_KEY = 'speakerDetails';
const CURRENT_MODULE = 'module';

const MOTHER_TONGUE = [
  'Assamese',
  'Bengali',
  'Bodo',
  'Dogri',
  'Gujarati',
  'Hindi',
  'Kannada',
  'Kashmiri',
  'Konkani',
  'Maithili',
  'Malayalam',
  'Manipuri',
  'Marathi',
  'Nepali',
  'Odia',
  'Punjabi',
  'Sanskrit',
  'Santali',
  'Sindhi',
  'Tamil',
  'Telugu',
  'Urdu',
];

let ALL_LANGUAGES = getAllLanguages();

if (enabled_languages != null && !enabled_languages.includes('@@')) {
  ALL_LANGUAGES = getEnabledLanguages(enabled_languages)
}

const SELECT_PAGE_OPTIONS_FEEDBACK = [
  { module: `${config.initiativeKey_1}`, pages: ['Badges Info', 'Dashboard', `${config.initiative_1} Home`, 'Transcribe', 'Validate', 'Contribution Thank You Page', 'Validation Thank You Page', 'Validator Badges Info'] },
  { module: `${config.initiativeKey_2}`, pages: ['Badges Info', 'Dashboard', `${config.initiative_2} Home`, 'Speak', 'Validate', 'Contribution Thank You Page', 'Validation Thank You Page', 'Validator Badges Info'] },
  { module: `${config.initiativeKey_3}`, pages: ['Badges Info', 'Dashboard', `${config.initiative_3} Home`, 'Translate', 'Validate', 'Contribution Thank You Page', 'Validation Thank You Page', 'Validator Badges Info'] },
  { module: `${config.initiativeKey_4}`, pages: ['Badges Info', 'Dashboard', `${config.initiative_4} Home`, 'Label', 'Validate', 'Contribution Thank You Page', 'Validation Thank You Page', 'Validator Badges Info'] },
  { module: 'others', pages: ['About Us' , 'Home Page' , 'Terms and Conditions' ,'Badges Info', 'My Badges']}
];

const FEEDBACK_CATEGORY = [
  { text: 'Suggestion', value: "suggestion" },
  { text: 'Error', value: "error" },
  { text: 'Complaint', value: "complaint" },
  { text: 'Compliment', value: "compliment" }
];

const OPINION_RATING_MAPPING = [
  { opinion: "very_sad", value: 1 },
  { opinion: "sad", value: 2 },
  { opinion: "neutral", value: 3 },
  { opinion: "happy", value: 4 },
  { opinion: "very_happy", value: 5 },
];


const INITIATIVES = {
  asr: {type: 'asr', value: config.initiativeKey_1,name :config.initiative_1},
  text: {type: 'text', value: config.initiativeKey_2, name :config.initiative_2},
  parallel: {type: 'parallel', value: config.initiativeKey_3,name :config.initiative_3},
  ocr: { type: 'ocr', value: config.initiativeKey_4,name :config.initiative_4}
};

const ALL_MODULES = [
  'text',
  'asr',
  'parallel',
  'ocr',
];

const BADGES_NAME = {
  bronze : config.badge_1,
  silver : config.badge_2,
  gold : config.badge_3,
  platinum : config.badge_4,
}  

const BADGES_STRING = {
  bronze : "badge_1",
  silver : "badge_2",
  gold : "badge_3",
  platinum : "badge_4",
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
  CURRENT_MODULE, TO_LANGUAGE, ALL_MODULES,
  PARALLEL_FROM_LANGUAGE,  PARALLEL_TO_LANGUAGE,
  SELECT_PAGE_OPTIONS_FEEDBACK,
  FEEDBACK_CATEGORY,
  OPINION_RATING_MAPPING,
  MOTHER_TONGUE,
  AGGREGATED_DATA_BY_TOP_LANGUAGE,
  CUMULATIVE_DATA,
  BADGES_NAME,
  INITIATIVES_NAME,config,BADGES_STRING,BADGES_API_TEXT,INITIATIVES
}
