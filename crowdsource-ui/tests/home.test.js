const fetchMock = require("fetch-mock");
const {
  // updateHrsForSayAndListen,
  getStatsSummary
} = require("../src/assets/js/home");
const { readFileSync } = require("fs");
const { stringToHTML, /*flushPromises, mockLocalStorage*/ } = require("./utils");

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/text/home.ejs`, "UTF-8")
);

describe("getSummaryApi", () => {
  const $contributionDiv = $('#contribution_stats');
  const $verticalGraph = $("#bar_charts_container");
  const $viewAllButton = $("#view_all_btn");
  test("should call get summary api with no data", async () => {
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




