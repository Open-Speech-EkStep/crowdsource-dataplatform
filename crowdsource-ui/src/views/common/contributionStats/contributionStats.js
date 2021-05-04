const {calculateTime} = require('./utils')

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
    const langSpeakersData = data.filter(item => {
      if (item.language) {
        return item.language.toLowerCase() === lang.toLowerCase();
      }
      return false;
    });
    speakersData.speakers = parseInt(langSpeakersData[0].total_speakers);
    speakersData.contributions = parseFloat(langSpeakersData[0].total_contributions);
    speakersData.validations = parseFloat(langSpeakersData[0].total_validations);
  }
  return speakersData;
}

const setSpeakerData = function (data, language){
  const speakersData = getSpeakersData(data, language);
  const $speakerDataLanguagesValue = $('#languages-value');
  const $speakersDataSpeakerValue = $('#speaker-value');
  const $speakersDataContributionValue = $('#contributed-value');
  const $speakersDataValidationValue = $('#validated-value');
  const $speakerDataLanguagesWrapper = $('#languages-wrapper');
  const $speakersData = $('#speaker-data');
  const $speakerContributionData = $speakersData.find('.contribution-data');
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
 
    $speakerDataLanguagesValue.text(speakersData.languages);
    $speakerContributionData.removeClass('col-12 col-md-3 col-lg-3 col-xs-6');
    $speakerContributionData.addClass('col-12 col-md-3 col-lg-3 col-xs-6')
  $speakersDataContributionValue.text(`${contributedHours}h ${contributedMinutes}m ${contributedSeconds}s`);
  $speakersDataValidationValue.text(`${validatedHours}h ${validatedMinutes}m ${validatedSeconds}s`);
  $speakersDataSpeakerValue.text(speakersData.speakers);
}

module.exports = {setSpeakerData}