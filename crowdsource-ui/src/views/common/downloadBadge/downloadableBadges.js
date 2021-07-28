const { getLanguageBadge } = require('./utils.js');
const {CURRENT_MODULE,CONTRIBUTION_LANGUAGE} = require('./constants.js');

function downloadPdf(badgeType) {
  try {
    const pdf = new jsPDF();
    const img = new Image();
    img.onload = function () {
      pdf.addImage(this, 50, 10, 108, 130);
      pdf.save(`${badgeType}-badge.pdf`);
    };
  
    img.crossOrigin = "Anonymous";
    const currentModule = localStorage.getItem(CURRENT_MODULE);
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);

    const currentFunctionalPage = localStorage.getItem("selectedType");
    img.src = getLanguageBadge(contributionLanguage,badgeType, currentFunctionalPage, currentModule);
    const allBadges = JSON.parse(localStorage.getItem('badges'));
    const badge = allBadges.find(e => e.grade && e.grade.toLowerCase() === badgeType.toLowerCase());
    if (badge) {
      pdf.text(`Badge Id : ${badge.generated_badge_id}`, 36, 190);
    }
  } catch (error) {
    console.log(error);
  }
 
}

$("#bronze_badge_link, #silver_badge_link, #gold_badge_link, #platinum_badge_link").on('click', function () {
  if (!$(this).attr("disabled")) {
    downloadPdf($(this).attr("data-badge"));
  }
});

module.exports = {downloadPdf}