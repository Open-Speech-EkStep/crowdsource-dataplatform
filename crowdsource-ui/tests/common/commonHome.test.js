const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('../utils');
const {getStatistics} = require('../../build/js/common/commonHome.js');
document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/asr/home.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../../build/views/common/languageNavBar.ejs`, 'UTF-8')
);


describe("getStatistics",()=>{
  test("should setLoaders and show details after setting speaker details",()=>{
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const $speakersData = $("#speaker-data");
    const $speakerDataDetails = $speakersData.find('#contribution-details');

    getStatistics({},null, "");

    expect($speakerDataDetails.hasClass('d-none')).toEqual(false);
    localStorage.clear()

  })
})



