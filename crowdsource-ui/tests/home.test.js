const fetchMock = require("fetch-mock");
const {
  updateHrsForSayAndListen,
  getStatsSummary
} = require("../src/assets/js/home");
const { readFileSync } = require("fs");
const { stringToHTML, flushPromises, mockLocalStorage, performAPIRequest } = require("./utils");

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/boloIndia/home.ejs`, "UTF-8")
);

describe("updateHrsForSayAndListen", () => {
  const $say_p_3 = document.getElementById("say-p-3");
  const $listen_p_3 = document.getElementById("listen-p-3");
  const $sayLoader = $('#say-loader');
  const $listenLoader = $('#listen-loader');
  const language = "Hindi";
 

  test("should show 0 hrs in both say and listen component when there is empty aggregateDataCountByLanguage", (done) => {
    mockLocalStorage();

    localStorage.setItem("localeString", JSON.stringify({'hrs recorded in': '%hours recorded in %language', 'hrs validated in' :'%hours validated in %language', "Hindi" :"Hindi"}));
    localStorage.setItem("aggregateDataCountByLanguage", JSON.stringify([]));

    updateHrsForSayAndListen(language);

    flushPromises().then(() => {
      expect($say_p_3.innerHTML).toEqual("0s recorded in Hindi");
      expect($listen_p_3.innerHTML).toEqual("0s validated in Hindi");
      expect($sayLoader.hasClass('d-none')).toEqual(true);
      expect($listenLoader.hasClass('d-none')).toEqual(true);
      fetchMock.reset();
      localStorage.clear();
      jest.clearAllMocks();
      done();
    });
  });

  test("should show hrs except 0 in both say and listen component when there is empty aggregateDataCountByLanguage", (done) => {
    mockLocalStorage();

    localStorage.setItem("localeString", JSON.stringify({'hrs recorded in': '%hours recorded in %language', 'hrs validated in' :'%hours validated in %language',"Hindi" :"Hindi"}));
    localStorage.setItem("aggregateDataCountByLanguage", JSON.stringify([{language:"Hindi",total_contributions:20, total_validations:30},{language: "Odia"}]));

    updateHrsForSayAndListen(language);

    flushPromises().then(() => {
      expect($say_p_3.innerHTML).toEqual("20h recorded in Hindi");
      expect($listen_p_3.innerHTML).toEqual("30h validated in Hindi");
      expect($sayLoader.hasClass('d-none')).toEqual(true);
      expect($listenLoader.hasClass('d-none')).toEqual(true);
      fetchMock.reset();
      localStorage.clear();
      jest.clearAllMocks();
      done();
    });
  });

});


describe("getSummaryApi",()=>{
  const $contributionDiv = $('#contribution_stats');
  const $verticalGraph =  $("#bar_charts_container");
  const $viewAllButton =    $("#view_all_btn");
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
    await getStatsSummary();
    setTimeout(() => {
      expect($contributionDiv.hasClass('d-none')).toEqual(true);
      expect($verticalGraph.hasClass('d-none')).toEqual(true);
      expect($viewAllButton.hasClass('d-none')).toEqual(true);
      fetchMock.reset();
    }, 1000);
  })
});




