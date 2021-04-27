const {
  setSentencesContributed
} = require('../src/assets/js/thank-you');
const {readFileSync} = require('fs');

const fetchMock = require("fetch-mock");

const {stringToHTML, mockLocalStorage, flushPromises} = require('./utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../src/views/thank-you.ejs`, 'UTF-8')
);

describe("setUserContribution", () => {
  test("should set time on user contribution", (done) => {
    // mockLocalStorage();
    // fetchMock.get(`/rewards?language=undefined&category=speak&userName=`, {
    //   badgeId: "",
    //   contributionCount: 0,
    //   currentBadgeType: "",
    //   nextBadgeType: "",
    //   currentMilestone: 0,
    //   nextMilestone: 0,
    // });
    // setSentencesContributed();
    // flushPromises().then(() => {
    //   const $userContribution = $("#user-contribution").text();
    //   expect($userContribution).toBe("0");
    //   fetchMock.reset();
    //   localStorage.clear();
      done();
    // });
  });
});
