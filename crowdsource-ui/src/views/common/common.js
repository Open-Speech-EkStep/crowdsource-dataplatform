const {
    CONTRIBUTION_LANGUAGE,
  } = require('../common/constants');

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

  module.exports =  {getContributedAndTopLanguage};