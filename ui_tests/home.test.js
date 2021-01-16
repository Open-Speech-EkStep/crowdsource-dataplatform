const {
  testUserName,
  updateLanguageInButton,
  calculateTime,
} = require('../assets/js/home');

describe('updateLanguageInButton', () => {
  test('should update innerText of start record btn for given language', () => {
    document.body.innerHTML = '<div><button id="start-record" /></div>';
    updateLanguageInButton('hindi');
    expect(document.getElementById('start-record').innerText).toEqual(
      'START RECORDING IN HINDI'
    );
  });
});

describe('calculateTime', () => {
  test('should calculate time in hours,min and sec for given sentence count', () => {
    expect(calculateTime(27)).toEqual({hours: 0, minutes: 2, seconds: 42});
  });
});

describe('testUserName', () => {
  test('should give true for given mobile number of 10-digits start from 6-9', () => {
    expect(testUserName('9818181818')).toEqual(true);
  });

  test('should give false for given mobile number of less than 10-digits', () => {
    expect(testUserName('981818181')).toEqual(false);
  });

  test('should give false for given mobile number of more than 10-digits', () => {
    expect(testUserName('98181818188')).toEqual(false);
  });

  test('should give false for given mobile number of than 10-digits not start from 6-9', () => {
    expect(testUserName('58181818188')).toEqual(false);
  });

  test('should give true for given emailId start with string followed by @<String>.<String>', () => {
    expect(testUserName('abc@gmail.com')).toEqual(true);
  });

  test('should give true for given emailId with string followed by @<String>.<digits>', () => {
    expect(testUserName('abc@gmail.123')).toEqual(true);
  });

  test('should give false for given emailId not having "@"', () => {
    expect(testUserName('abcgmail.com')).toEqual(false);
  });

  test('should give false for given emailId not having "."', () => {
    expect(testUserName('abc@gmailcom')).toEqual(false);
  });
});
