const { updateLineGraph } = require('../common/lineGraph');
const { generateIndiaMap } = require('../common/map');
const {
    setStartRecordingBtnOnClick,
    // setSpeakerDetails,
    setUserNameOnInputFocus,
    setUserModalOnShown,
    setGenderRadioButtonOnClick
} = require('../common/speakerDetails');
const {
    // toggleFooterPosition,
    getLocaleString
} = require('../common/utils');
const { hasUserRegistered, updateLikhoLocaleLanguagesDropdown } = require('../common/common');
const { DEFAULT_CON_LANGUAGE, ALL_LANGUAGES, CURRENT_MODULE, MODULE, SPEAKER_DETAILS_KEY, CONTRIBUTION_LANGUAGE,
    LIKHO_TO_LANGUAGE } = require('../common/constants');
const fetch = require('../common/fetch');

const { setSpeakerData } = require('../common/contributionStats');
const { initializeFeedbackModal } = require('../common/feedback')

const { onChangeUser, showUserProfile, onOpenUserDropDown } = require('../common/header');
const { getJson } = require('../common/utils');
const moment = require('moment');

const LOCALE_STRINGS = 'localeString';
let timer;
let languageToRecord = '';

const fetchDetail = (language) => {
    const url = language ? '/aggregate-data-count/parallel?byLanguage=true' : '/aggregate-data-count/parallel'
    return fetch(url).then((data) => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
};

function isLanguageAvailable(data, lang) {
    let langaugeExists = false;
    if (!lang) return true;
    data.forEach(item => {
        if (item.language) {
            if (item.language.toLowerCase() === lang.toLowerCase()) {
                langaugeExists = true;
            }
        }
    });
    return langaugeExists;
}

const addToLanguage = function (id, list) {
    const localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    let defaultText = 'All Languages';
    if (localeStrings) {
        defaultText = localeStrings['All Languages'];
    }

    const selectBar = document.getElementById(id);
    let options = '';
    options = options.concat(`<option value="">${defaultText}</option>`);
    list.forEach(lang => {
        options = options.concat(`<option value=${lang.value}>${lang.text}</option>`);
    });
    selectBar.innerHTML = options;
}

function handleLanguagePairDisableBehavior() {
    const $fromDashLanguage = $('#from-dash-language');
    const $toDashLanguage = $('#to-dash-language')

    if ($fromDashLanguage.val() === '') {
        $toDashLanguage.attr('disabled', true);
    } else {
        $toDashLanguage.removeAttr('disabled');
    }
}

function updateLanguage(language) {
    const $speakersData = $('#speaker-data');
    const $speakerDataDetails = $speakersData.find('#contribution-details');
    const $speakerDataLanguagesWrapper = $('#languages-wrapper');
    const activeDurationText = $('#duration').find('.active')[0].dataset.value;
    getJson("/aggregated-json/lastUpdatedAtQuery.json")
        .then(res => {
            const lastUpdatedAt = moment(res[0]['timezone']).format('DD-MM-YYYY, h:mm:ss a')
            if (lastUpdatedAt) {
                $('#data-updated').text(` ${lastUpdatedAt}`);
                $('#data-updated').removeClass('d-none');
            } else {
                $('#data-updated').addClass('d-none');
            }
        });
    getJson('/aggregated-json/participationStats.json')
        .then((participationData) => {
            const url = language ? '/aggregated-json/cumulativeDataByLanguage.json' : '/aggregated-json/cumulativeCount.json'
            getJson(url)
                .then((data) => {
                    try {
                        participationData = participationData.find(d => d.type == MODULE.likho["api-type"]);
                        const lData = data.filter(d => d.type == MODULE.likho["api-type"]) || [];
                        if (language == "") {
                            lData[0].total_speakers = participationData.count || 0;
                        }
                        const langaugeExists = isLanguageAvailable(lData, language);

                        if (langaugeExists) {
                            $speakerDataLanguagesWrapper.addClass('d-none');
                            $speakerDataDetails.addClass('d-none');
                            generateIndiaMap(language, MODULE.likho);
                            updateLineGraph(language, activeDurationText, MODULE.likho, "Translations done", "Translations validated");
                            setSpeakerData(lData, language, 'likho');
                            $speakerDataDetails.removeClass('d-none');
                        } else {
                            const previousLanguage = localStorage.getItem('previousLanguage');
                            languageToRecord = language;
                            $("#from-dash-language").val(previousLanguage.split('-')[0]);
                            $("#to-dash-language").val(previousLanguage.split('-')[1]);
                            $("#languageSelected").text(` ${language}, `);
                            $("#no-data-found").removeClass('d-none');
                            timer = setTimeout(() => {
                                $('#no-data-found').addClass('d-none');
                            }, 5000);
                        }

                        handleLanguagePairDisableBehavior();
                    } catch (error) { console.log(error) }
                })
                .catch((err) => { console.log(err) });
        });
}


const executeOnLoad = function () {
    localStorage.setItem(CURRENT_MODULE, MODULE.likho.value);
    initializeFeedbackModal();
    localStorage.removeItem('previousLanguage');
    // const speakerDetailsKey = 'speakerDetails';
    if (!localStorage.getItem(LOCALE_STRINGS)) getLocaleString();
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    // eslint-disable-next-line no-unused-vars
    let sentenceLanguage = DEFAULT_CON_LANGUAGE;
    // const age = document.getElementById('age');
    // const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    updateLanguage('');
    const contributionLanguage = localStorage.getItem(CONTRIBUTION_LANGUAGE);
    const contributionLanguage2 = localStorage.getItem(LIKHO_TO_LANGUAGE);
    if (contributionLanguage) {
        updateLikhoLocaleLanguagesDropdown(contributionLanguage, contributionLanguage2);
    }

    function checkAndReturnLanguage(fromLanguage, toLanguage) {
        if (!fromLanguage || fromLanguage === "") {
            return "";
        }
        if (!toLanguage || toLanguage === "") {
            return "";
        }
        return fromLanguage + "-" + toLanguage;
    }

    $('#duration').on('click', (e) => {
        const $durationLiInactive = $('#duration').find('li.inactive');
        const $durationLiActive = $('#duration').find('li.active');
        $durationLiInactive.removeClass('inactive').addClass('active');
        $durationLiActive.removeClass('active').addClass('inactive');
        const selectedDuration = e.target.dataset.value;
        const fromLanguage = $('#from-dash-language option:selected').val() || "";
        const toLanguage = $('#to-dash-language option:selected').val() || "";
        const selectedLanguage = checkAndReturnLanguage(fromLanguage, toLanguage);
        updateLineGraph(selectedLanguage, selectedDuration, MODULE.likho, "Translations done", "Translations validated");
    });

    $("#no-data-found").on('mouseenter', () => {
        clearTimeout(timer);
    });
    $("#no-data-found").on('mouseleave', () => {
        timer = setTimeout(() => {
            $('#no-data-found').addClass('d-none');
        }, 5000);
    });

    const noDataFoundEl = document.getElementById('no-data-found');
    noDataFoundEl.addEventListener('touchstart', function () {
        clearTimeout(timer);
    }, { passive: true });
    noDataFoundEl.addEventListener('touchend', function () {
        timer = setTimeout(() => {
            $('#no-data-found').addClass('d-none');
        }, 5000);
    }, { passive: true });

    addToLanguage('to-dash-language', ALL_LANGUAGES);

    let fromLanguage = $('#from-dash-language option:first-child').val();
    let toLanguage = $('#to-dash-language option:first-child').val();

    $('#from-dash-language').on('change', (e) => {
        fromLanguage = e.target.value === "" ? "" : e.target.value;
        const languages = ALL_LANGUAGES.filter(item => item.value != fromLanguage);
        addToLanguage('to-dash-language', languages);
        $('#to-language option:first-child').attr("selected", "selected");
        toLanguage = $('#to-language option:first-child').val();
        if (toLanguage == "" && fromLanguage == "") {
            updateLanguage("");
        }

        handleLanguagePairDisableBehavior();
    });

    $('#to-dash-language').on('change', (e) => {
        toLanguage = e.target.value === "" ? "" : e.target.value;
        if (toLanguage == "" && fromLanguage == "") {
            updateLanguage("");
        }
        else {
            updateLanguage(fromLanguage + '-' + toLanguage);
        }
    });

    $("#contribute-now").on('click', () => {
        sessionStorage.setItem("i18n", "en");
        sentenceLanguage = languageToRecord;
        localStorage.setItem(CONTRIBUTION_LANGUAGE, fromLanguage);
        localStorage.setItem(LIKHO_TO_LANGUAGE, toLanguage);
        localStorage.setItem("selectedType", "contribute");
        if (!hasUserRegistered()) {
            $('#userModal').modal('show');
            setStartRecordingBtnOnClick('./record.html', MODULE.likho.value);
        } else {
            location.href = './record.html';
        }
    });

    setUserModalOnShown($userName);
    // setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);
    setGenderRadioButtonOnClick();
    setUserNameOnInputFocus();
    $startRecordBtnTooltip.tooltip('disable');
    if (hasUserRegistered()) {
        const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
        const localSpeakerDataParsed = JSON.parse(speakerDetails);
        showUserProfile(localSpeakerDataParsed.userName);
    }
    onChangeUser('./dashboard.html', MODULE.likho.value);
    onOpenUserDropDown();

    // toggleFooterPosition();

};

$(document).ready(() => {
    getLocaleString().then(() => {
        executeOnLoad();
    }).catch(() => {
        executeOnLoad();
    });
})



module.exports = { fetchDetail, isLanguageAvailable, updateLanguage }
