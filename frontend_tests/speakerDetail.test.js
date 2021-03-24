const fetchMock = require('fetch-mock')
const {
    testUserName,
    validateUserName,
    setSpeakerDetails,
    resetSpeakerDetails,
    setUserNameTooltip,
    setStartRecordBtnToolTipContent,
    // setTNCOnChange,setStartRecordBtnToolTipContentsetStartRecordBtnToolTipContent
    setGenderRadioButtonOnClick,
    setStartRecordingBtnOnClick
} = require('../assets/js/speakerDetails');
const {readFileSync} = require('fs');
const {stringToHTML, flushPromises,mockLocation, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/modals/speakerDetail.ejs`, 'UTF-8')
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
        // const $tncCheckbox = $('#tnc');
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
        const age = document.getElementById('age');
        const motherTongue = document.getElementById('mother-tongue');
        const $userName = $('#username');
        localStorage.setItem('speakerDetails', JSON.stringify({
            age: "0-5",
            motherTongue: "Hindi",
            userName: "abcdeUsername"
        }));
        setSpeakerDetails("speakerDetails", age, motherTongue, $userName);
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
            age: "0-5",
            motherTongue: "Hindi",
            userName: "abcdeUsername",
            gender:"male"
        }));
        setSpeakerDetails("speakerDetails", age, motherTongue, $userName);
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
        const age = document.getElementById('age');
        const motherTongue = document.getElementById('mother-tongue');
        const gender = document.querySelectorAll(
            'input[name = "gender"]'
        );
        age.selectedIndex = 1;
        motherTongue.selectedIndex = 1;
        gender[0].checked = true;
        $username.val('testName')
        resetSpeakerDetails();
        const selectedGender = document.querySelector(
            'input[name = "gender"]:checked'
        );
        expect($username.val()).toBe('')
        expect(age.selectedIndex).toBe(0)
        expect(motherTongue.selectedIndex).toBe(0)
        expect(selectedGender).toBeNull()
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

describe('setStartRecordBtnToolTipContent', () => {
    test('should set username error msg when username is an phone no.', () => {
        const $startRecordBtn = $('#proceed-box');
        const $startRecordBtnTooltip = $startRecordBtn.parent();
        jest.spyOn($startRecordBtn,'parent');
        jest.spyOn($startRecordBtnTooltip,'attr');

        setStartRecordBtnToolTipContent("8787878788", $startRecordBtnTooltip);
        expect($startRecordBtnTooltip.attr).toHaveBeenCalledTimes(1);
        expect($startRecordBtnTooltip.attr).toHaveBeenCalledWith('data-original-title','Please validate any error message before proceeding');
        jest.clearAllMocks();
    })

    test('should set username error msg when username is an emailId', () => {
        const $startRecordBtn = $('#proceed-box');
        const $startRecordBtnTooltip = $startRecordBtn.parent();
        jest.spyOn($startRecordBtnTooltip,'attr');

        setStartRecordBtnToolTipContent("abc@gmail.com", $startRecordBtnTooltip);
        expect($startRecordBtnTooltip.attr).toHaveBeenCalledTimes(1);
        expect($startRecordBtnTooltip.attr).toHaveBeenCalledWith('data-original-title','Please validate any error message before proceeding');
        jest.clearAllMocks();
    })

});

describe('setGenderRadioButtonOnClick', () => {
    test('should mark the clicked radio button as checked', () => {
        const genderRadios = document.querySelectorAll('input[name = "gender"]');
        const selectedRadio = genderRadios[0];
        selectedRadio.previous = false;
        setGenderRadioButtonOnClick();
        selectedRadio.click();

        expect(selectedRadio.checked).toEqual(true);
        expect(selectedRadio.previous).toEqual(true);
        selectedRadio.previous = false;
        selectedRadio.checked = false;

    })

});

describe('setStartRecordingBtnOnClick', () => {
    test('should setSpeakerDetails in local Storage and land on /record page', () => {
        mockLocation();
        mockLocalStorage();
        localStorage.setItem('contributionLanguage',"Hindi");
        const $startRecordBtn = $('#proceed-box');
        // const $tncCheckbox = $('#tnc');

        // $tncCheckbox.prop('checked', true);
        setStartRecordingBtnOnClick();
        $startRecordBtn.click();

        const expectedDetails = localStorage.getItem('speakerDetails');
        expect(expectedDetails).toEqual(JSON.stringify({gender:"",age:"",motherTongue:"",userName:"",language:"Hindi"}));
        expect(location.href).toEqual("./record.html");
        localStorage.clear();
    })
});