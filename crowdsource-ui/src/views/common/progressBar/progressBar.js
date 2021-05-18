const setCurrentSentenceIndex = index => {
  const currentSentenceLbl = document.getElementById('currentSentenceLbl');
  currentSentenceLbl.innerText = index;
};

const setTotalSentenceIndex = index => {
  const totalSentencesLbl = document.getElementById('totalSentencesLbl');
  totalSentencesLbl.innerText = index;
};

const updateProgressBar = (index, totalItems) => {
  const $progressBar = $("#progress_bar");
  const multiplier = 10 * (10 / totalItems);
  $progressBar.width(index * multiplier + '%');
  $progressBar.prop('aria-valuenow', index);
  setCurrentSentenceIndex(index);
}


module.exports = { setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar};
