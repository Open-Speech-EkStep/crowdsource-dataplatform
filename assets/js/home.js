const {updateGraph, buildGraphs} = require('./draw-chart');
const {toggleFooterPosition} = require('./utils')
const {
    validateUserName,
    testUserName,
    setSpeakerDetails,
    resetSpeakerDetails,
    setUserNameTooltip,
    setStartRecordBtnToolTipContent
} = require('./speakerDetails');

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


const fetchHrsDetail = (language) => {
    return fetch(`/aggregate-data-count?byLanguage=${true}`).then((data) => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
};

function updateHrsForSayAndListen(language) {
    const $sayLoader = $('#say-loader');
    const $listenLoader = $('#listen-loader');
    $sayLoader.removeClass('d-none');
    $listenLoader.removeClass('d-none');
    const stringifyData = localStorage.getItem('aggregateDataCountByLanguage');
    const aggregateDetails = JSON.parse(stringifyData);
    const totalInfo = aggregateDetails.find((element) => element.language === language);
    const $say_p_3 = $("#say-p-3");
    const $listen_p_3 = $("#listen-p-3");
    if (totalInfo) {
        const {total_contributions, total_validations} = totalInfo;
        total_contributions && $say_p_3.text(`${total_contributions} hrs are recorded in ${language}`);
        total_validations && $listen_p_3.text(`${total_validations} hrs are validated in ${language}`);
    } else {
        $say_p_3.text(`0 hr is recorded in ${language}`);
        $listen_p_3.text(`0 hr is validated in ${language}`);
    }
    $sayLoader.addClass('d-none');
    $listenLoader.addClass('d-none');
}

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

const setAggregateDataCountByLanguage = function () {
    fetchHrsDetail()
        .then((details) => {
            localStorage.setItem('aggregateDataCountByLanguage', JSON.stringify(details.data));
        })
        .catch((err) => {
            console.log(err);
        });
}

const getDefaultTargettedDiv = function (defaultLangId, $sayListenLanguage) {
    let targetIndex = 0;
    $sayListenLanguage.children().each(function (index, element) {
        if (element.getAttribute('id') === defaultLangId) {
            targetIndex = index;
        }
    });

    return $sayListenLanguage.children()[targetIndex];
}

const setLangNavBar = (targetedDiv,top_lang, $languageNavBar) => {
    const allDivs = $languageNavBar.children();
    let targetttedDivIndex = -1
    allDivs.each(function (index, element) {
        if (element.getAttribute('value') === top_lang) {
            targetttedDivIndex = index;
        }
    });

    const previousActiveDiv = $languageNavBar.find('.active');
    previousActiveDiv.removeClass('active');
    const $6th_place = document.getElementById('6th_option');
    if (targetttedDivIndex < 0) {
        $6th_place.innerText = top_lang;
        $6th_place.classList.remove('d-none');
        $6th_place.classList.add('active');

        $6th_place.setAttribute('value', top_lang);
    } else {
        allDivs[targetttedDivIndex].classList.add('active');
        $6th_place.classList.add('d-none');
    }
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

    let top_lang;

    const $languageNavBar = $('#language-nav-bar');
    const $sayListenLanguage = $('#say-listen-language')
    const $homePage = document.getElementById('home-page');
    const defaultLangId = $homePage.getAttribute('default-lang');
    const targettedDiv = getDefaultTargettedDiv(defaultLangId, $sayListenLanguage);
    top_lang = targettedDiv.getAttribute("value");
    setLangNavBar(targettedDiv, top_lang, $languageNavBar);
    updateHrsForSayAndListen(top_lang);

    $sayListenLanguage.on('click',(e)=>{
        let targetedDiv = e.target;
        top_lang = targetedDiv.getAttribute("value");
        setLangNavBar(targetedDiv, top_lang, $languageNavBar);
        updateHrsForSayAndListen(top_lang);
    })

    $languageNavBar.on('click', (e) => {
        const targetedDiv = e.target;
        top_lang = targetedDiv.getAttribute('value');
        const previousActiveDiv = $languageNavBar.find('.active');
        previousActiveDiv.removeClass('active');
        const $6th_place = $('#6th_option')
        $6th_place.addClass('d-none');
        targetedDiv.classList.add('active');
        updateHrsForSayAndListen(top_lang);
    })

    $('#start_recording').on('click', () => {
        if (top_lang === "Hindi" || top_lang === "Odia") {
            sentenceLanguage = top_lang;
        } else {
            sentenceLanguage = "Hindi";
        }
    });

    setAggregateDataCountByLanguage();

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

    setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);

    genderRadios.forEach((element) => {
        element.addEventListener('click', (e) => {
            if (e.target.previous) {
                e.target.checked = false;
            }
            e.target.previous = e.target.checked;
        });
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

    $say.hover(() => {
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $say.addClass('col-lg-6');
        $listen.addClass('col-lg-4');
        $say_p_2.removeClass('d-none');
    }, () => {
        $say.removeClass('col-lg-6');
        $listen.removeClass('col-lg-4');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $say_p_2.addClass('d-none');
    })

    $listen.hover(() => {
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $listen.addClass('col-lg-6');
        $say.addClass('col-lg-4');
        $listen_p_2.removeClass('d-none');
    }, () => {
        $say.removeClass('col-lg-4');
        $listen.removeClass('col-lg-6');
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
