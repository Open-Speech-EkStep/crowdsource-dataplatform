const {CURRENT_MODULE,CONTRIBUTION_LANGUAGE, ALL_LANGUAGES, BADGES_API_TEXT} = require('./constants.js');
const {getInitiativeType} = require('./utils.js');

function downloadPdf(badgeType) {
  try {
    const pdf = new jsPDF();
    const img = new Image();
    img.onload = function () {
      pdf.addImage(this, 50, 10, 105, 130);
      pdf.save(`${BADGES_API_TEXT[badgeType]}-badge.pdf`);
    };
  
    img.crossOrigin = "Anonymous";
    const currentModule = localStorage.getItem(CURRENT_MODULE);
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const initiativeType = getInitiativeType(currentModule);
    const currentFunctionalPage = localStorage.getItem("selectedType");
    img.src = getPngBadges(contributionLanguage,badgeType, currentFunctionalPage, initiativeType);
    const allBadges = JSON.parse(localStorage.getItem('badges'));
    const badge = allBadges.find(e => e.grade && e.grade.toLowerCase() === BADGES_API_TEXT[badgeType].toLowerCase());
    if (badge) {
      pdf.text(`Badge Id : ${badge.generated_badge_id}`, 36, 190);
    }
  } catch (error) {
    console.log(error);
  }
}

const getPngBadges = (contibutedLanguage, badgeType, source, initiativeType) =>{
  const language = ALL_LANGUAGES.find(language=>language.value.toLowerCase() === contibutedLanguage.toLowerCase());
  const langaugePrefix = language ? language.id : 'en';
  return `/img/${langaugePrefix}_${initiativeType}_${badgeType}_${source}.png`;
}

$("#badge_1_badge_link, #badge_2_badge_link, #badge_3_badge_link, #badge_4_badge_link").on('click', function () {
  if (!$(this).attr("disabled")) {
    downloadPdf($(this).attr("data-badge"));
  }
});

module.exports = {downloadPdf}