const {readFileSync} = require('fs');
const fetchMock = require("fetch-mock");
const {stringToHTML, mockLocalStorage} = require('../utils');
const {CONTRIBUTION_LANGUAGE} = require('../../build/js/common/constants');
const {showFucntionalCards} = require('../../build/js/common/common.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/cards.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../build/views/common/languageNavBar.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../build/views/common/say-listen-language.ejs`, 'UTF-8')
);

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