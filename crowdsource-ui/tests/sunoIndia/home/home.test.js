const {readFileSync} = require('fs');
const {stringToHTML} = require('../../utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../../build/views/sunoIndia/home.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../../../build/views/common/languageNavBar.ejs`, 'UTF-8')
);

const utils = require('../../../build/js/common/utils');
const commonHome = require('../../../build/js/common/commonHome');
const languageNavBar = require('../../../build/js/common/languageNavBar')

utils.updateLocaleLanguagesDropdown = jest.fn().mockImplementation(() => {
});
utils.toggleFooterPosition = jest.fn().mockImplementation(() => {
});
utils.performAPIRequest = jest.fn().mockImplementation(() => {});


commonHome.getStatsSummary
  =
  jest.fn().mockImplementation(() => {
  });
commonHome.getDefaultLang = jest.fn().mockReturnValue("Hindi");
commonHome.setDefaultLang
  =
  jest.fn().mockImplementation(() => {
  });

languageNavBar.setLangNavBar
  =
  jest.fn().mockImplementation(() => {
  });

describe("initializeBlock", () => {
  test("", () => {
  })
})
