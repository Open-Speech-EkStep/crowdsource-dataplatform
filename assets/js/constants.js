const DEFAULT_CON_LANGUAGE = "Hindi";
const AUDIO_DURATION = 6;
const SIXTY = 60;
const HOUR_IN_SECONDS = 3600;
const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
const AGGREGATED_DATA_BY_LANGUAGE =  "aggregateDataCountByLanguage";
const LOCALE_STRINGS = 'localeString';
const CONTRIBUTION_LANGUAGE = "contributionLanguage";
const ALL_LANGUAGES = [
    {value: "Assamese",id: "as", text: "অসমীয়া", hasLocaleText: true},
    {value: "Bengali", id: "bn", text: "বাংলা", hasLocaleText: true},
    {value: "English", id: "en", text: "English", hasLocaleText: true},
    {value: "Gujarati", id: "gu", text: "ગુજરાતી", hasLocaleText: true},
    {value: "Hindi", id: "hi", text: "हिंदी", hasLocaleText: true},
    {value: "Kannada", id: "kn", text: "ಕನ್ನಡ", hasLocaleText: true},
    {value: "Malayalam", id: "ml", text: "മലയാളം", hasLocaleText: true},
    {value: "Marathi", id: "mr", text: "मराठी", hasLocaleText: true},
    {value: "Odia", id: "or", text: "ଓଡିଆ", hasLocaleText: true},
    {value: "Punjabi", id: "pa", text: "ਪੰਜਾਬੀ", hasLocaleText: true},
    {value: "Tamil", id: "ta", text: "தமிழ்", hasLocaleText: true},
    {value: "Telugu", id: "te", text: "తెలుగు", hasLocaleText: true},
    {value: "Dogri", id: "doi", text: "Dogri", hasLocaleText: false},
    {value: "Maithili", id: "mai", text: "Maithili", hasLocaleText: false},
    {value: "Urdu", id: "ur", text: "Urdu", hasLocaleText: false},
    {value: "Konkani Roman", id: "kr", text: "Konkani Roman", hasLocaleText: false},
    {value: "Konkani DV", id: "kd", text: "Konkani DV", hasLocaleText: false},
    {value: "Manipuri BN", id: "mnibn", text: "Manipuri BN", hasLocaleText: false},
    {value: "Manipuri MM", id: "mnimm", text: "Manipuri MM", hasLocaleText: false},
    {value: "Santali OL", id: "satol", text: "Santali OL", hasLocaleText: false},
    {value: "Santali DV", id: "satdv", text: "Santali DV", hasLocaleText: false},
    {value: "Sanskrit", id: "sa", text: "Sanskrit", hasLocaleText: false}];

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
    CONTRIBUTION_LANGUAGE
}
