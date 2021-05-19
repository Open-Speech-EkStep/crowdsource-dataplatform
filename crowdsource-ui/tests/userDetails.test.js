const fetchMock = require('fetch-mock')
const {
  testUserName,
  validateUserName,
  setSpeakerDetails,
  resetSpeakerDetails,
  setUserNameTooltip,
  setStartRecordingBtnOnClick
} = require('../build/js/common/userDetails');
const {readFileSync} = require('fs');
const {stringToHTML, flushPromises,mockLocation, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/common/userDetails.ejs`, 'UTF-8')
);

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

describe('validateUserName', () => {
  test('should show username when username is valid', () => {
    const $userName = $('#username');
    $userName.val = () => "abc@gmail.com";
    const $userNameError = $userName.next();
    validateUserName($userName, $userNameError);

    expect($userName.hasClass('is-invalid')).toEqual(true);
    expect($userNameError.hasClass('d-none')).toEqual(false);
  });

  test('should show error when username is not valid', () => {
    const $userName = $('#username');
    const $userNameError = $userName.next();
    //const $tncCheckbox = $('#tnc');
    validateUserName($userName, $userNameError);

    expect($userName.hasClass('is-invalid')).toEqual(false);
    expect($userNameError.hasClass('d-none')).toEqual(true);
  });
});

describe('setSpeakerDetails', () => {
  test("should set Speakers details on homePage when speakerDetailsValue is present in localStorage", (done) => {
    const $userName = $('#username');
    localStorage.setItem('speakerDetails', JSON.stringify({
      userName: "abcdeUsername"
    }));
    setSpeakerDetails("speakerDetails", $userName);
    flushPromises().then(() => {
      expect($userName.val()).toEqual("abcdeUsernam"); //trimmed username 0-12 chars only
      fetchMock.reset();
      done();
    });
  });

  test("should set Speakers details on homePage when speakerDetailsValue with gender is present in localStorage", (done) => {
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    localStorage.setItem('speakerDetails', JSON.stringify({
      userName: "abcdeUsername",
    }));
    setSpeakerDetails("speakerDetails", $userName);
    flushPromises().then(() => {
      expect($userName.val()).toEqual("abcdeUsernam"); //trimmed username 0-12 chars only
      fetchMock.reset();
      done();
    });
  });
});


describe('resetSpeakerDetails', () => {
  test('should reset all details from popup', () => {
    const $username = $('#username');
    $username.val('testName')
    resetSpeakerDetails();

    expect($username.val()).toBe('')
  })
});

describe("setUserNameTooltip",()=>{
  test("should enable username tooltip when username is more than 11 characters",()=>{
    const $userName = $('#username');
    $userName.val = function (){
      return {length:12};
    };
    $userName.tooltip = (e)=>{};
    jest.spyOn($userName,'tooltip');
    setUserNameTooltip($userName);
    expect($userName.tooltip).toHaveBeenCalledTimes(2);
    expect($userName.tooltip).toHaveBeenCalledWith('enable');
    expect($userName.tooltip).toHaveBeenCalledWith('show');

  })

  test("should disable username tooltip when username is less than 11 characters",()=>{
    const $userName = $('#username');
    $userName.val = function (){
      return {length:10};
    };
    $userName.tooltip = (e)=>{};
    jest.spyOn($userName,'tooltip');
    setUserNameTooltip($userName);
    expect($userName.tooltip).toHaveBeenCalledTimes(2);
    expect($userName.tooltip).toHaveBeenCalledWith('disable');
    expect($userName.tooltip).toHaveBeenCalledWith('hide');

  })

  test("should disable username tooltip when username is equal to 11 characters",()=>{
    const $userName = $('#username');
    $userName.val = function (){
      return {length:11};
    };
    $userName.tooltip = (e)=>{};
    jest.spyOn($userName,'tooltip');
    setUserNameTooltip($userName);
    expect($userName.tooltip).toHaveBeenCalledTimes(2);
    expect($userName.tooltip).toHaveBeenCalledWith('disable');
    expect($userName.tooltip).toHaveBeenCalledWith('hide');

  })
})

describe('setStartRecordingBtnOnClick', () => {
  test('should setSpeakerDetails in local Storage and land on /record page', () => {
    mockLocation();
    mockLocalStorage();
    localStorage.setItem('contributionLanguage',"Hindi");
    const $startRecordBtn = $('#proceed-box');

    setStartRecordingBtnOnClick("./record.html");
    $startRecordBtn.click();

    const expectedDetails = localStorage.getItem('speakerDetails');
    expect(expectedDetails).toEqual(JSON.stringify({userName:"",language:"Hindi", toLanguage:""}));
    expect(location.href).toEqual("./record.html");
    localStorage.clear();
  })
});