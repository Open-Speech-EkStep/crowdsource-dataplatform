const {BADGES} = require('./constants.js');

function downloadPdf(badgeType) {
  const pdf = new jsPDF()
  const img = new Image();
  img.onload = function () {
    pdf.addImage(this, 36, 10, 128, 128);
    pdf.save(`${badgeType}-badge.pdf`);
  };

  img.crossOrigin = "Anonymous";
  img.src = BADGES[badgeType].imgSm;
  const allBadges = JSON.parse(localStorage.getItem('badges'));
  const badge = allBadges.find(e => e.grade && e.grade.toLowerCase() === badgeType.toLowerCase());
  if (badge) {
    pdf.text(`Badge Id : ${badge.generated_badge_id}`, 36, 150);
  }
}

$("#bronze_badge_link, #silver_badge_link, #gold_badge_link, #platinum_badge_link").on('click', function () {
  if (!$(this).attr("disabled")) {
    downloadPdf($(this).attr("data-badge"));
  }
});

module.exports = {downloadPdf}