const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage, mockLocation} = require('../../utils');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE,ALL_LANGUAGES} = require('../../../build/js/common/constants');
const {redirectToLocalisedPage} = require('../../../build/js/common/common.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../../build/views/sunoIndia/home.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../../../build/views/common/languageNavBar.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../../build/views/common/say-listen-language.ejs`, 'UTF-8')
);

describe("redirectToLocalisedPage",()=>{
  test("should redirect to boloIndia home page when no localisation and contribution is set",()=>{
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/en/boloIndia/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();

  })

  test("should redirect to sunoIndia home page when no localisation and contribution is set",()=>{
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'suno');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/en/sunoIndia/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to dekhoIndia home page when no localisation and contribution is set",()=>{
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/en/dekhoIndia/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to likhoIndia home page when no localisation and contribution is set",()=>{
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'likho');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/en/likhoIndia/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to landing page when no localisation and contribution is set",()=>{
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'home');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/en/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to boloIndia Home page when localisation is set but contribution language is not set",()=>{
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    localStorage.setItem('i18n', 'hi');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/hi/boloIndia/home.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to boloIndia Dashboard when current page is not homepage",()=>{
    mockLocalStorage();
    mockLocation();
    location.href = '/en/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    localStorage.setItem('i18n', 'hi');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/hi/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to sunoIndia currentPage when current page is not homepage",()=>{
    mockLocalStorage();
    mockLocation();
    location.href = '/en/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem('i18n', 'hi');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/hi/sunoIndia/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to dekhoIndia currentPage when current page is not homepage",()=>{
    mockLocalStorage();
    mockLocation();
    location.href = '/en/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    localStorage.setItem('i18n', 'hi');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/hi/dekhoIndia/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to likhoIndia currentPage when current page is not homepage",()=>{
    mockLocalStorage();
    mockLocation();
    location.href = '/en/likhoIndia/record.html'
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem('i18n', 'hi');
    redirectToLocalisedPage();
    const localeValue = localStorage.getItem("i18n") ;
    expect(location.href).toEqual("/hi/likhoIndia/record.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })
})