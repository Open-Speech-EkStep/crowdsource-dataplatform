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

  test("should set no of contribution, validation and speaker for given data and language for sunoIndia", () => {
    const data = [{language:"Hindi",total_speakers: "80",total_contributions: "1.22",total_validations: "2.65"},{language:"English",total_speakers: "90",total_contributions: "0.8",total_validations: "0.75"}];

    setSpeakerData(data, "Hindi", "suno");

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(true);
    expect($speakersDataContributionValue.text()).toEqual(`1h 13m 12s`);
    expect($speakersDataValidationValue.text()).toEqual(`2h 39m 0s`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
  })

  test("should set no of contribution, validation and speaker for given data and no language for sunoIndia", () => {
    const data = [{total_languages:"3",total_speakers: "80",total_contributions: "1.22",total_validations: "2.65"}];

    setSpeakerData(data, '', "suno");

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(false);
    expect($speakerDataLanguagesValue.text()).toEqual('3');
    expect($speakersDataContributionValue.text()).toEqual(`1h 13m 12s`);
    expect($speakersDataValidationValue.text()).toEqual(`2h 39m 0s`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
  })

  test("should set no of contribution, validation and speaker for given data and language for likhoIndia", () => {
    const data = [{language:"English-Hindi",total_speakers: "80",total_contribution_count: "22",total_validation_count: "65"},{language:"Tamil-English",total_speakers: "90",total_contribution_count: "8",total_validation_count: "75"}];

    setSpeakerData(data, "Tamil-English", "likho");

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(true);
    expect($speakersDataContributionValue.text()).toEqual(`8`);
    expect($speakersDataValidationValue.text()).toEqual(`75`);
    expect($speakersDataSpeakerValue.text()).toEqual(`90`);
  })

  test("should set no of contribution, validation, languages and speaker for given data and no language for likhoIndia", () => {
    const data = [{total_languages:"6",total_speakers: "80",total_contribution_count: "22",total_validation_count: "65"}];

    setSpeakerData(data, "", "likho");

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(false);
    expect($speakerDataLanguagesValue.text()).toEqual('6');
    expect($speakersDataContributionValue.text()).toEqual(`22`);
    expect($speakersDataValidationValue.text()).toEqual(`65`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
  })

  test("should set no of contribution, validation and speaker for given data and language for dekhoIndia", () => {
    const data = [{language:"English",total_speakers: "80",total_contribution_count: "22",total_validation_count: "65"},{language:"Tamil",total_speakers: "90",total_contribution_count: "8",total_validation_count: "75"}];

    setSpeakerData(data, "Tamil", "dekho");

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(true);
    expect($speakersDataContributionValue.text()).toEqual(`8`);
    expect($speakersDataValidationValue.text()).toEqual(`75`);
    expect($speakersDataSpeakerValue.text()).toEqual(`90`);
  })

  test("should set no of contribution, validation, languages and speaker for given data and no language for dekhoIndia", () => {
    const data = [{total_languages:"6",total_speakers: "60",total_contribution_count: "22",total_validation_count: "65"}];

    setSpeakerData(data, "", "dekho");

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(false);
    expect($speakerDataLanguagesValue.text()).toEqual('6');
    expect($speakersDataContributionValue.text()).toEqual(`22`);
    expect($speakersDataValidationValue.text()).toEqual(`65`);
    expect($speakersDataSpeakerValue.text()).toEqual(`60`);
  })
})
