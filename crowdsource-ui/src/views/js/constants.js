const DEFAULT_CON_LANGUAGE = "Hindi";
const AUDIO_DURATION = 6;
const SIXTY = 60;
const HOUR_IN_SECONDS = 3600;
const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
const AGGREGATED_DATA_BY_LANGUAGE = "aggregateDataCountByLanguage";
const LOCALE_STRINGS = 'localeString';
const SELECTED_MODULE = "selectedModule";
const CONTRIBUTION_LANGUAGE = "contributionLanguage";
const TO_LANGUAGE = "to-language";
const SPEAKER_DETAILS_KEY = 'speakerDetails';
const ALL_LANGUAGES = [
  {value: "Assamese", id: "as", text: "অসমীয়া", hasLocaleText: true, data: true},
  {value: "Bengali", id: "bn", text: "বাংলা", hasLocaleText: true, data: true},
  {value: "English", id: "en", text: "English", hasLocaleText: true, data: true},
  {value: "Gujarati", id: "gu", text: "ગુજરાતી", hasLocaleText: true, data: true},
  {value: "Hindi", id: "hi", text: "हिंदी", hasLocaleText: true, data: true},
  {value: "Kannada", id: "kn", text: "ಕನ್ನಡ", hasLocaleText: true, data: true},
  {value: "Malayalam", id: "ml", text: "മലയാളം", hasLocaleText: true, data: true},
  {value: "Marathi", id: "mr", text: "मराठी", hasLocaleText: true, data: true},
  {value: "Odia", id: "or", text: "ଓଡିଆ", hasLocaleText: true, data: true},
  {value: "Punjabi", id: "pa", text: "ਪੰਜਾਬੀ", hasLocaleText: true, data: true},
  {value: "Tamil", id: "ta", text: "தமிழ்", hasLocaleText: true, data: true},
  {value: "Telugu", id: "te", text: "తెలుగు", hasLocaleText: true, data: true}];

const BADGES = {
  bronze: {imgLg: "../img/bronze_badge.svg", imgSm: "../img/bronze_contributor.jpeg"},
  silver: {imgLg: "../img/silver_badge.svg", imgSm: "../img/silver_contributor.jpeg"},
  gold: {imgLg: "../img/gold_badge.svg", imgSm: "../img/gold_contributor.jpeg"},
  platinum: {imgLg: "../img/platinum_badge.svg", imgSm: "../img/platinum_contributor.jpeg"},
  certificate: {imgLg: "../img/certificate.svg", imgSm: "../img/certificate.svg"}
}

const CURRENT_MODULE = 'module';

const MODULE = {
  bolo: {url: 'boloIndia', value: 'bolo'},
  suno: {url: 'sunoIndia', value: 'suno'},
  likho: {url: 'likhoIndia', value: 'likho'},
  dekho: {url: 'dekhoIndia', value: 'dekho'}
};

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
  BADGES,
  SPEAKER_DETAILS_KEY,
  SELECTED_MODULE, MODULE, CURRENT_MODULE, TO_LANGUAGE
}
