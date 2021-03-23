const {
    testUserName,
    setSpeakerDetails,
    setStartRecordBtnToolTipContent,
    //setTNCOnChange,
    setUserModalOnShown,
    setUserNameOnInputFocus,
    setGenderRadioButtonOnClick,
    setStartRecordingBtnOnClick
} = require('./speakerDetails');
const {DEFAULT_CON_LANGUAGE,ALL_LANGUAGES} = require('./constants');
const {updateLocaleLanguagesDropdown} = require('./utils');

$(document).ready(function () {
    const speakerDetailsKey = 'speakerDetails';
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    const genderRadios = document.querySelectorAll('input[name = "gender"]');
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    //const $tncCheckbox = $('#tnc');
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;

    const contributionLanguage = localStorage.getItem('contributionLanguage');
    if (contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }

    $('input[name = "gender"]').on('change', function() {
        const selectedGender = document.querySelector(
            'input[name = "gender"]:checked'
        );
        const options = $("#transgender_options");
        if(selectedGender.value === "others") {
            options.removeClass("d-none");
        } else {
            options.addClass("d-none");
        }
    });

  //  $tncCheckbox.prop('checked', false);

    $startRecordBtnTooltip.tooltip({
        container: 'body',
        placement: screen.availWidth > 500 ? 'right' : 'auto',
    });


    setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
    setGenderRadioButtonOnClick();

    let langTop;
    $('#languageTop').on('change', (e) => {
        langTop = e.target.value;
        const $toggleButton = $('#start_recording');
        $toggleButton.removeAttr('disabled');
    });

    $('#start_recording').on('click', () => {
        sentenceLanguage = langTop;
        document.cookie = `i18n=en`;
    });

    setStartRecordBtnToolTipContent($userName.val().trim(), $startRecordBtnTooltip);
    //setTNCOnChange($userName, $startRecordBtnTooltip);
    setUserNameOnInputFocus();

    $startRecordBtn.on('click', () => {
        const checkedGender = Array.from(genderRadios).filter((el) => el.checked);
        let genderValue = checkedGender.length ? checkedGender[0].value : '';
        const userNameValue = $userName.val().trim().substring(0, 12);
        const selectedLanguage = ALL_LANGUAGES.find(e=>e.value === sentenceLanguage);
        if (! selectedLanguage.data) sentenceLanguage = DEFAULT_CON_LANGUAGE;
        if (testUserName(userNameValue)) {
            return;
        }
        const transGenderRadios = document.querySelectorAll('input[name = "trans_gender"]');
        if (genderValue === "others") {
            const transGender = Array.from(transGenderRadios).filter((el) => el.checked);
            genderValue = transGender.length ? transGender[0].value : '';
        }

        const speakerDetails = {
            gender: genderValue,
            age: age.value,
            motherTongue: motherTongue.value,
            userName: userNameValue,
            language: sentenceLanguage || localStorage.getItem('contributionLanguage'),
        };
        localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
        localStorage.setItem("contributionLanguage", sentenceLanguage);
        // document.cookie = `i18n=en`;
        location.href = '/record';
    });

    setUserModalOnShown($userName);
});