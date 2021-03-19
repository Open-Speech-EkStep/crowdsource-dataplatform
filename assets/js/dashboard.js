const { updateGraph } = require('./draw-chart');
const { testUserName, setStartRecordBtnToolTipContent, setSpeakerDetails, setUserNameOnInputFocus, setGenderRadioButtonOnClick, setUserModalOnShown } = require('./speakerDetails');
const { toggleFooterPosition, updateLocaleLanguagesDropdown, calculateTime, getLocaleString } = require('./utils');

const {DEFAULT_CON_LANGUAGE,ALL_LANGUAGES} = require('./constants');

const LOCALE_STRINGS = 'localeString';
let timer;
let languageToRecord = '';

const fetchDetail = (language) => {
    const byLanguage = language ? true : false;
    const url = language ? '/aggregate-data-count?byLanguage=true' : '/aggregate-data-count'
    return fetch(url).then((data) => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
};

const getSpeakersData = (data, lang) => {
    localStorage.setItem('previousLanguage', lang);
    const speakersData = {
        languages: 0,
        speakers: 0,
        contributions: 0,
        validations: 0
    }
    if (!lang) {
        speakersData.languages = parseInt(data[0].total_languages);
        speakersData.speakers = parseInt(data[0].total_speakers);
        speakersData.contributions = parseFloat(data[0].total_contributions);
        speakersData.validations = parseFloat(data[0].total_validations);
    } else {
        const langSpeakersData = data.filter(item => item.language.toLowerCase() === lang.toLowerCase());
        speakersData.speakers = parseInt(langSpeakersData[0].total_speakers);
        speakersData.contributions = parseFloat(langSpeakersData[0].total_contributions);
        speakersData.validations = parseFloat(langSpeakersData[0].total_validations);
    }
    return speakersData;
}

function isLanguageAvailable(data, lang) {
    let langaugeExists = false;
    if (!lang) return true;
    data.forEach(item => {
        if (item.language.toLowerCase() === lang.toLowerCase()) {
            langaugeExists = true;
        }
    });
    return langaugeExists;
}

function updateLanguage(language) {
    const $speakersData = $('#speaker-data');
    const $speakersDataLoader = $speakersData.find('#loader1');
    const $speakerDataDetails = $speakersData.find('#contribution-details');
    const $speakerContributionData = $speakersData.find('.contribution-data');
    const $speakerDataLanguagesWrapper = $('#languages-wrapper');
    const $speakerDataLanguagesValue = $('#languages-value');
    const $speakersDataSpeakerValue = $('#speaker-value');
    const $speakersDataContributionValue = $('#contributed-value');
    const $speakersDataValidationValue = $('#validated-value');
    const activeDurationText = $('#duration').find('.active')[0].dataset.value;

    fetchDetail(language)
        .then((data) => {
            try {
                const langaugeExists = isLanguageAvailable(data.data, language);
                if (data.last_updated_at) {
                    $('#data-updated').text(` ${data.last_updated_at}`);
                    $('#data-updated').removeClass('d-none');
                } else {
                    $('#data-updated').addClass('d-none');
                }
                if (langaugeExists) {
                    $speakersDataLoader.removeClass('d-none');
                    $speakerDataLanguagesWrapper.addClass('d-none');
                    $speakerDataDetails.addClass('d-none');
                    updateGraph(language, activeDurationText);
                    const speakersData = getSpeakersData(data.data, language);
                    const {
                        hours: contributedHours,
                        minutes: contributedMinutes,
                        seconds: contributedSeconds
                    } = calculateTime(speakersData.contributions.toFixed(3)*60*60);
                    const {
                        hours: validatedHours,
                        minutes: validatedMinutes,
                        seconds: validatedSeconds
                    } = calculateTime(speakersData.validations.toFixed(3)*60*60);

                    if (speakersData.languages) {
                        $speakerDataLanguagesValue.text(speakersData.languages);
                        $speakerDataLanguagesWrapper.removeClass('d-none');
                        $speakerContributionData.removeClass('col-12 col-md-4 col-lg-4 col-xl-4')
                        $speakerContributionData.addClass('col-12 col-md-3 col-lg-3 col-xl-3');
                    } else {
                        $speakerDataLanguagesWrapper.addClass('d-none');
                        $speakerContributionData.removeClass('col-12 col-md-3 col-lg-3 col-xl-3');
                        $speakerContributionData.addClass('col-12 col-md-4 col-lg-4 col-xl-4')
                    }

                    $speakersDataContributionValue.text(`${contributedHours}h ${contributedMinutes}m ${contributedSeconds}s`);
                    $speakersDataValidationValue.text(`${validatedHours}h ${validatedMinutes}m ${validatedSeconds}s`);
                    $speakersDataSpeakerValue.text(speakersData.speakers);

                    $speakersDataLoader.addClass('d-none');
                    $speakerDataDetails.removeClass('d-none');
                } else {
                    const previousLanguage = localStorage.getItem('previousLanguage');
                    languageToRecord = language;
                    $("#language").val(previousLanguage);
                    $("#languageSelected").text(` ${language}, `);
                    $("#no-data-found").removeClass('d-none');
                    timer = setTimeout(() => {
                        $('#no-data-found').addClass('d-none');
                    }, 5000);
                }
            } catch (error) {
                console.log(error);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

$(document).ready(function () {
    localStorage.removeItem('previousLanguage');
    const speakerDetailsKey = 'speakerDetails';
    if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    // const $tncCheckbox = $('#tnc');
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;
    const genderRadios = document.querySelectorAll('input[name = "gender"]');
    const $userName = $('#username');
    const motherTongue = document.getElementById('mother-tongue');
    const age = document.getElementById('age');
    updateLanguage('');
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    if(contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }
    $('#language').on('change', (e) => {
        const selectedLanguage = e.target.value;
        $('#no-data-found').addClass('d-none');
        updateLanguage(selectedLanguage);
    });

    $('#duration').on('click', (e) => {
        const $durationLiInactive = $('#duration').find('li.inactive');
        const $durationLiActive = $('#duration').find('li.active');
        $durationLiInactive.removeClass('inactive').addClass('active');
        $durationLiActive.removeClass('active').addClass('inactive');

        const selectedDuration = e.target.dataset.value;
        const selectedLanguage = $('#language option:selected').val();
        updateGraph(selectedLanguage, selectedDuration, true);
    });

    $("#no-data-found").on('mouseenter touchstart', (e) => {
        clearTimeout(timer);
    });

    $("#no-data-found").on('mouseleave touchend', (e) => {
        timer = setTimeout(() => {
            $('#no-data-found').addClass('d-none');
        }, 5000);
    });

    $("#contribute-now").on('click', (e) => {
        document.cookie = `i18n=en`;
        sentenceLanguage = languageToRecord;
    });

    setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
    setGenderRadioButtonOnClick();
    setStartRecordBtnToolTipContent($userName.val().trim(), $startRecordBtnTooltip);
    setUserNameOnInputFocus();
    setUserModalOnShown($userName);

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

    $('input[name = "gender"]').on('change', function() {
        const selectedGender = document.querySelector(
            'input[name = "gender"]:checked'
        );
        const options = $("#transgender_options");
        if(selectedGender.value === "others") {
            console.log(options);
            options.removeClass("d-none");
        } else {
            console.log(options);
            options.addClass("d-none");
        }
    });

    toggleFooterPosition();

});