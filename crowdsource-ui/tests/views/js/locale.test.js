const {mockLocalStorage, mockLocation} = require('../../utils');
const {CURRENT_MODULE} = require('../../../build/js/common/constants');
const {changeLocale} = require('../../../build/js/common/locale.js');


describe("changeLocale", () => {
  test("should redirect to boloIndia home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    changeLocale('en');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/en/boloIndia/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();

  })

  test("should redirect to sunoIndia home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'suno');
    changeLocale('en');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/en/sunoIndia/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to dekhoIndia home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    changeLocale('en');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/en/dekhoIndia/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to likhoIndia home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'likho');
    changeLocale('en');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/en/likhoIndia/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to landing page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'home');
    changeLocale('en');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/en/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to home page of current module when previous url has no current page", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/'
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/boloIndia/home.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to boloIndia previous page when previous page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to sunoIndia currentPage when current page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/sunoIndia/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to dekhoIndia currentPage when current page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/dekhoIndia/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to likhoIndia currentPage when current page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/likhoIndia/record.html'
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/likhoIndia/record.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })
})
