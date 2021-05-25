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
const LIKHO_TO_LANGUAGE = "likho_to-language";
const LIKHO_FROM_LANGUAGE = "likho_from-language";
const SPEAKER_DETAILS_KEY = 'speakerDetails';
const ALL_LANGUAGES = [
  {value: "Assamese", id: "as", text: "অসমীয়া", hasLocaleText: false, data: true},
  {value: "Bengali", id: "bn", text: "বাংলা", hasLocaleText: false, data: true},
  {value: "English", id: "en", text: "English", hasLocaleText: true, data: true},
  {value: "Gujarati", id: "gu", text: "ગુજરાતી", hasLocaleText: false, data: true},
  {value: "Hindi", id: "hi", text: "हिंदी", hasLocaleText: false, data: true},
  {value: "Kannada", id: "kn", text: "ಕನ್ನಡ", hasLocaleText: false, data: true},
  {value: "Malayalam", id: "ml", text: "മലയാളം", hasLocaleText: false, data: true},
  {value: "Marathi", id: "mr", text: "मराठी", hasLocaleText: false, data: true},
  {value: "Odia", id: "or", text: "ଓଡିଆ", hasLocaleText: false, data: true},
  {value: "Punjabi", id: "pa", text: "ਪੰਜਾਬੀ", hasLocaleText: false, data: true},
  {value: "Tamil", id: "ta", text: "தமிழ்", hasLocaleText: false, data: true},
  {value: "Telugu", id: "te", text: "తెలుగు", hasLocaleText: false, data: true}];

const BADGES = {
  bronze: {imgLg: "../../img/bronze_badge.svg", imgSm: "../../img/bronze_contributor.jpg"},
  silver: {imgLg: "../../img/silver_badge.svg", imgSm: "../../img/silver_contributor.jpg"},
  gold: {imgLg: "../../img/gold_badge.svg", imgSm: "../../img/gold_contributor.jpg"},
  platinum: {imgLg: "../../img/platinum_badge.svg", imgSm: "../../img/platinum_contributor.jpg"},
}

const CURRENT_MODULE = 'module';

const MODULE = {
  bolo: {url: 'boloIndia', value: 'bolo', BADGES :{
      bronze: {imgLg: "../../img/bronze_badge.svg", imgSm: "../../img/bronze_contributor.jpg",imgValSvg:"../img/bolo_bronze_val.svg",imgValJpg:"../img/bolo_bronze_val_jpg.jpeg"},
      silver: {imgLg: "../../img/silver_badge.svg", imgSm: "../../img/silver_contributor.jpg",imgValSvg:"../img/bolo_silver_val.svg",imgValJpg:"../img/bolo_silver_val_jpg.jpeg"},
      gold: {imgLg: "../../img/gold_badge.svg", imgSm: "../../img/gold_contributor.jpg",imgValSvg:"../img/bolo_gold_val.svg",imgValJpg:"../img/bolo_gold_val_jpg.jpeg"},
      platinum: {imgLg: "../../img/platinum_badge.svg", imgSm: "../../img/platinum_contributor.jpg",imgValSvg:"../img/bolo_platinum_val.svg",imgValJpg:"../img/bolo_platinum_val_jpg.jpeg"},
    }},
  suno: {url: 'sunoIndia', value: 'suno',BADGES :{
      bronze: {imgLg: "../../img/suno_bronze_badge.svg", imgSm: "../../img/suno_bronze_contributor.jpg",imgValSvg:"../../img/suno_bronze_val.svg",imgValJpg:"../../img/suno_bronze_val_jpg.jpeg"},
      silver: {imgLg: "../../img/suno_silver_badge.svg", imgSm: "../../img/suno_silver_contributor.jpg",imgValSvg:"../../img/suno_silver_val.svg",imgValJpg:"../../img/suno_silver_val_jpg.jpeg"},
      gold: {imgLg: "../../img/suno_gold_badge.svg", imgSm: "../../img/suno_gold_contributor.jpg",imgValSvg:"../../img/suno_gold_val.svg",imgValJpg:"../img/../suno_gold_val_jpg.jpeg"},
        platinum: {imgLg: "../../img/suno_platinum_badge.svg", imgSm: "../../img/suno_platinum_contributor.jpg",imgValSvg:"../../img/suno_platinum_val.svg",imgValJpg:"../../img/suno_platinum_val_jpg.jpeg"},
    }},

  likho: {url: 'likhoIndia', value: 'likho',BADGES :{
      bronze: {imgLg: "../../img/likho_bronze_badge.svg", imgSm: "../../img/likho_bronze_contributor.jpg",imgValSvg:"../../img/likho_bronze_val.svg",imgValJpg:"../../img/likho_bronze_val_jpg.jpeg"},
      silver: {imgLg: "../../img/likho_silver_badge.svg", imgSm: "../../img/likho_silver_contributor.jpg",imgValSvg:"../../img/likho_silver_val.svg",imgValJpg:"../../img/likho_silver_val_jpg.jpeg"},
      gold: {imgLg: "../../img/likho_gold_badge.svg", imgSm: "../../img/likho_gold_contributor.jpg",imgValSvg:"../../img/likho_gold_val.svg",imgValJpg:"../../img/likho_gold_val_jpg.jpeg"},
      platinum: {imgLg: "../../img/likho_platinum_badge.svg", imgSm: "../../img/likho_platinum_contributor.jpg",imgValSvg:"../../img/likho_platinum_val.svg",imgValJpg:"../../img/likho_platinum_val_jpg.jpeg"},
    }},
  dekho: {url: 'dekhoIndia', value: 'dekho', BADGES :{
      bronze: {imgLg: "../../img/dekho_bronze_badge.svg", imgSm: "../../img/dekho_bronze_contributor.jpg",imgValSvg:"../../img/dekho_bronze_val.svg",imgValJpg:"../../img/dekho_bronze_val_jpg.jpeg"},
      silver: {imgLg: "../../img/dekho_silver_badge.svg", imgSm: "../../img/dekho_silver_contributor.jpg",imgValSvg:"../../img/dekho_silver_val.svg",imgValJpg:"../../img/dekho_silver_val_jpg.jpeg"},
      gold: {imgLg: "../../img/dekho_gold_badge.svg", imgSm: "../../img/dekho_gold_contributor.jpg",imgValSvg:"../../img/dekho_gold_val.svg",imgValJpg:"../../img/dekho_gold_val_jpg.jpeg"},
      platinum: {imgLg: "../../img/dekho_platinum_badge.svg", imgSm: "../../img/dekho_platinum_contributor.jpg",imgValSvg:"../../img/dekho_platinum_val.svg",imgValJpg:"../../img/dekho_platinum_val_jpg.jpeg"},
    }},
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
  SELECTED_MODULE, MODULE, CURRENT_MODULE, TO_LANGUAGE,
  LIKHO_FROM_LANGUAGE, LIKHO_TO_LANGUAGE
}
