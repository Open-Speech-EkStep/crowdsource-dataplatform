localStorage.setItem('currentIndex', 3);
const {
  setUserContribution,
  getTotalSecondsContributed,
} = require('../assets/js/thank-you');
const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../views/thank-you.ejs`, 'UTF-8')
);

describe('Set User Contribution', () => {
  test('should set time on user contribution', () => {
    mockLocalStorage();
    localStorage.setItem("localeString", JSON.stringify({'seconds': 'seconds'}));
    setUserContribution(10);
    const $userContribution = $('#user-contribution').text();
    expect($userContribution).toBe('10 seconds ');
    localStorage.clear();
  });
});

describe('Get total seconds contributed', () => {
  test('test', () => {
    mockLocalStorage();
    localStorage.setItem('count', 5);
    localStorage.setItem('skipCount', 2);
    expect(getTotalSecondsContributed()).toBe(36);
  });
});
