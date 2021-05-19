const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');
const {CONTRIBUTION_LANGUAGE} = require('../build/js/common/constants');
const {getStatistics, getStatsSummary,getDefaultLang,setDefaultLang} = require('../build/js/common/commonHome.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/sunoIndia/home.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../build/views/common/languageNavBar.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../build/views/common/say-listen-language.ejs`, 'UTF-8')
);


describe("getStatistics",()=>{
  test("should setLoaders and show details after setting speaker details",()=>{
    const $speakersData = $("#speaker-data");
    const $speakersDataLoader = $speakersData.find('#loader1');
    const $speakerDataDetails = $speakersData.find('#contribution-details');

    getStatistics({},null, "");

    expect($speakersDataLoader.hasClass('d-none')).toEqual(true);
    expect($speakerDataDetails.hasClass('d-none')).toEqual(false);
  })
})

describe("getDefaultLang",()=>{
  test("should give language added in localStorage as default language",()=>{
    mockLocalStorage();
    localStorage.setItem(CONTRIBUTION_LANGUAGE,"hindi");
    const $homePage = document.getElementById('home-page');
    $homePage.setAttribute('default-lang',"hindi")

    const language = getDefaultLang();

    expect(language).toEqual("hindi");
    localStorage.clear();
  })
})