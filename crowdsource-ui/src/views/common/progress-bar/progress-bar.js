const setCurrentSentenceIndex = index => {
  const currentSentenceLbl = document.getElementById('currentSentenceLbl');
  currentSentenceLbl.innerText = index;
};

const setTotalSentenceIndex = index => {
  const totalSentencesLbl = document.getElementById('totalSentencesLbl');
  totalSentencesLbl.innerText = index;
};

module.exports = { setCurrentSentenceIndex, setTotalSentenceIndex };
