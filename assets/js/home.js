const {updateGraph, buildGraphs} = require('./draw-chart');
const {toggleFooterPosition} = require('./utils')
const {validateUserName, testUserName,setSpeakerDetails, resetSpeakerDetails,setUserNameTooltip,setStartRecordBtnToolTipContent} = require('./speakerDetails');

function updateLanguageInButton(lang) {
    document.getElementById(
        'start-record'
    ).innerText = `START RECORDING IN ${lang.toUpperCase()}`;
}

function calculateTime(totalSentence) {
    const totalSeconds = totalSentence * 6;
    const hours = Math.floor(totalSeconds / 3600);
    const remainingAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingAfterHours / 60);
    const seconds = remainingAfterHours % 60;
    return {hours, minutes, seconds};
}

const fetchDetail = (language) => {
    return fetch(`/getDetails/${language}`).then((data) => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
};

function updateLanguage(language) {
    const $speakersData = $('#speaker-data');
    const $speakersDataLoader = $speakersData.find('#loader1,#loader2');
    const $speakersDataSpeakerWrapper = $('#speakers-wrapper');
    const $speakersDataSpeakerValue = $('#speaker-value');
    const $speakersDataHoursWrapper = $('#hours-wrapper');
    const $speakersDataHoursValue = $('#hour-value');
    $speakersDataLoader.removeClass('d-none');
    $speakersDataHoursWrapper.addClass('d-none');
    $speakersDataSpeakerWrapper.addClass('d-none');

    fetchDetail(language)
        .then((data) => {
            try {
                const totalSentence = data.find((t) => t.index === 1).count;
                const {hours, minutes, seconds} = calculateTime(totalSentence);
                $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
                $speakersDataSpeakerValue.text(data.find((t) => t.index === 0).count);

                $speakersDataLoader.addClass('d-none');
                $speakersDataHoursWrapper.removeClass('d-none');
                $speakersDataSpeakerWrapper.removeClass('d-none');
                localStorage.setItem('speakersData', JSON.stringify(data));
            } catch (error) {
                console.log(error);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}



$(document).ready(function () {
    const speakerDetailsKey = 'speakerDetails';
    const defaultLang = 'Odia';
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    const genderRadios = document.querySelectorAll('input[name = "gender"]');
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    const $userNameError = $userName.next();
    const $tncCheckbox = $('#tnc');
    let sentenceLanguage = defaultLang;

    $tncCheckbox.prop('checked', false);

    toggleFooterPosition();

    $startRecordBtnTooltip.tooltip({
        container: 'body',
        placement: screen.availWidth > 500 ? 'right' : 'auto',
    });

    setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);

    genderRadios.forEach((element) => {
        element.addEventListener('click', (e) => {
            if (e.target.previous) {
                e.target.checked = false;
            }
            e.target.previous = e.target.checked;
        });
    });

    $('#start_recording').on('click', () => {
        sentenceLanguage = 'Hindi';
    });

    let languageBottom = defaultLang;
    $('#language').on('change', (e) => {
        languageBottom = e.target.value;
        updateLanguage(languageBottom);
        updateLanguageInButton(languageBottom);
        updateGraph(languageBottom);
    });

    $('#start-record').on('click', () => {
        sentenceLanguage = languageBottom;
    });

    setStartRecordBtnToolTipContent($userName.val().trim(), $startRecordBtnTooltip);
    $tncCheckbox.change(function () {
        const userNameValue = $userName.val().trim();
        if (this.checked && !testUserName(userNameValue)) {
            $startRecordBtn.removeAttr('disabled').removeClass('point-none');
            $startRecordBtnTooltip.tooltip('disable');
        } else {
            setStartRecordBtnToolTipContent(userNameValue, $startRecordBtnTooltip);
            $startRecordBtn.prop('disabled', 'true').addClass('point-none');
            $startRecordBtnTooltip.tooltip('enable');
        }
    });

    $userName.on('input focus', () => {
        validateUserName($userName, $userNameError, $tncCheckbox);
        setUserNameTooltip($userName);
    });

    $startRecordBtn.on('click', () => {
        if ($tncCheckbox.prop('checked')) {
            const checkedGender = Array.from(genderRadios).filter((el) => el.checked);
            const genderValue = checkedGender.length ? checkedGender[0].value : '';
            const userNameValue = $userName.val().trim().substring(0, 12);
            if (testUserName(userNameValue)) {
                return;
            }
            const speakerDetails = {
                gender: genderValue,
                age: age.value,
                motherTongue: motherTongue.value,
                userName: userNameValue,
                language: sentenceLanguage,
            };
            localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
            location.href = '/record';
        }
    });

    $('#userModal').on('shown.bs.modal', function () {
        $('#resetBtn').on('click', resetSpeakerDetails);
        $userName.tooltip({
            container: 'body',
            placement: screen.availWidth > 500 ? 'right' : 'auto',
            trigger: 'focus',
        });
        setUserNameTooltip($userName);
    });
    const $say = $('#say');
    const $listen = $('#listen');
    const $listen_p_2 = $('#listen-p-2');
    const $say_p_2 = $('#say-p-2');

    $say.hover(()=>{
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $say.addClass('col-lg-7');
        $listen.addClass('col-lg-3');
        $say_p_2.removeClass('d-none');
    }, ()=>{
        $say.removeClass('col-lg-7');
        $listen.removeClass('col-lg-3');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $say_p_2.addClass('d-none');
    })

    $listen.hover(()=>{
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $listen.addClass('col-lg-7');
        $say.addClass('col-lg-3');
        $listen_p_2.removeClass('d-none');
    }, ()=>{
        $say.removeClass('col-lg-3');
        $listen.removeClass('col-lg-7');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $listen_p_2.addClass('d-none');
    })

    updateLanguageInButton(defaultLang);
    updateLanguage(defaultLang);
    buildGraphs(defaultLang);
});

module.exports = {
    updateLanguageInButton,
    updateLanguage,
    calculateTime,
    fetchDetail,
};
