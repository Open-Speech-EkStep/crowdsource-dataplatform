const { getEnabledLanguages, getAllLanguages } = require('./language-filter')
const { enabled_languages } = require('./env-api')

const DEFAULT_CON_LANGUAGE = "English";
const AUDIO_DURATION = 6;
const SIXTY = 60;
const HOUR_IN_SECONDS = 3600;
const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
const AGGREGATED_DATA_BY_LANGUAGE = "aggregateDataCountByLanguage";
const LOCALE_STRINGS = 'localeString';
const CONTRIBUTION_LANGUAGE = "contributionLanguage";
const SPEAKER_DETAILS_KEY = 'speakerDetails';
const LIKHO_TO_LANGUAGE = "likho_to-language";
const LIKHO_FROM_LANGUAGE = "likho_from-language";

let ALL_LANGUAGES = getAllLanguages()

if (enabled_languages != null && !enabled_languages.includes('@@')) {
    ALL_LANGUAGES = getEnabledLanguages(enabled_languages)
}

const BADGES = {
    bronze: { imgLg: "../img/bronze_badge.svg", imgSm: "../img/bronze_contributor.jpg" },
    silver: { imgLg: "../img/silver_badge.svg", imgSm: "../img/silver_contributor.jpg" },
    gold: { imgLg: "../img/gold_badge.svg", imgSm: "../img/gold_contributor.jpg" },
    platinum: { imgLg: "../img/platinum_badge.svg", imgSm: "../img/platinum_contributor.jpg" },
}
const BOLOPAGE = {
    bronze : {imgLg : "../img/bronze_medal.svg", imgSm:"../img/bronze_medal_val.svg"},
    silver :{imgLg:"../img/silver_medal.svg",imgSm:"../img/silver_medal_val.svg"},
    gold :{imgLg:"../img/gold_medal.svg",imgSm:"../img/gold_medal_val.svg"},
    platinum :{imgLg:"../img/platinum_medal.svg",imgSm:"../img/platinum_medal_val.svg"},
}
const SUNOPAGE = {
    bronze : {imgLg : "../img/suno_bronze_medal.svg", imgSm:"../img/suno_bronze_medal_val.svg"},
    silver :{imgLg:"../img/suno_silver_medal.svg",imgSm:"../img/suno_silver_medal_val.svg"},
    gold :{imgLg:"../img/suno_gold_medal.svg",imgSm:"../img/suno_gold_medal_val.svg"},
    platinum :{imgLg:"../img/suno_platinum_medal.svg",imgSm:"../img/suno_platinum_medal_val.svg"},
}
const DEKHOPAGE = {
    bronze : {imgLg : "../img/dekho_bronze_medal.svg", imgSm:"../img/dekho_bronze_medal_val.svg"},
    silver :{imgLg:"../img/dekho_silver_medal.svg",imgSm:"../img/dekho_silver_medal_val.svg"},
    gold :{imgLg:"../img/dekho_gold_medal.svg",imgSm:"../img/dekho_gold_medal_val.svg"},
    platinum :{imgLg:"../img/dekho_platinum_medal.svg",imgSm:"../img/dekho_platinum_medal_val.svg"},
}
const LIKHOPAGE = {
    bronze : {imgLg : "../img/likho_bronze_medal.svg", imgSm:"../img/likho_bronze_medal_val.svg"},
    silver :{imgLg:"../img/likho_silver_medal.svg",imgSm:"../img/likho_silver_medal_val.svg"},
    gold :{imgLg:"../img/likho_gold_medal.svg",imgSm:"../img/likho_gold_medal_val.svg"},
    platinum :{imgLg:"../img/likho_platinum_medal.svg",imgSm:"../img/likho_platinum_medal_val.svg"},
}
const CURRENT_MODULE = 'module';
const MODULE = {
    bolo: {
        url: 'boloIndia', value: 'bolo', BADGES: {
            bronze: { imgLg: "../img/bronze_badge.svg", imgSm: "../img/bolo_bronze_con.jpeg", imgValSvg: "../img/bolo_bronze_val.svg", imgValJpg: "../img/bolo_bronze_val.jpeg" },
            silver: { imgLg: "../img/silver_badge.svg", imgSm: "../img/bolo_silver_con.jpeg", imgValSvg: "../img/bolo_silver_val.svg", imgValJpg: "../img/bolo_silver_val.jpeg" },
            gold: { imgLg: "../img/gold_badge.svg", imgSm: "../img/bolo_gold_con.jpeg", imgValSvg: "../img/bolo_gold_val.svg", imgValJpg: "../img/bolo_gold_val.jpeg" },
            platinum: { imgLg: "../img/platinum_badge.svg", imgSm: "../img/bolo_platinum_con.jpeg", imgValSvg: "../img/bolo_platinum_val.svg", imgValJpg: "../img/bolo_platinum_val.jpeg" },
        }
    },
    suno: {
        url: 'sunoIndia', value: 'suno', BADGES: {
            bronze: { imgLg: "../../img/suno_bronze_badge.svg", imgSm: "../../img/suno_bronze_con.jpeg", imgValSvg: "../../img/suno_bronze_val.svg", imgValJpg: "../../img/suno_bronze_val.jpeg" },
            silver: { imgLg: "../../img/suno_silver_badge.svg", imgSm: "../../img/suno_silver_con.jpeg", imgValSvg: "../../img/suno_silver_val.svg", imgValJpg: "../../img/suno_silver_val.jpeg" },
            gold: { imgLg: "../../img/suno_gold_badge.svg", imgSm: "../../img/suno_gold_con.jpeg", imgValSvg: "../../img/suno_gold_val.svg", imgValJpg: "../../img/suno_gold_val.jpeg" },
            platinum: { imgLg: "../../img/suno_platinum_badge.svg", imgSm: "../../img/suno_platinum_con.jpeg", imgValSvg: "../../img/suno_platinum_val.svg", imgValJpg: "../../img/suno_platinum_val.jpeg" },
        }
    },

    likho: {
        url: 'likhoIndia', value: 'likho', BADGES: {
            bronze: { imgLg: "../../img/likho_bronze_badge.svg", imgSm: "../../img/likho_bronze_con.jpeg", imgValSvg: "../../img/likho_bronze_val.svg", imgValJpg: "../../img/likho_bronze_val.jpeg" },
            silver: { imgLg: "../../img/likho_silver_badge.svg", imgSm: "../../img/likho_silver_con.jpeg", imgValSvg: "../../img/likho_silver_val.svg", imgValJpg: "../../img/likho_silver_val.jpeg" },
            gold: { imgLg: "../../img/likho_gold_badge.svg", imgSm: "../../img/likho_gold_con.jpeg", imgValSvg: "../../img/likho_gold_val.svg", imgValJpg: "../../img/likho_gold_val.jpeg" },
            platinum: { imgLg: "../../img/likho_platinum_badge.svg", imgSm: "../../img/likho_platinum_con.jpeg", imgValSvg: "../../img/likho_platinum_val.svg", imgValJpg: "../../img/likho_platinum_val.jpeg" },
        }
    },
    dekho: {
        url: 'dekhoIndia', value: 'dekho', BADGES: {
            bronze: { imgLg: "../../img/dekho_bronze_badge.svg", imgSm: "../../img/dekho_bronze_con.jpeg", imgValSvg: "../../img/dekho_bronze_val.svg", imgValJpg: "../../img/dekho_bronze_val.jpeg" },
            silver: { imgLg: "../../img/dekho_silver_badge.svg", imgSm: "../../img/dekho_silver_con.jpeg", imgValSvg: "../../img/dekho_silver_val.svg", imgValJpg: "../../img/dekho_silver_val.jpeg" },
            gold: { imgLg: "../../img/dekho_gold_badge.svg", imgSm: "../../img/dekho_gold_con.jpeg", imgValSvg: "../../img/dekho_gold_val.svg", imgValJpg: "../../img/dekho_gold_val.jpeg" },
            platinum: { imgLg: "../../img/dekho_platinum_badge.svg", imgSm: "../../img/dekho_platinum_con.jpeg", imgValSvg: "../../img/dekho_platinum_val.svg", imgValJpg: "../../img/dekho_platinum_val.jpeg" },
        }
    },
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
    CURRENT_MODULE,
    MODULE,
    BOLOPAGE,
    DEKHOPAGE,
    SUNOPAGE,
    LIKHOPAGE,
    LIKHO_TO_LANGUAGE,
    LIKHO_FROM_LANGUAGE,
}
