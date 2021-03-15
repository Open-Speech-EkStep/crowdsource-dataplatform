const fetchMock = require("fetch-mock");
const {
  updateHrsForSayAndListen,
  getDefaultTargettedDiv,
  setLangNavBar,
} = require("../assets/js/home");
const { readFileSync } = require("fs");
const { performAPIRequest } = require("../assets/js/utils");
const { stringToHTML, flushPromises, mockLocalStorage } = require("./utils");

document.body = stringToHTML(
  readFileSync(`${__dirname}/../views/home.ejs`, "UTF-8") + readFileSync(`${__dirname}/../views/modals/say-listen-language.ejs`, "UTF-8")
);

describe("updateHrsForSayAndListen", () => {
  test("should updade 0 hrs in both say and listen component when there is empty aggregateDataCountByLanguage", (done) => {
    const $say_p_3 = document.getElementById("say-p-3");
    const $listen_p_3 = document.getElementById("listen-p-3");
    mockLocalStorage();
    localStorage.setItem("localeString", JSON.stringify({'hrs recorded in': '%hours hrs recorded in %language', 'hrs validated in' :'%hours hrs validated in %language'}));
    localStorage.setItem("aggregateDataCountByLanguage", JSON.stringify([]));
    fetchMock.get(`/aggregate-data-count?byLanguage=${true}`, { data: [] });
    updateHrsForSayAndListen("Hindi");
    flushPromises().then(() => {
      expect($say_p_3.innerHTML).toEqual("0 hrs recorded in Hindi");
      expect($listen_p_3.innerHTML).toEqual("0 hrs validated in Hindi");
      fetchMock.reset();
      localStorage.clear();
      done();
    });
  });
});




