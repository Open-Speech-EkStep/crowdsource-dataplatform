const { updateGraph } = require('./draw-chart');

function calculateTime(contributions) {
    const totalSeconds = contributions * 3600;
    console.log(totalSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const remainingAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingAfterHours / 60);
    const seconds = parseInt(remainingAfterHours % 60);
    return {hours, minutes, seconds};
}

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
    $speakersDataLoader.removeClass('d-none');
    $speakerDataLanguagesWrapper.addClass('d-none');
    $speakerDataDetails.addClass('d-none');

    fetchDetail(language)
        .then((data) => {
            try {
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
            } catch (error) {
                console.log(error);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

$(document).ready(function () {
    updateGraph('', 'monthly');
    updateLanguage('');

    $('#language').on('change', (e) => {
        const selectedLanguage = e.target.value;
        updateLanguage(selectedLanguage);
        updateGraph(selectedLanguage, 'monthly');
    });

});