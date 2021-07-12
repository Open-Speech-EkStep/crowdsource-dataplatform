const fetchMock = require('fetch-mock')
const { getStatistics } = require('../src/assets/js/home-page-charts');
const { readFileSync } = require("fs");
const { stringToHTML, flushPromises , mockLocalStorage} = require("./utils");

document.body = stringToHTML(
  readFileSync(`${__dirname}/../src/views/home.ejs`, "UTF-8")+
readFileSync(`${__dirname}/../build/views/common/contributionStats.ejs`, "UTF-8")
);

describe('getStatistics', () => {
  test('should get speakers count and num of hours recorded on home page', (done) => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
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
      localStorage.clear()
      done();
    });
  });
});
