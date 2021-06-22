const {
    setSpeakerDetails,
    setUserModalOnShown,
    setUserNameOnInputFocus,
    setGenderRadioButtonOnClick,
    setStartRecordingBtnOnClick
} = require('../../../build/js/common/speakerDetails');

const {hasUserRegistered} = require('../../../build/js/common/common');

const {DEFAULT_CON_LANGUAGE,MODULE, CURRENT_MODULE, CONTRIBUTION_LANGUAGE} = require('../../../build/js/common/constants');
const {updateLocaleLanguagesDropdown} = require('./utils');

function onActiveNavbar(value) {
    const $header = $('#about-us');
    localStorage.setItem(CURRENT_MODULE, value);
    const allDivs = $header.children();
    let targetedDivIndex = 0;
    allDivs.each(function (index, element) {
        if (element.getAttribute('value') === value) {
            targetedDivIndex = index;
        }
    });
    const previousActiveDiv = $header.find('.active');
    previousActiveDiv && previousActiveDiv.removeClass('active');
    allDivs[targetedDivIndex].classList.add('active');
}


$(document).ready(function () {
    onActiveNavbar("about-us");
    const speakerDetailsKey = 'speakerDetails';
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    if (contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }

    $startRecordBtnTooltip.tooltip({
        container: 'body',
        placement: screen.availWidth > 500 ? 'right' : 'auto',
    });

    setUserModalOnShown($userName);
    $startRecordBtnTooltip.tooltip('disable');
    setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
    setGenderRadioButtonOnClick();
    setUserNameOnInputFocus();

    let langTop;
    $('#languageTop').on('change', (e) => {
        langTop = e.target.value;
        const $toggleButton = $('#start_recording');
        $toggleButton.removeAttr('disabled');
    });

    $('#start_recording').on('click', () => {
        sentenceLanguage = langTop;
        localStorage.setItem("i18n", "en");
        localStorage.setItem(CONTRIBUTION_LANGUAGE, sentenceLanguage);
        localStorage.setItem("selectedType", "contribute");
        if(!hasUserRegistered()){
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('./record.html',MODULE.bolo.value);
        } else {
            location.href ='./record.html';
        }
    });
});