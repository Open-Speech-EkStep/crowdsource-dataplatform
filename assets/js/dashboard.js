const { updateGraph, calculateTime } = require('./draw-chart');
const { testUserName, setStartRecordBtnToolTipContent } = require('./speakerDetails');
const { toggleFooterPosition } = require('./utils');

let timer;
let languageToRecord = '';

const fetchDetail = (language) => {
    const byLanguage = language ? true : false;
    return fetch(`/aggregate-data-count?byLanguage=${byLanguage}`).then((data) => {
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
        data.forEach(item => {
            speakersData.languages++;
            speakersData.speakers += parseInt(item.total_speakers);
            speakersData.contributions += parseFloat(item.total_contributions);
            speakersData.validations += parseFloat(item.total_validations);
        });
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
                    } = calculateTime(speakersData.contributions.toFixed(3));
                    const {
                        hours: validatedHours,
                        minutes: validatedMinutes,
                        seconds: validatedSeconds
                    } = calculateTime(speakersData.validations.toFixed(3));

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
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    const $tncCheckbox = $('#tnc');
    const genderRadios = document.querySelectorAll('input[name = "gender"]');
    const $userName = $('#username');
    const motherTongue = document.getElementById('mother-tongue');
    const age = document.getElementById('age');
    updateLanguage('');

    $('#language').on('change', (e) => {
        const selectedLanguage = e.target.value;
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
        localStorage.setItem('contributionLanguage', languageToRecord);
    });

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

    $startRecordBtn.on('click', () => {
        if ($tncCheckbox.prop('checked')) {
            const checkedGender = Array.from(genderRadios).filter((el) => el.checked);
            const genderValue = checkedGender.length ? checkedGender[0].value : '';
            const userNameValue = $userName.val().trim().substring(0, 12);
            if (languageToRecord === 'English') languageToRecord = 'Odia';
            if (testUserName(userNameValue)) {
                return;
            }
            const speakerDetails = {
                gender: genderValue,
                age: age.value,
                motherTongue: motherTongue.value,
                userName: userNameValue,
                language: languageToRecord,
            };
            localStorage.setItem('speakerDetails', JSON.stringify(speakerDetails));
            location.href = '/record';
        }
    });

    toggleFooterPosition();

});