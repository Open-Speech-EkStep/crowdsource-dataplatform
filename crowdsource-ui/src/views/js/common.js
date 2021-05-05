const {
    CONTRIBUTION_LANGUAGE,TOP_LANGUAGES_BY_HOURS
  } = require('./constants');
const {constructChart}= require('./horizontalBarGraph');

const getContributedAndTopLanguage = (topLanguagesData) => {
    const contributedLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
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

module.exports =  {getContributedAndTopLanguage,showByHoursChart};