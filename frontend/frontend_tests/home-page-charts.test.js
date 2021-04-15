const fetchMock = require('fetch-mock')
const { getStatistics } = require('../assets/js/home-page-charts');
const { readFileSync } = require("fs");
const { stringToHTML, flushPromises } = require("./utils");

document.body = stringToHTML(
  readFileSync(`${__dirname}/../views/home.ejs`, "UTF-8")
);

describe('getStatistics', () => {
  test('should get speakers count and num of hours recorded on home page', (done) => {
    const speakerValue = document.getElementById('speaker-value');
    const languagesValue = document.getElementById('languages-value');

    getStatistics({
      "total_languages": "2",
      "total_speakers": "80",
      "total_contributions": "0.348",
      "total_validations": "0.175"
    });
    flushPromises().then(() => {
      expect(speakerValue.innerHTML).toEqual('80');
      expect(languagesValue.innerHTML).toEqual('2');
      fetchMock.reset();
      done();
    });
  });
});
