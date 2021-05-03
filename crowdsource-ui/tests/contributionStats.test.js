const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');
const {setSpeakerData} = require('../build/js/common/contributionStats.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/common/contributionStats.ejs`, 'UTF-8')
);

describe("setSpeakersData",()=> {
  const $speakerDataLanguagesValue = $('#languages-value');
  const $speakersDataSpeakerValue = $('#speaker-value');
  const $speakersDataContributionValue = $('#contributed-value');
  const $speakersDataValidationValue = $('#validated-value');
  const $speakerDataLanguagesWrapper = $('#languages-wrapper');

  test("should set no of contribution, validation and speaker for given data and language", () => {
    const data = [{language:"Hindi",total_speakers: "80",total_contributions: "1.22",total_validations: "2.65"},{language:"English",total_speakers: "90",total_contributions: "0.8",total_validations: "0.75"}];

    setSpeakerData(data, "Hindi");

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(true);
    expect($speakersDataContributionValue.text()).toEqual(`1h 13m 12s`);
    expect($speakersDataValidationValue.text()).toEqual(`2h 39m 0s`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
  })

  test("should set no of contribution, validation, languages and speaker for given data only", () => {
    const data = [{total_languages:"2",total_speakers:"5",total_contributions: "1.22",total_validations: "2.65"}];

    setSpeakerData(data);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(false);
    expect($speakerDataLanguagesValue.text()).toEqual('2');
    expect($speakersDataContributionValue.text()).toEqual(`1h 13m 12s`);
    expect($speakersDataValidationValue.text()).toEqual(`2h 39m 0s`);
    expect($speakersDataSpeakerValue.text()).toEqual(`5`);
  })
})
