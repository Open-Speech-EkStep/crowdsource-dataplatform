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
    {value: "Assamese",id: "as", text: "অসমীয়া", hasLocaleText: true, data:true},
    {value: "Bengali", id: "bn", text: "বাংলা", hasLocaleText: true,data:true},
    {value: "English", id: "en", text: "English", hasLocaleText: true,data:true},
    {value: "Gujarati", id: "gu", text: "ગુજરાતી", hasLocaleText: true,data:true},
    {value: "Hindi", id: "hi", text: "हिंदी", hasLocaleText: true,data:true},
    {value: "Kannada", id: "kn", text: "ಕನ್ನಡ", hasLocaleText: true,data:true},
    {value: "Malayalam", id: "ml", text: "മലയാളം", hasLocaleText: true,data:true},
    {value: "Marathi", id: "mr", text: "मराठी", hasLocaleText: true,data:true},
    {value: "Odia", id: "or", text: "ଓଡିଆ", hasLocaleText: true,data:true},
    {value: "Punjabi", id: "pa", text: "ਪੰਜਾਬੀ", hasLocaleText: true,data:true},
    {value: "Tamil", id: "ta", text: "தமிழ்", hasLocaleText: true,data:true},
    {value: "Telugu", id: "te", text: "తెలుగు", hasLocaleText: true,data:true},
    {value: "Dogri", id: "doi", text: "डोगरी", hasLocaleText: false,data:true},
    {value: "Maithili", id: "mai", text: "Maithili", hasLocaleText: false,data:true},
    {value: "Urdu", id: "ur", text: "اردو", hasLocaleText: true,data:false},
    {value: "Konkani Roman", id: "kr", text: "Konkani Roman", hasLocaleText: true,data:false},
    {value: "Konkani DV", id: "kd", text: "Konkani DV", hasLocaleText: true,data:false},
    {value: "Manipuri BN", id: "mnibn", text: "Manipuri BN", hasLocaleText: false,data:false},
    {value: "Manipuri MM", id: "mnimm", text: "Manipuri MM", hasLocaleText: false,data:false},
    {value: "Santali OL", id: "satol", text: "Santali OL", hasLocaleText: false,data:false},
    {value: "Santali DV", id: "satdv", text: "Santali DV", hasLocaleText: false,data:false},
    {value: "Sanskrit", id: "sa", text: "Sanskrit", hasLocaleText: true,data:false}];

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
