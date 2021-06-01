const fetchMock = require("fetch-mock");
const {
  updateHrsForSayAndListen,
} = require("../src/assets/js/home");
const { readFileSync } = require("fs");
const { stringToHTML, flushPromises, mockLocalStorage } = require("./utils");

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/boloIndia/home.ejs`, "UTF-8") + readFileSync(`${__dirname}/../build/views/common/say-listen-language.ejs`, "UTF-8")
);

describe("updateHrsForSayAndListen", () => {
  const $say_p_3 = document.getElementById("say-p-3");
  const $listen_p_3 = document.getElementById("listen-p-3");
  const $sayLoader = $('#say-loader');
  const $listenLoader = $('#listen-loader');
  const language = "Hindi";

  test("should show 0 hrs in both say and listen component when there is empty aggregateDataCountByLanguage", (done) => {
    mockLocalStorage();

    localStorage.setItem("localeString", JSON.stringify({'hrs recorded in': '%hours hrs recorded in %language', 'hrs validated in' :'%hours hrs validated in %language'}));
    localStorage.setItem("aggregateDataCountByLanguage", JSON.stringify([]));

    updateHrsForSayAndListen(language);

    flushPromises().then(() => {
      expect($say_p_3.innerHTML).toEqual("0 hrs recorded in Hindi");
      expect($listen_p_3.innerHTML).toEqual("0 hrs validated in Hindi");
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

    localStorage.setItem("localeString", JSON.stringify({'hrs recorded in': '%hours hrs recorded in %language', 'hrs validated in' :'%hours hrs validated in %language'}));
    localStorage.setItem("aggregateDataCountByLanguage", JSON.stringify([{language:"Hindi",total_contributions:20, total_validations:30},{language: "Odia"}]));

    updateHrsForSayAndListen(language);

    flushPromises().then(() => {
      expect($say_p_3.innerHTML).toEqual("20 hrs recorded in Hindi");
      expect($listen_p_3.innerHTML).toEqual("30 hrs validated in Hindi");
      expect($sayLoader.hasClass('d-none')).toEqual(true);
      expect($listenLoader.hasClass('d-none')).toEqual(true);
      fetchMock.reset();
      localStorage.clear();
      jest.clearAllMocks();
      done();
    });
  });
});




