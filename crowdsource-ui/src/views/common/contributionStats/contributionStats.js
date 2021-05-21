const {calculateTime} = require('./utils')

const getSpeakersData = (data, lang, moduleType) => {
  localStorage.setItem('previousLanguage', lang);
  const speakersData = {
    languages: 0,
    speakers: 0,
    contributions: 0,
    validations: 0
  }
  if(data && data.length) {
    if (!lang) {
      speakersData.languages = parseInt(data[0].total_languages);
      speakersData.speakers = parseInt(data[0].total_speakers);
      speakersData.contributions = moduleType === "likho" || moduleType === "dekho" ? parseFloat(data[0].total_contribution_count) : parseFloat(data[0].total_contributions);
      speakersData.validations = moduleType === "likho" || moduleType === "dekho" ? parseFloat(data[0].total_validation_count) : parseFloat(data[0].total_validations);
    } else {
      const langSpeakersData = data.filter(item => {
        if (item.language) {
          return item.language.toLowerCase() === lang.toLowerCase();
        }
        return false;
      });
      speakersData.speakers = parseInt(langSpeakersData[0].total_speakers);
      speakersData.contributions = moduleType === "likho" || moduleType === "dekho" ? parseFloat(langSpeakersData[0].total_contribution_count) : parseFloat(langSpeakersData[0].total_contributions);
      speakersData.validations = moduleType === "likho" || moduleType === "dekho" ? parseFloat(langSpeakersData[0].total_validation_count) : parseFloat(langSpeakersData[0].total_validations);
    }
  }
  return speakersData;
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

    $speakersDataContributionValue.text(`${contributedHours}h ${contributedMinutes}m ${contributedSeconds}s`);
    $speakersDataValidationValue.text(`${validatedHours}h ${validatedMinutes}m ${validatedSeconds}s`);
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

module.exports = {setSpeakerData}