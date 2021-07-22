const {readFileSync} = require('fs');
const fetchMock = require("fetch-mock");
const {stringToHTML, mockLocalStorage} = require('../../utils');
const {CURRENT_MODULE,CONTRIBUTION_LANGUAGE} = require('../../../build/js/common/constants');
const {initializeBlock} = require('../../../build/js/sunoIndia/home.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../../build/views/sunoIndia/home.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../../../build/views/common/languageNavBar.ejs`, 'UTF-8')
);

const utils = require('../../../build/js/common/utils');
const commonHome = require('../../../build/js/common/commonHome');
const languageNavBar = require('../../../build/js/common/languageNavBar')

utils.updateLocaleLanguagesDropdown = jest.fn().mockImplementation((a) => {
});
utils.toggleFooterPosition = jest.fn().mockImplementation(() => {
});
utils.performAPIRequest = jest.fn().mockImplementation(() => {});


commonHome.getStatsSummary
  =
  jest.fn().mockImplementation((a, b, c) => {
  });
commonHome.getDefaultLang = jest.fn().mockReturnValue("Hindi");
commonHome.setDefaultLang
  =
  jest.fn().mockImplementation(() => {
  });

languageNavBar.setLangNavBar
  =
  jest.fn().mockImplementation((a, b) => {
  });

describe("initializeBlock", () => {
  test("", () => {
  })
})
