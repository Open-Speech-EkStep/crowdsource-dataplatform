const {
  setUserContribution,
    getTotalSentencesContributed
} = require('../assets/js/thank-you');
const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../views/thank-you.ejs`, 'UTF-8')
);

describe('setUserContribution', () => {
  test('should set time on user contribution', () => {
    setUserContribution(10);
    const $userContribution = $('#user-contribution').text();
    expect($userContribution).toBe('10');
  });
});

describe('getTotalSentencesContributed', () => {
  test('should give no of total sentences contributed when current index is 0', () => {
    mockLocalStorage();
    localStorage.setItem('count', 5);
    localStorage.setItem('skipCount', 2);
    localStorage.setItem('currentIndex', 0);
    expect(getTotalSentencesContributed()).toBe(3);
    localStorage.clear();
  });

  test('should give no of total sentences contributed when current index is more than 0', () => {
    mockLocalStorage();
    localStorage.setItem('count', 5);
    localStorage.setItem('skipCount', 2);
    localStorage.setItem('currentIndex', 3);
    expect(getTotalSentencesContributed()).toBe(6);
    localStorage.clear();
  });
});
