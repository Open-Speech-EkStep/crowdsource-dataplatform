const fetchMock = require("fetch-mock");
const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('../utils');
const {CONTRIBUTION_LANGUAGE} = require('../../build/js/common/constants');
const {getStatistics, getStatsSummary,getDefaultLang,setDefaultLang} = require('../../build/js/common/commonHome.js');
document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/sunoIndia/home.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../../build/views/common/languageNavBar.ejs`, 'UTF-8')
);


describe("getStatistics",()=>{
  test("should setLoaders and show details after setting speaker details",()=>{
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const $speakersData = $("#speaker-data");
    const $speakersDataLoader = $speakersData.find('#loader1');
    const $speakerDataDetails = $speakersData.find('#contribution-details');

    getStatistics({},null, "");

    expect($speakersDataLoader.hasClass('d-none')).toEqual(true);
    expect($speakerDataDetails.hasClass('d-none')).toEqual(false);
    localStorage.clear()

  })
})

describe("getSummaryApi",()=>{
  const $contributionDiv = $('#contribution_stats');
  const $verticalGraph =  $("#bar_charts_container");
  const $viewAllButton =  $("#view_all_btn");
  test("should call get summary api with no data",async ()=>{
    fetchMock.get(`/stats/summary/asr`, {
      aggregate_data_by_language: [],
      aggregate_data_by_state: [],
      aggregate_data_by_state_and_language: [],
      aggregate_data_count: [],
      languages: [],
      last_updated_at: "22-06-2021, 3:32:21 pm",
      top_languages_by_hours: [],
      top_languages_by_speakers: [],
    });
    await getStatsSummary('/stats/summary/asr', 'suno',() =>{});
    setTimeout(() => {
      expect($contributionDiv.hasClass('d-none')).toEqual(true);
      expect($verticalGraph.hasClass('d-none')).toEqual(true);
      expect($viewAllButton.hasClass('d-none')).toEqual(true);
      fetchMock.reset();
    }, 1000);
  })
});

