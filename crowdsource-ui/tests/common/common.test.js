const {readFileSync} = require('fs');
jest.mock('node-fetch');
const fetchMock = require("fetch-mock");
const {stringToHTML, mockLocalStorage} = require('../utils');
const {CONTRIBUTION_LANGUAGE,SPEAKER_DETAILS_KEY, CURRENT_MODULE,TOP_LANGUAGES_BY_HOURS, AGGREGATED_DATA_BY_TOP_LANGUAGE} = require('../../build/js/common/constants');
const {showFucntionalCards, hasUserRegistered, setBadge,updateGoalProgressBar} = require('../../build/js/common/common.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/cards.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../build/views/common/languageNavBar.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../build/views/common/thankyouPageParticipationMsg.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../build/views/common/thankyouPageHeading.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../build/views/common/thankyouPageProgressBar.ejs`, 'UTF-8')
);

describe("setBadge", ()=>{
  test("should show card without badge when user skip all sentences for contribution flow when language is in top", ()=>{
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'hindi');
    localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify([{language:"Hindi"},{language:"English"}]));
    const data = {isNewBadge : false, contributionCount : 0,nextBadgeType: "Bronze", currentBadgeType:""};
    const localeStrings = {Bronze:"Bronze"};
    setBadge(data, localeStrings, 'contribute');

    expect($("#languageInTopWeb").hasClass("d-none")).toEqual(false);
    expect($("#languageInTopMob").hasClass("d-none")).toEqual(false);
    expect($("#languageNotInTopMob").hasClass("d-none")).toEqual(true);
    expect($("#languageNotInTopWeb").hasClass("d-none")).toEqual(true);
    expect($(".new-badge-msg").hasClass("d-none")).toEqual(true);
    expect($(".thankyou-page-heading").hasClass("d-none")).toEqual(false);
    expect($(".user-contribution-msg").hasClass("d-none")).toEqual(true);
    localStorage.clear();

  })

  test("should show card without badge when user skip all sentences for contribution flow when language is not in top", ()=>{
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
    localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify([{language:"Hindi"},{language:"English"}]));
    const data = {isNewBadge : false, contributionCount : 0,nextBadgeType: "Bronze", currentBadgeType:""};
    const localeStrings = {Bronze:"Bronze"};
    setBadge(data, localeStrings, 'contribute');

    expect($("#languageInTopWeb").hasClass("d-none")).toEqual(true);
    expect($("#languageInTopMob").hasClass("d-none")).toEqual(true);
    expect($("#languageNotInTopMob").hasClass("d-none")).toEqual(false);
    expect($("#languageNotInTopWeb").hasClass("d-none")).toEqual(false);
    expect($(".new-badge-msg").hasClass("d-none")).toEqual(true);
    expect($(".thankyou-page-heading").hasClass("d-none")).toEqual(false);
    expect($(".user-contribution-msg").hasClass("d-none")).toEqual(true);
    localStorage.clear();

  })

  test("should show card without badge when user contribute very few sentences when language is not in top", ()=>{
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
    localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify([{language:"Hindi"},{language:"English"}]));
    const data = {isNewBadge : false, contributionCount : 2,nextBadgeType: "Bronze", currentBadgeType:""};
    const localeStrings = {Bronze:"Bronze"};
    setBadge(data, localeStrings, 'contribute');

    expect($("#languageInTopWeb").hasClass("d-none")).toEqual(true);
    expect($("#languageInTopMob").hasClass("d-none")).toEqual(true);
    expect($("#languageNotInTopMob").hasClass("d-none")).toEqual(false);
    expect($("#languageNotInTopWeb").hasClass("d-none")).toEqual(false);
    expect($(".new-badge-msg").hasClass("d-none")).toEqual(true);
    expect($(".thankyou-page-heading").hasClass("d-none")).toEqual(true);
    expect($(".user-contribution-msg").hasClass("d-none")).toEqual(false);
    localStorage.clear();
  })

  test("should show card with badge when user achieved a badge for the language that is not in top", ()=>{
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
    localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify([{language:"Hindi"},{language:"English"}]));
    const data = {isNewBadge : true, contributionCount : 5,nextBadgeType: "Silver", currentBadgeType:"Bronze"};
    const localeStrings = {Bronze:"Bronze"};
    setBadge(data, localeStrings, 'contribute');

    expect($("#languageInTopWeb").hasClass("d-none")).toEqual(true);
    expect($("#languageInTopMob").hasClass("d-none")).toEqual(true);
    expect($("#languageNotInTopMob").hasClass("d-none")).toEqual(false);
    expect($("#languageNotInTopWeb").hasClass("d-none")).toEqual(false);
    expect($(".new-badge-msg").hasClass("d-none")).toEqual(false);
    expect($(".thankyou-page-heading").hasClass("d-none")).toEqual(true);
    expect($(".user-contribution-msg").hasClass("d-none")).toEqual(true);
    localStorage.clear();
  })

  test("should show card with badge after user achieved a badge for the language that is not in top", ()=>{
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
    localStorage.setItem(AGGREGATED_DATA_BY_TOP_LANGUAGE, JSON.stringify([{language:"Hindi"},{language:"English"}]));
    const data = {isNewBadge : false, contributionCount : 7,nextBadgeType: "Silver", currentBadgeType:"Bronze"};
    const localeStrings = {Bronze:"Bronze"};
    setBadge(data, localeStrings, 'contribute');

    expect($("#languageInTopWeb").hasClass("d-none")).toEqual(true);
    expect($("#languageInTopMob").hasClass("d-none")).toEqual(true);
    expect($("#languageNotInTopMob").hasClass("d-none")).toEqual(false);
    expect($("#languageNotInTopWeb").hasClass("d-none")).toEqual(false);
    expect($(".new-badge-msg").hasClass("d-none")).toEqual(true);
    expect($(".thankyou-page-heading").hasClass("d-none")).toEqual(true);
    expect($(".user-contribution-msg").hasClass("d-none")).toEqual(false);
    localStorage.clear();
  })

})

describe("updateProgressBar", ()=>{
  test("should set average language metric and goals in progress bar", ()=>{
    const origFetch = require('node-fetch');
    origFetch.mockImplementation(cb => {
      const res = {};
      res.ok = true;
      res.json = ()=> ({goal:100,'current-progress':50 });
      return Promise.resolve(res);
    });

    updateGoalProgressBar('/parallel').then(()=>{
      // expect($(".progress-average-metric").text()).toEqual('&lt%= __(`50% of ${language} ${module} India Target Achieved`)%&gt');
      // expect($(".progress-metric").text()).toEqual("<%= __(`50/100 ${text}`)%>");
      const $progressBar = $("#progress_bar");
      expect($progressBar.css("width")).toEqual("50%")
    })
  })
})

// const showFucntionalCards = (type, from, to) => {
//   try {
//     getLanguageTargetInfo(type, from, to).then(languagePairs => {
//       const { hasTarget, isAllContributed } = languagePairs;
//       let contributeCard = $("#left");
//       let validateCard = $("#right");
//       if (hasTarget && !isAllContributed) {
//         contributeCard.removeClass("cont-validate-disabled");
//         validateCard.removeClass("validate-disabled");
//       } else if (hasTarget && isAllContributed) {
//         validateCard.removeClass("validate-disabled");
//         contributeCard.addClass("cont-validate-disabled");
//       } else if (!hasTarget && !isAllContributed) {
//         contributeCard.removeClass("cont-validate-disabled");
//         validateCard.addClass("validate-disabled");
//       } else {
//         contributeCard.addClass("cont-validate-disabled");
//         validateCard.addClass("validate-disabled");
//       }
//     });
//
//   } catch (error) {
//     console.log(error);
//   }
// }

describe("hasUserRegistered",()=>{
  test("should give false if user is not registered",()=>{
    mockLocalStorage();
    expect(hasUserRegistered()).toEqual(false);
  })

  test("should give true if user is registered",()=>{
    mockLocalStorage();
    localStorage.setItem(SPEAKER_DETAILS_KEY, JSON.stringify({userName:"priya"}))
    expect(hasUserRegistered()).toEqual(true);
    localStorage.clear();
  })

  test("should give true if user is registered",()=>{
    mockLocalStorage();
    localStorage.setItem(SPEAKER_DETAILS_KEY, JSON.stringify({userName:""}))
    expect(hasUserRegistered()).toEqual(true);
    localStorage.clear();
  })
})

describe("showFucntionalCards",()=>{
  test("showFucntionalCards for sunoIndia",()=>{
    const contributeCard = $("#left");
    const validateCard = $("#right");
    console.log(document.body)

    console.log(contributeCard,validateCard)
    fetchMock.get("/target-info/asr/Hindi?targetLanguage=`", {
      data: [
        {
          hasTarget: true,
          isAllContributed: true,
        },
      ],
    });

    // showFucntionalCards('asr', 'Hindi');
    // expect(contributeCard.hasClass('cont-validate-disabled')).toEqual(true);
    // expect(validateCard.hasClass('validate-disabled')).toEqual(false);
  })
})