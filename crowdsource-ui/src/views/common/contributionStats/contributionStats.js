const { calculateTime, formatTime } = require('./utils')

const getSpeakersData = (data, lang, moduleType) => {
  localStorage.setItem('previousLanguage', lang);
  const speakersData = {
    languages: 0,
    speakers: 0,
    contributions: 0,
    validations: 0
  }
  if (data && data.length) {
    if (!lang) {
      speakersData.languages = parseInt(data[0].total_languages) || 0;
      speakersData.speakers = parseInt(data[0].total_speakers) || 0;
      speakersData.contributions = moduleType === "likho" || moduleType === "dekho" ? parseFloat(data[0].total_contribution_count ? data[0].total_contribution_count : '0') : parseFloat(data[0].total_contributions ? data[0].total_contributions : '0');
      speakersData.validations = moduleType === "likho" || moduleType === "dekho" ? parseFloat(data[0].total_validation_count ? data[0].total_validation_count : '0') : parseFloat(data[0].total_validations ? data[0].total_validations : '0');
    } else {
      const langSpeakersData = data.filter(item => {
        if (item.language) {
          return item.language.toLowerCase() === lang.toLowerCase();
        }
        return false;
      });

      if (langSpeakersData.length == 0) {
        return speakersData;
      }
      speakersData.speakers = parseInt(langSpeakersData[0].total_speakers);
      speakersData.contributions = moduleType === "likho" || moduleType === "dekho" ? parseFloat(langSpeakersData[0].total_contribution_count) : parseFloat(langSpeakersData[0].total_contributions);
      speakersData.validations = moduleType === "likho" || moduleType === "dekho" ? parseFloat(langSpeakersData[0].total_validation_count) : parseFloat(langSpeakersData[0].total_validations);
    }
  }
  return speakersData;
}

const setParticipationData = (data) => {
  const $sunoIndiaParticipation = $('#languages-value');
  const $boloIndiaParticipation = $('#speaker-value');
  const $likhoIndiaParticipation = $('#contributed-value');
  const $dekhoIndiaParticipation = $('#validated-value');
  const $participationData = $('#participation-data');
  const $contributionData = $participationData.find('.contribution-data');
  $boloIndiaParticipation.text(data.bolo_india_participation);
  $likhoIndiaParticipation.text(data.likho_india_participation);
  $sunoIndiaParticipation.text(data.suno_india_participation);
  $dekhoIndiaParticipation.text(data.dekho_india_participation);
  $contributionData.addClass('col-12 col-md-3 col-lg-3 col-xs-6 col-xl-3')
}

const getCountOrZero = (obj) => {
  return obj && obj.count ? obj.count : 0;
}

const setParticipationDataFromJson = (data) => {
  const bData = data.find(d => d.type == 'text');
  const sData = data.find(d => d.type == 'asr');
  const lData = data.find(d => d.type == 'parallel');
  const dData = data.find(d => d.type == 'ocr');
  const $sunoIndiaParticipation = $('#languages-value');
  const $boloIndiaParticipation = $('#speaker-value');
  const $likhoIndiaParticipation = $('#contributed-value');
  const $dekhoIndiaParticipation = $('#validated-value');
  const $participationData = $('#participation-data');
  const $contributionData = $participationData.find('.contribution-data');
  $boloIndiaParticipation.text(getCountOrZero(bData));
  $likhoIndiaParticipation.text(getCountOrZero(lData));
  $sunoIndiaParticipation.text(getCountOrZero(sData));
  $dekhoIndiaParticipation.text(getCountOrZero(dData));
  $contributionData.addClass('col-12 col-md-3 col-lg-3 col-xs-6 col-xl-3')
}

const setSpeakerData = function (data, language, moduleType) {
  const speakersData = getSpeakersData(data, language, moduleType);
  const $speakerDataLanguagesValue = $('#languages-value');
  const $speakersDataSpeakerValue = $('#speaker-value');
  const $speakersDataContributionValue = $('#contributed-value');
  const $speakersDataValidationValue = $('#validated-value');
  const $speakerDataLanguagesWrapper = $('#languages-wrapper');
  const $speakersData = $('#speaker-data');
  const $speakerContributionData = $speakersData.find('.contribution-data');
  if (moduleType !== "likho" && moduleType !== "dekho") {
    const {
      hours: contributedHours,
      minutes: contributedMinutes,
      seconds: contributedSeconds
    } = calculateTime(speakersData.contributions.toFixed(3) * 60 * 60);
    const {
      hours: validatedHours,
      minutes: validatedMinutes,
      seconds: validatedSeconds
    } = calculateTime(speakersData.validations.toFixed(3) * 60 * 60);

    $speakersDataContributionValue.text(formatTime(contributedHours, contributedMinutes, contributedSeconds));
    $speakersDataValidationValue.text(formatTime(validatedHours, validatedMinutes, validatedSeconds));
  } else {
    $speakersDataContributionValue.text(speakersData.contributions);
    $speakersDataValidationValue.text(speakersData.validations);
  }

  $speakersDataSpeakerValue.text(speakersData.speakers);

  if (language) {
    $speakerDataLanguagesWrapper.addClass('d-none');
    $speakerContributionData.addClass('col-12 col-md-4 col-lg-4 col-xl-4 col-xs-6')
    $speakerContributionData.removeClass('col-12 col-md-3 col-lg-3 col-xs-6 col-xl-3')
  } else {
    $speakerDataLanguagesValue.text(speakersData.languages);
    $speakerDataLanguagesWrapper.removeClass('d-none');
    $speakerContributionData.removeClass('col-12 col-md-4 col-lg-4 col-xl-4 col-xs-6')
    $speakerContributionData.addClass('col-12 col-md-3 col-lg-3 col-xs-6 col-xl-3')
  }
}

module.exports = { setSpeakerData, getSpeakersData, setParticipationData, setParticipationDataFromJson }
