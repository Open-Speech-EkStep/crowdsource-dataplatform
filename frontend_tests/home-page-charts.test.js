const fetchMock = require('fetch-mock')
const {
    calculateTime,
    getStatistics,
    formatTime
} = require('../assets/js/home-page-charts');
const { readFileSync } = require("fs");
const { stringToHTML, flushPromises } = require("./utils");

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/home.ejs`, "UTF-8")
);

describe('getStatistics', () => {
    test('should get speakers count and num of hours recorded on home page', (done) => {
        fetchMock.get('/aggregate-data-count', {
            "data": [{
                "total_languages": "2",
                "total_speakers": "80",
                "total_contributions": "0.348",
                "total_validations": "0.175"
            }]
        }, {overwriteRoutes: true});

        const speakerValue = document.getElementById('speaker-value');
        const languagesValue = document.getElementById('languages-value');

        getStatistics();
        flushPromises().then(() => {
            expect(speakerValue.innerHTML).toEqual('80');
            expect(languagesValue.innerHTML).toEqual('2');
            fetchMock.reset();
            done();
        });
    });
});

describe("calculateTime", () => {
    test("should calculate time in hours,min and sec for given sentence count", () => {
      expect(calculateTime(162)).toEqual({ hours: 0, minutes: 2, seconds: 42 });
    });
  
    test("should calculate time in hours and min for given sentence count", () => {
      expect(calculateTime(162, false)).toEqual({ hours: 0, minutes: 2 });
    });
  });
  
  describe("formatTime", () => {
    test("should formats hrs only for given hrs", () => {
      expect(formatTime(162)).toEqual("162 hrs");
    });
  
    test("should format hrs and min for given hrs and min", () => {
      expect(formatTime(162, 12)).toEqual("162 hrs 12 min");
    });
  
    test("should format hrs, min & sec for given hrs, min & sec", () => {
      expect(formatTime(162, 12, 8)).toEqual("162 hrs 12 min 8 sec");
    });
  });
