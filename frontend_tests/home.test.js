const fetchMock = require('fetch-mock')
const {
    updateLanguageInButton,
    updateLanguage,
    calculateTime,
    testUserName,
    fetchDetail,
    validateUserName,
    resetSpeakerDetails,
    setUserNameTooltip,
    setStartRecordBtnToolTipContent,
    setSpeakerDetails
} = require('../assets/js/home');
const {readFileSync} = require('fs');
const {stringToHTML, flushPromises} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/home.ejs`, 'UTF-8')
);
describe('updateLanguageInButton', () => {
    test('should update innerText of start record btn for given language', () => {
        updateLanguageInButton('hindi');
        expect(document.getElementById('start-record').innerText).toEqual(
            'START RECORDING IN HINDI'
        );
    });
});

describe('updateLanguage', () => {
    test('should update speakers count and num of hours recorded on home page', (done) => {
        const language = 'Hindi';
        fetchMock.get(`getDetails/${language}`, [
            {count: 7, index: 0},
            {count: 5, index: 1},
        ], {overwriteRoutes: true});

        const speakerValue = document.getElementById('speaker-value');

        updateLanguage(language);
        flushPromises().then(() => {
            expect(speakerValue.innerHTML).toEqual('7');
            fetchMock.reset();
            done();
        });
    });
});

describe('fetchDetails', () => {
    test('should give details for given language if server responds ok', () => {
        const language = 'Hindi';
        fetchMock.get(`getDetails/${language}`, {count: 5});
        fetchDetail(language).then((data) => {
            expect(data).toEqual({count: 5});
            fetchMock.reset();
        });
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


describe('validateUserName', () => {
    test('should show username when username is valid', () => {
        const $userName = $('#username');
        $userName.val = () => "abc@gmail.com";
        const $userNameError = $userName.next();
        const $tncCheckbox = $('#tnc');
        validateUserName($userName, $userNameError, $tncCheckbox);

        expect($userName.hasClass('is-invalid')).toEqual(true);
        expect($userNameError.hasClass('d-none')).toEqual(false);
    });

    test('should show error when username is not valid', () => {
        const $userName = $('#username');
        const $userNameError = $userName.next();
        const $tncCheckbox = $('#tnc');
        validateUserName($userName, $userNameError, $tncCheckbox);

        expect($userName.hasClass('is-invalid')).toEqual(false);
        expect($userNameError.hasClass('d-none')).toEqual(true);
    });
});

describe('Reset Speaker Details', () => {
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


describe('setUserNameTooltip', () => {
    test("should make tooltip enable and add show class when userName's length is more than 11", () => {
        const $userName = $('#username');
        $userName.tooltip = (e) => {
        };
        jest.spyOn($userName, 'val').mockReturnValue("abcdeUserName");
        jest.spyOn($userName, 'tooltip');
        setUserNameTooltip($userName);
        expect($userName.val).toBeCalledTimes(1);
        expect($userName.tooltip).toBeCalledTimes(2);
        expect($userName.tooltip).toBeCalledWith("enable");
        expect($userName.tooltip).toBeCalledWith("show");
        fetchMock.reset();
    });

    test("should make tooltip disable and add hide class when userName's length is less or equal to 11", () => {
        const $userName = $('#username');
        $userName.tooltip = (e) => {
        };
        jest.spyOn($userName, 'val').mockReturnValue("UserName");
        jest.spyOn($userName, 'tooltip');
        setUserNameTooltip($userName);
        expect($userName.val).toBeCalledTimes(1);
        expect($userName.tooltip).toBeCalledTimes(2);
        expect($userName.tooltip).toBeCalledWith("disable");
        expect($userName.tooltip).toBeCalledWith("hide");
        fetchMock.reset();
    });
});

describe('setStartRecordBtnToolTipContent', () => {
    test("should add attributes for agreeing T&C to $startRecordBtnTooltip when userName is valid", () => {
        const $startRecordBtnTooltip = $('#proceed-box').parent();
        jest.spyOn($startRecordBtnTooltip, 'attr');
        setStartRecordBtnToolTipContent("abcdeUserName", $startRecordBtnTooltip);
        expect($startRecordBtnTooltip.attr).toBeCalledTimes(1);
        expect($startRecordBtnTooltip.attr).toBeCalledWith('data-original-title', 'Please agree to the Terms and Conditions before proceeding');
        fetchMock.reset();
    });

    test("should add attributes with error msg to $startRecordBtnTooltip when userName is invalid", () => {
        const $startRecordBtnTooltip = $('#proceed-box').parent();
        jest.spyOn($startRecordBtnTooltip, 'attr');
        setStartRecordBtnToolTipContent("abc@gmail.com", $startRecordBtnTooltip);
        expect($startRecordBtnTooltip.attr).toBeCalledTimes(1);
        expect($startRecordBtnTooltip.attr).toBeCalledWith('data-original-title', 'Please validate any error message before proceeding');
        fetchMock.reset();
    });
})

describe('setSpeakerDetails', () => {
    test("should set Speakers details on homePage when speakerDetailsValue is present in localStorage", (done) => {
        const age = document.getElementById('age');
        const motherTongue = document.getElementById('mother-tongue');
        const $userName = $('#username');
        localStorage.setItem('speakerDetails',JSON.stringify({age:"0-5", motherTongue:"Hindi", userName:"abcdeUsername"}) );
        setSpeakerDetails("speakerDetails", age, motherTongue, $userName);
        flushPromises().then(() => {
            expect($userName.val()).toEqual("abcdeUsernam"); //trimmed username 0-12 chars only
            fetchMock.reset();
            done();
        });
    });

})
