const fetchMock = require('fetch-mock')
const {
  testBoloUserName,
  validateBoloUserName,
  setBoloSpeakerDetails,
  resetBoloSpeakerDetails,
  setBoloUserNameTooltip,
  setBoloStartRecordBtnToolTipContent,
  setBoloUserModalOnShown,
  setBoloUserNameOnInputFocus,
  setLetGoBtnOnClick
} = require('../src/assets/js/bolo_user_details');
const {readFileSync} = require('fs');
const {stringToHTML, flushPromises,mockLocation, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/boloIndia/home.ejs`, 'UTF-8')
);

describe('testBoloUserName', () => {
  test('should give true for given mobile number of 10-digits start from 6-9', () => {
    expect(testBoloUserName('9818181818')).toEqual(true);
  });

  test('should give false for given mobile number of less than 10-digits', () => {
    expect(testBoloUserName('981818181')).toEqual(false);
  });

  test('should give false for given mobile number of more than 10-digits', () => {
    expect(testBoloUserName('98181818188')).toEqual(false);
  });

  test('should give false for given mobile number of than 10-digits not start from 6-9', () => {
    expect(testBoloUserName('58181818188')).toEqual(false);
  });

  test('should give true for given emailId start with string followed by @<String>.<String>', () => {
    expect(testBoloUserName('abc@gmail.com')).toEqual(true);
  });

  test('should give true for given emailId with string followed by @<String>.<digits>', () => {
    expect(testBoloUserName('abc@gmail.123')).toEqual(true);
  });

  test('should give false for given emailId not having "@"', () => {
    expect(testBoloUserName('abcgmail.com')).toEqual(false);
  });

  test('should give false for given emailId not having "."', () => {
    expect(testBoloUserName('abc@gmailcom')).toEqual(false);
  });
});

describe('validateBoloUserName', () => {
  test('should show username when username is valid', () => {
    const $userName = $('#bolo-username');
    $userName.val = () => "abc@gmail.com";
    const $userNameError = $userName.next();
    validateBoloUserName($userName, $userNameError);

    expect($userName.hasClass('is-invalid')).toEqual(true);
    expect($userNameError.hasClass('d-none')).toEqual(false);
  });

  test('should show error when username is not valid', () => {
    const $userName = $('#bolo-username');
    const $userNameError = $userName.next();
    //const $tncCheckbox = $('#tnc');
    validateBoloUserName($userName, $userNameError);

    expect($userName.hasClass('is-invalid')).toEqual(false);
    expect($userNameError.hasClass('d-none')).toEqual(true);
  });
});

describe('setBoloSpeakerDetails', () => {
  test("should set Speakers details on homePage when speakerDetailsValue is present in localStorage", (done) => {
    const $userName = $('#bolo-username');
    localStorage.setItem('speakerDetails', JSON.stringify({
      userName: "abcdeUsername"
    }));
    setBoloSpeakerDetails("speakerDetails", $userName);
    flushPromises().then(() => {
      expect($userName.val()).toEqual("abcdeUsernam"); //trimmed username 0-12 chars only
      fetchMock.reset();
      done();
    });
  });

  test("should set Speakers details on homePage when speakerDetailsValue with gender is present in localStorage", (done) => {
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#bolo-username');
    localStorage.setItem('speakerDetails', JSON.stringify({
      userName: "abcdeUsername",
    }));
    setBoloSpeakerDetails("speakerDetails", $userName);
    flushPromises().then(() => {
      expect($userName.val()).toEqual("abcdeUsernam"); //trimmed username 0-12 chars only
      fetchMock.reset();
      done();
    });
  });
});


describe('resetBoloSpeakerDetails', () => {
  test('should reset all details from popup', () => {
    const $username = $('#bolo-username');
    $username.val('testName')
    resetBoloSpeakerDetails();

    expect($username.val()).toBe('')
  })
});

describe("setBoloUserNameTooltip",()=>{
  test("should enable username tooltip when username is more than 11 characters",()=>{
    const $userName = $('#bolo-username');
    $userName.val = function (){
      return {length:12};
    };
    $userName.tooltip = (e)=>{};
    jest.spyOn($userName,'tooltip');
    setBoloUserNameTooltip($userName);
    expect($userName.tooltip).toHaveBeenCalledTimes(2);
    expect($userName.tooltip).toHaveBeenCalledWith('enable');
    expect($userName.tooltip).toHaveBeenCalledWith('show');

  })

  test("should disable username tooltip when username is less than 11 characters",()=>{
    const $userName = $('#bolo-username');
    $userName.val = function (){
      return {length:10};
    };
    $userName.tooltip = (e)=>{};
    jest.spyOn($userName,'tooltip');
    setBoloUserNameTooltip($userName);
    expect($userName.tooltip).toHaveBeenCalledTimes(2);
    expect($userName.tooltip).toHaveBeenCalledWith('disable');
    expect($userName.tooltip).toHaveBeenCalledWith('hide');

  })

  test("should disable username tooltip when username is equal to 11 characters",()=>{
    const $userName = $('#bolo-username');
    $userName.val = function (){
      return {length:11};
    };
    $userName.tooltip = (e)=>{};
    jest.spyOn($userName,'tooltip');
    setBoloUserNameTooltip($userName);
    expect($userName.tooltip).toHaveBeenCalledTimes(2);
    expect($userName.tooltip).toHaveBeenCalledWith('disable');
    expect($userName.tooltip).toHaveBeenCalledWith('hide');

  })
})

describe('setLetGoBtnOnClick', () => {
  test('should setSpeakerDetails in local Storage and land on /record page', () => {
    mockLocation();
    mockLocalStorage();
    localStorage.setItem('contributionLanguage',"Hindi");
    const $startRecordBtn = $('#bolo-proceed-box');

    setLetGoBtnOnClick("./record.html");
    $startRecordBtn.click();

    const expectedDetails = localStorage.getItem('speakerDetails');
    expect(expectedDetails).toEqual(JSON.stringify({userName:"",language:"Hindi", toLanguage:""}));
    expect(location.href).toEqual("./record.html");
    localStorage.clear();
  })
});