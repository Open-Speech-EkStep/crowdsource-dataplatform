const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');
const {setCurrentSentenceIndex, setTotalSentenceIndex ,updateProgressBar} = require('../build/js/common/progressBar.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/common/progressBar.ejs`, 'UTF-8')
);

describe("setCurrentSentenceIndex",()=>{
  test("should set innerText of 'currentSentenceLbl' equals to given index",()=>{

    const currentSentenceLbl = document.getElementById('currentSentenceLbl');
    setCurrentSentenceIndex(2);
    const value = currentSentenceLbl.innerText;
    expect(value).toEqual(2);
  })
})

describe("setTotalSentenceIndex",()=>{
  test("should set innerText of 'totalSentencesLbl' equals to given index",()=>{

    const totalSentencesLbl = document.getElementById('totalSentencesLbl');
    setTotalSentenceIndex(5);
    const value = totalSentencesLbl.innerText;
    expect(value).toEqual(5);
  })
})

describe("updateProgressBar",()=>{
  test("should set innerText of 'totalSentencesLbl' equals to given index",()=>{

    const $progressBar = $("#progress_bar");
    const currentSentenceLbl = document.getElementById('currentSentenceLbl');

    updateProgressBar(3,5);
    const value = currentSentenceLbl.innerText;
    expect(value).toEqual(3);
    expect($progressBar.prop('aria-valuenow')).toEqual(3);
  })
})