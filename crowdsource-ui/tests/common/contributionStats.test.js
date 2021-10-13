const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('../utils');
const {setSpeakerData, getSpeakersData} = require('../../build/js/common/contributionStats');
const {INITIATIVES} = require('../../build/js/common/constants');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/contributionStats.ejs`, 'UTF-8')
);

describe("getSpeakersData",()=> {
  test("should give 0 value for each key of speaker data when given data is empty list for any module)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const speakerData = getSpeakersData([],"Hindi",INITIATIVES.asr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("Hindi");
    expect(speakerData).toEqual({
      languages: 0,
      speakers: 0,
      contributions: 0,
      validations: 0
    })

    localStorage.clear()

  })

  test("should give 0 value for each key of speaker data when data is not provided for any module)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const speakerData = getSpeakersData(null,"Hindi",INITIATIVES.asr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("Hindi");
    expect(speakerData).toEqual({
      languages: 0,
      speakers: 0,
      contributions: 0,
      validations: 0
    })

    localStorage.clear()

  })



  test("should give Speaker data for #languages,#speakers , #total_contributions & #total_validations in decimals when language is not provided and module is asr initiative)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const speakerData = getSpeakersData([{total_languages:23, total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7}],'',INITIATIVES.asr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("");
    expect(speakerData).toEqual({
      languages: 23,
      speakers: 7,
      contributions: 0.06,
      validations: 9.78
    })

    localStorage.clear()

  })

  test("should give Speaker data for #languages,#speakers , #total_contributions & #total_validations in decimals when language is not provided and module is text initiative)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const speakerData = getSpeakersData([{total_languages:23, total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7}],'',INITIATIVES.text.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("");
    expect(speakerData).toEqual({
      languages: 23,
      speakers: 7,
      contributions: 0.06,
      validations: 9.78
    })

    localStorage.clear()

  })



  test("should give Speaker data for #languages,#speakers , #total_contribution_count & #total_validation_count in decimals when language is not provided and module is parallel)", () => {
    mockLocalStorage()
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}));
    const speakerData = getSpeakersData([{total_languages:23, total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7}],'',INITIATIVES.parallel.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("");
    expect(speakerData).toEqual({
      languages: 23,
      speakers: 7,
      contributions: 9,
      validations: 7
    })

    localStorage.clear()

  })

  test("should give Speaker data for #languages,#speakers , #total_contribution_count & #total_validation_count in decimals when language is not provided and module is ocr initiative)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const speakerData = getSpeakersData([{total_languages:23, total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7}],'',INITIATIVES.ocr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("");
    expect(speakerData).toEqual({
      languages: 23,
      speakers: 7,
      contributions: 9,
      validations: 7
    })

    localStorage.clear()

  })

  test("should give 0 value for each key of speaker data when given language is not present in provided data any module)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const data = [{language:"english", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7},{language:"hindi", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7}]
    const speakerData = getSpeakersData(data,"Tamil",INITIATIVES.asr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("Tamil");
    expect(speakerData).toEqual({
      languages: 0,
      speakers: 0,
      contributions: 0,
      validations: 0
    })

    localStorage.clear()

  })

  test("should give 0 value for each key of speaker data when given data do not have language key when language is provided any module)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const data = [{total_languages:23, total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7}];
    const speakerData = getSpeakersData(data,"Tamil",INITIATIVES.asr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("Tamil");
    expect(speakerData).toEqual({
      languages: 0,
      speakers: 0,
      contributions: 0,
      validations: 0
    })

    localStorage.clear()

  })

  test("should give Speaker data for #languages=0,#speakers , #total_contributions & #total_validations in decimals when language is provided and module is asr initiative)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const data = [{language:"english", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7},{language:"hindi", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7}]
    const speakerData = getSpeakersData(data,'English',INITIATIVES.asr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("English");
    expect(speakerData).toEqual({
      languages: 0,
      speakers: 7,
      contributions: 0.06,
      validations: 9.78
    })

    localStorage.clear()

  })

  test("should give Speaker data for #languages=0,#speakers , #total_contributions & #total_validations in decimals when language is provided and module is text initiative)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const data = [{language:"english", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7},{language:"hindi", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:9, total_validation_count:7}]
    const speakerData = getSpeakersData(data,'English',INITIATIVES.text.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("English");
    expect(speakerData).toEqual({
      languages: 0,
      speakers: 7,
      contributions: 0.06,
      validations: 9.78
    })

    localStorage.clear()

  })

  test("should give Speaker data for #languages=0,#speakers , #total_contribution_count & #total_validation_count in decimals when language is provided and module is ocr initiative)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const data = [{language:"english", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:19, total_validation_count:7},{language:"hindi", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:19, total_validation_count:72}]
    const speakerData = getSpeakersData(data,'Hindi',INITIATIVES.ocr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("Hindi");
    expect(speakerData).toEqual({
      languages: 0,
      speakers: 7,
      contributions: 19,
      validations: 72
    })

    localStorage.clear()

  })

  test("should give Speaker data for #languages=0,#speakers , #total_contribution_count & #total_validation_count in decimals when language is provided and module is parallel)", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
    const data = [{language:"english", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:12, total_validation_count:52},{language:"hindi", total_speakers:7,total_contributions:0.06,total_validations:9.78,total_contribution_count:19, total_validation_count:72}]
    const speakerData = getSpeakersData(data,'English',INITIATIVES.ocr.value);

    const previousLanguage = localStorage.getItem('previousLanguage');

    expect(previousLanguage).toEqual("English");
    expect(speakerData).toEqual({
      languages: 0,
      speakers: 7,
      contributions: 12,
      validations: 52
    })

    localStorage.clear()

  })

})


describe("setSpeakersData",()=> {
  const $speakerDataLanguagesValue = $('#languages-value');
  const $speakersDataSpeakerValue = $('#speaker-value');
  const $speakersDataContributionValue = $('#contributed-value');
  const $speakersDataValidationValue = $('#validated-value');
  const $speakerDataLanguagesWrapper = $('#languages-wrapper');

  test("should set no of contribution, validation and speaker for given data and language for asr initiative", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({'hour(s)':"hour(s)", 'second(s)': "second(s)", 'minute(s)':"minute(s)"}))
    const data = [{language:"Hindi",total_speakers: "80",total_contributions: "1.22",total_validations: "2.65"},{language:"English",total_speakers: "90",total_contributions: "0.8",total_validations: "0.75"}];

    setSpeakerData(data, "Hindi", INITIATIVES.asr.value);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(true);
    expect($speakersDataContributionValue.text()).toEqual(`1 hour(s) 13 minute(s)`);
    expect($speakersDataValidationValue.text()).toEqual(`2 hour(s) 39 minute(s)`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
    localStorage.clear();
  })

  test("should set no of contribution, validation and speaker for given data and no language for asr initiative", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({'hour(s)':"hour(s)", 'second(s)': "second(s)", 'minute(s)':"minute(s)"}))
    const data = [{total_languages:"3",total_speakers: "80",total_contributions: "1.22",total_validations: "2.65"}];

    setSpeakerData(data, '', INITIATIVES.asr.value);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(false);
    expect($speakerDataLanguagesValue.text()).toEqual('3');
    expect($speakersDataContributionValue.text()).toEqual(`1 hour(s) 13 minute(s)`);
    expect($speakersDataValidationValue.text()).toEqual(`2 hour(s) 39 minute(s)`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
    localStorage.clear()
  })

  test("should set no of contribution, validation and speaker for given data and language for text initiative", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({'hour(s)':"hour(s)", 'second(s)': "second(s)", 'minute(s)':"minute(s)"}))
    const data = [{language:"Hindi",total_speakers: "80",total_contributions: "1.22",total_validations: "2.65"},{language:"English",total_speakers: "90",total_contributions: "0.8",total_validations: "0.75"}];

    setSpeakerData(data, "Hindi", INITIATIVES.text.value);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(true);
    expect($speakersDataContributionValue.text()).toEqual(`1 hour(s) 13 minute(s)`);
    expect($speakersDataValidationValue.text()).toEqual(`2 hour(s) 39 minute(s)`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
    localStorage.clear()
  })

  test("should set no of contribution, validation and speaker for given data and no language for text initiative", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({'hour(s)':"hour(s)", 'second(s)': "second(s)", 'minute(s)':"minute(s)"}))
    const data = [{total_languages:"3",total_speakers: "80",total_contributions: "1.22",total_validations: "2.65"}];

    setSpeakerData(data, '', INITIATIVES.text.value);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(false);
    expect($speakerDataLanguagesValue.text()).toEqual('3');
    expect($speakersDataContributionValue.text()).toEqual(`1 hour(s) 13 minute(s)`);
    expect($speakersDataValidationValue.text()).toEqual(`2 hour(s) 39 minute(s)`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
    localStorage.clear()
  })

  test("should set no of contribution, validation and speaker for given data and language for parallel initiative", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({'hour(s)':"hour(s)", 'second(s)': "second(s)", 'minute(s)':"minute(s)"}))
    const data = [{language:"English-Hindi",total_speakers: "80",total_contribution_count: "22",total_validation_count: "65"},{language:"Tamil-English",total_speakers: "90",total_contribution_count: "8",total_validation_count: "75"}];

    setSpeakerData(data, "Tamil-English", INITIATIVES.parallel.value);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(true);
    expect($speakersDataContributionValue.text()).toEqual(`8`);
    expect($speakersDataValidationValue.text()).toEqual(`75`);
    expect($speakersDataSpeakerValue.text()).toEqual(`90`);
    localStorage.clear()
  })

  test("should set no of contribution, validation, languages and speaker for given data and no language for parallel initiative", () => {
    mockLocalStorage();
    localStorage.setItem('localeString', JSON.stringify({'hour(s)':"hour(s)", 'second(s)': "second(s)", 'minute(s)':"minute(s)"}))
    const data = [{total_languages:"6",total_speakers: "80",total_contribution_count: "22",total_validation_count: "65"}];

    setSpeakerData(data, "", INITIATIVES.parallel.value);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(false);
    expect($speakerDataLanguagesValue.text()).toEqual('6');
    expect($speakersDataContributionValue.text()).toEqual(`22`);
    expect($speakersDataValidationValue.text()).toEqual(`65`);
    expect($speakersDataSpeakerValue.text()).toEqual(`80`);
    localStorage.clear()
  })

  test("should set no of contribution, validation and speaker for given data and language for ocr initiative", () => {
    const data = [{language:"English",total_speakers: "80",total_contribution_count: "22",total_validation_count: "65"},{language:"Tamil",total_speakers: "90",total_contribution_count: "8",total_validation_count: "75"}];

    setSpeakerData(data, "Tamil", INITIATIVES.ocr.value);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(true);
    expect($speakersDataContributionValue.text()).toEqual(`8`);
    expect($speakersDataValidationValue.text()).toEqual(`75`);
    expect($speakersDataSpeakerValue.text()).toEqual(`90`);
  })

  test("should set no of contribution, validation, languages and speaker for given data and no language for ocr initiative", () => {
    const data = [{total_languages:"6",total_speakers: "60",total_contribution_count: "22",total_validation_count: "65"}];

    setSpeakerData(data, "", INITIATIVES.ocr.value);

    expect($speakerDataLanguagesWrapper.hasClass('d-none')).toEqual(false);
    expect($speakerDataLanguagesValue.text()).toEqual('6');
    expect($speakersDataContributionValue.text()).toEqual(`22`);
    expect($speakersDataValidationValue.text()).toEqual(`65`);
    expect($speakersDataSpeakerValue.text()).toEqual(`60`);
  })
})


