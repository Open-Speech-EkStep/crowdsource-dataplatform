const fetchMock = require("fetch-mock");
const {
  performAPIRequest,
  updateHrsForSayAndListen,
  getDefaultTargettedDiv,
} = require("../assets/js/home");
const { readFileSync } = require("fs");
const { stringToHTML, flushPromises, mockLocalStorage } = require("./utils");

document.body = stringToHTML(
  readFileSync(`${__dirname}/../views/home.ejs`, "UTF-8")
);

describe("performAPIRequest", () => {
  test("should give details for given language if server responds ok", () => {
    fetchMock.get("/aggregate-data-count", {
      data: [
        {
          total_languages: "2",
          total_speakers: "80",
          total_contributions: "0.348",
          total_validations: "0.175",
        },
      ],
    });
    performAPIRequest("/aggregate-data-count").then((data) => {
      expect(data).toEqual({
        data: [
          {
            total_languages: "2",
            total_speakers: "80",
            total_contributions: "0.348",
            total_validations: "0.175",
          },
        ],
      });
      fetchMock.reset();
    });
  });

  test("should give details for all language if server responds ok", () => {
    fetchMock.get(`/aggregate-data-count?byLanguage=${true}`, {
      data: [{ language: "Hindi", count: 5 }],
    });
    performAPIRequest(`/aggregate-data-count?byLanguage=${true}`).then(
      (data) => {
        expect(data).toEqual({ data: [{ language: "Hindi", count: 5 }] });
        fetchMock.reset();
      }
    );
  });

  test("should give list for top-5 languages based on no. of contributions if server responds ok", () => {
    const response = [
      { language: "Hindi", contributions: 5 },
      { language: "Odia", contributions: 4 },
    ];
    fetchMock.get("/top-languages-by-hours", response);
    performAPIRequest("/top-languages-by-hours").then((data) => {
      expect(data).toEqual(response);
      fetchMock.reset();
    });
  });
});

describe("updateHrsForSayAndListen", () => {
  test("should updade 0 hrs in both say and listen component when there is empty aggregateDataCountByLanguage", (done) => {
    const $say_p_3 = document.getElementById("say-p-3");
    const $listen_p_3 = document.getElementById("listen-p-3");
    mockLocalStorage();
    localStorage.setItem("aggregateDataCountByLanguage", JSON.stringify([]));
    fetchMock.get(`/aggregate-data-count?byLanguage=${true}`, { data: [] });
    updateHrsForSayAndListen("Hindi");
    flushPromises().then(() => {
      expect($say_p_3.innerHTML).toEqual("0 hr recorded in Hindi");
      expect($listen_p_3.innerHTML).toEqual("0 hr validated in Hindi");
      fetchMock.reset();
      localStorage.clear();
      done();
    });
  });
});

describe("getDefaultTargettedDiv", () => {
  test("should give div having same value in $sayListenLanguage", () => {
    const $sayListenLanguage = $("#say-listen-language");
    const actualDiv = $sayListenLanguage.children()[2];
    const expectedDiv = getDefaultTargettedDiv(
      "value",
      "English",
      $sayListenLanguage
    );
    expect(expectedDiv).toEqual(actualDiv);
  });

  test("should give div having same id in $sayListenLanguage", () => {
    const $sayListenLanguage = $("#say-listen-language");
    const actualDiv = $sayListenLanguage.children()[1];
    const expectedDiv = getDefaultTargettedDiv("id", "bn", $sayListenLanguage);
    expect(expectedDiv).toEqual(actualDiv);
  });

  test("should give 0th div when given id or value not found in $sayListenLanguage", () => {
    const $sayListenLanguage = $("#say-listen-language");
    const actualDiv = $sayListenLanguage.children()[0];
    const expectedDiv = getDefaultTargettedDiv("id", "cd", $sayListenLanguage);
    expect(expectedDiv).toEqual(actualDiv);
  });
});
