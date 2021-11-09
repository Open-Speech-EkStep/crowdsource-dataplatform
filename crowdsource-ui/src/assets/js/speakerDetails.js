const { DEFAULT_CON_LANGUAGE, CONTRIBUTION_LANGUAGE, ALL_LANGUAGES, LOCALE_STRINGS,PARALLEL_TO_LANGUAGE,INITIATIVES } = require('./constants');
const { getLocaleString } = require('./utils');
const fetch = require('./fetch')
const {whitelisting_email} = require('./env-api')

function validateUserName($userName, $userNameError) {
    const userNameValue = $userName.val().trim();
    const userHint = $('#user-name-hint');
    if (testUserName(userNameValue)) {
        $userName.addClass('is-invalid');
        $userNameError.removeClass('d-none');
        userHint.addClass('d-none')
    } else {
        $userName.removeClass('is-invalid');
        $userNameError.addClass('d-none');
        userHint.removeClass('d-none');
    }
    // $tncCheckbox.trigger('change');
}

function resetSpeakerDetails() {
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const userName = document.getElementById('username');
    const selectedGender = document.querySelector(
      'input[name = "gender"]:checked'
    );
    const transSelectedGender = document.querySelector(
      'input[name = "trans_gender"]:checked'
    );
    if (selectedGender) selectedGender.checked = false;
    if (transSelectedGender) transSelectedGender.checked = false;
    $("#transgender_options").addClass("d-none");
    age.selectedIndex = 0;
    motherTongue.selectedIndex = 0;
    userName.value = '';
}

const testUserName = (val) => {
    const numeralRegex = /^[0-9]+$/;
    const emailRegex = /^\S+@\S+[\.][0-9a-z]+$/;
    if(whitelisting_email==='true') return false;
    return numeralRegex.test(val) || emailRegex.test(val);
};

function setUserNameTooltip($userName) {
    if ($userName.val().length > 11) {
        $userName.tooltip('enable');
        $userName.tooltip('show');
    } else {
        $userName.tooltip('disable');
        $userName.tooltip('hide');
    }
}

const setStartRecordBtnToolTipContent = (userName, $startRecordBtnTooltip) => {
    const text = 'Please validate any error message before proceeding';
    getLocaleString().then(() => {
        const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
        if (testUserName(userName)) {
            $startRecordBtnTooltip.attr(
              'data-original-title',
              localeString[text]
            );
        }

    });
};

const setSpeakerDetails = (speakerDetailsKey, age, motherTongue, $userName) => {
    const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);
    if (speakerDetailsValue) {
        const parsedSpeakerDetails = JSON.parse(speakerDetailsValue);
        const genderRadio = document.querySelector(
          'input[name = "gender"][value="' + parsedSpeakerDetails.gender + '"]'
        );
        if (['male', 'female'].indexOf(parsedSpeakerDetails.gender) > -1) {
            if (genderRadio) {
                genderRadio.checked = true;
                genderRadio.previous = true;
            }
        } else if (parsedSpeakerDetails.gender !== "" && parsedSpeakerDetails.gender !== undefined) {
            const genderRadio = document.querySelector(
              'input[name = "gender"][value="others"]'
            );
            if (genderRadio) {
                genderRadio.checked = true;
                genderRadio.previous = true;
            }
            const transGenderRadio = document.querySelector(
              'input[name = "trans_gender"][value="' + parsedSpeakerDetails.gender + '"]'
            );
            if (transGenderRadio) {
                $("#transgender_options").removeClass("d-none");
                transGenderRadio.checked = true;
                transGenderRadio.previous = true;

            }
        }
        age.value = parsedSpeakerDetails.age;
        motherTongue.value = parsedSpeakerDetails.motherTongue;
        let userNameTxt = '';
        if(parsedSpeakerDetails.userName){
            userNameTxt = whitelisting_email==='true' ?
              parsedSpeakerDetails.userName.trim() :
              parsedSpeakerDetails.userName.trim().substring(0, 12)
        }
        $userName.val(userNameTxt);
        validateUserName($userName, $userName.next());
    }
};

const setUserModalOnShown = function ($userName) {
    $('#userModal').on('shown.bs.modal', function () {
        // $('#resetBtn').on('click', resetSpeakerDetails);
        $userName.tooltip({
            container: 'body',
            placement: screen.availWidth > 500 ? 'right' : 'auto',
            trigger: 'focus',
        });
        // setUserNameTooltip($userName);
    });
}

    $('#userModal').on('hidden.bs.modal', function () {
        resetSpeakerDetails();
    });

const setUserNameOnInputFocus = function () {
    const $userName = $('#username');
    // const $userNameError = $userName.next();
    const $userNameError = $('#username-error');
    // const $tncCheckbox = $('#tnc');
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    $userName.on('input focus', () => {
        validateUserName($userName, $userNameError);
        // setUserNameTooltip($userName);
        const userNameValue = $userName.val().trim();
        if (!testUserName(userNameValue)) {
            $startRecordBtn.removeAttr('disabled').removeClass('point-none');
            if ($startRecordBtnTooltip) {
                $startRecordBtnTooltip.tooltip('disable');
            }

        } else {
            setStartRecordBtnToolTipContent(userNameValue, $startRecordBtnTooltip);
            $startRecordBtn.prop('disabled', true).addClass('point-none');
            if ($startRecordBtnTooltip) {
                $startRecordBtnTooltip.tooltip('enable');
            }
        }
    });
}

const setGenderRadioButtonOnClick = function () {
    const genderRadios = document.querySelectorAll('input[name = "gender"]');
    const selectedTransGender = document.querySelector(
      'input[name = "trans_gender"]:checked'
    );

    const options = $("#transgender_options");
    genderRadios.forEach((element) => {
        $(element).off('click').on('click', (e) => {
            if (e.target.previous) {
                e.target.checked = false;
            }
            e.target.previous = e.target.checked;
            if (e.target.value == 'others' && e.target.checked) {
                if (!selectedTransGender) {
                    const defaultOption = document.querySelector(
                      'input[name = "trans_gender"][value="Rather Not Say"]'
                    );
                    defaultOption.checked = true;
                    defaultOption.previous = true;
                }
                options.removeClass('d-none');
            } else {
                options.addClass('d-none');
            }

        });
    });
}

const verifyUser = (userName) => {
    return fetch('/verify-user', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            userName: userName,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const storeToLocal = (speakerDetailsKey, speakerDetails, contributionLanguage, url) => {
    localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
    localStorage.setItem(CONTRIBUTION_LANGUAGE, contributionLanguage);
    location.href = url;
}

// device-browser
const setStartRecordingBtnOnClick = function (url, module = '') {
    const speakerDetailsKey = 'speakerDetails';
    const $startRecordBtn = $('#proceed-box');
    //const $tncCheckbox = $('#tnc');
    const genderRadios = document.querySelectorAll('input[name = "gender"]');
    const transGenderRadios = document.querySelectorAll('input[name = "trans_gender"]');
    const $userName = $('#username');
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    $startRecordBtn.on('click', () => {
        const checkedGender = Array.from(genderRadios).filter((el) => el.checked);
        let genderValue = checkedGender.length ? checkedGender[0].value : '';
        if (genderValue === "others") {
            const transGender = Array.from(transGenderRadios).filter((el) => el.checked);
            genderValue = transGender.length ? transGender[0].value : '';
        }
        let userNameValue = $userName.val().trim().substring(0, 12);
        if(whitelisting_email==='true'){
            userNameValue = $userName.val().trim();
        }
        let contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
        let toLanguage = localStorage.getItem(PARALLEL_TO_LANGUAGE);
        const selectedLanguage = ALL_LANGUAGES.find(e => e.value === contributionLanguage);
        if(module != INITIATIVES.parallel.value){
            if (!selectedLanguage.data) contributionLanguage = DEFAULT_CON_LANGUAGE;
        }
        if (testUserName(userNameValue)) {
            return;
        }
        const userLanguage = contributionLanguage;
        const speakerDetails = {
            gender: genderValue,
            age: age.value,
            motherTongue: motherTongue.value,
            userName: userNameValue,
            language: userLanguage,
            toLanguage: toLanguage || '',
        };
        if (whitelisting_email==='true') {
            verifyUser(userNameValue).then(res => {
                if (res.ok) {
                    storeToLocal(speakerDetailsKey, speakerDetails, contributionLanguage, url);
                } else {
                    alert("User not found")
                }
            }).catch(err => {
                console.log(err)
                alert("User not found")
            })
        } else {
            storeToLocal(speakerDetailsKey, speakerDetails, contributionLanguage, url);
        }
    });
}

$(document).ready(function () {
    const userName = document.getElementById("username");
    if (whitelisting_email==='true') {
        if (userName !== null && userName !== undefined) {
            userName.maxLength = 100;
        }
    } else {
        if (userName !== null && userName !== undefined) {
            userName.maxLength = 12;
        }
    }
});

module.exports = {
    testUserName,
    validateUserName,
    setSpeakerDetails,
    resetSpeakerDetails,
    setUserNameTooltip,
    setStartRecordBtnToolTipContent,
    // setTNCOnChange,
    setUserModalOnShown,
    setUserNameOnInputFocus,
    setGenderRadioButtonOnClick,
    setStartRecordingBtnOnClick,
};