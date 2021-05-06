const {
    CONTRIBUTION_LANGUAGE,TOP_LANGUAGES_BY_HOURS,TO_LANGUAGE,ALL_LANGUAGES
  } = require('./constants');
const {constructChart}= require('./horizontalBarGraph');
const {changeLocale}= require('./locale');

const getContributedAndTopLanguage = (topLanguagesData, type) => {
    const contributedLanguage = type === "likho" ? localStorage.getItem(CONTRIBUTION_LANGUAGE) + '-' +  localStorage.getItem(TO_LANGUAGE): localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const topLanguageArray = [];
    const contributedLanguageHours = topLanguagesData.find(item => item.language === contributedLanguage);
    contributedLanguageHours ? topLanguageArray.push(contributedLanguageHours) : topLanguageArray.push({language: null,total_contributions: "0.000"});
    let remainingLanguage = topLanguagesData.filter(item => item.language !== contributedLanguage);
    remainingLanguage = remainingLanguage.sort((a, b) => Number(a.total_contributions) > Number(b.total_contributions) ? -1 : 1);
    const topLanguages = remainingLanguage.slice(0,3);
    return topLanguageArray.concat(topLanguages).reverse();
  }

function showByHoursChart() {
  const chartReg = {};
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  constructChart(
    JSON.parse(topLanguagesByHoursData),
    "total_contributions",
    "language"
  );
}

function redirectToLocalisedPage() {
  const locale = localStorage.getItem("i18n");
  const splitValues = location.href.split('/');
  const currentLocale = splitValues[splitValues.length - 2];
  const contribution_langugae = localStorage.getItem(CONTRIBUTION_LANGUAGE);
  $('#home-page').attr('default-lang', contribution_langugae);
  if (currentLocale != locale) {
    changeLocale(locale);
  }
  else {
    const language = ALL_LANGUAGES.find(ele => ele.id === locale);
    if (language) {
      updateLocaleLanguagesDropdown(language.value);
    }
  }
}

module.exports =  {getContributedAndTopLanguage,showByHoursChart,redirectToLocalisedPage};