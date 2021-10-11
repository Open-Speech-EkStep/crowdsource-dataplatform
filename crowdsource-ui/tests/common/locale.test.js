const {mockLocalStorage, mockLocation} = require('../utils');
const {CURRENT_MODULE} = require('../../build/js/common/constants');
const {changeLocale} = require('../../build/js/common/locale.js');


describe("changeLocale", () => {
  test("should redirect to boloIndia home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    changeLocale('en');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/en/text/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();

  })

  test("should redirect to sunoIndia home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'suno');
    changeLocale('en');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/en/asr/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to dekhoIndia home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    changeLocale('en');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/en/ocr/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to likhoIndia home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'likho');
    changeLocale('en');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/en/parallel/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to landing page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, 'home');
    changeLocale('en');
    const localeValue = sessionStorage.getItem("i18n");
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
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/text/home.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to boloIndia previous page when previous page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/text/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, 'bolo');
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/text/dashboard.html")
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
    expect(location.href).toEqual("/hi/asr/dashboard.html")
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
    expect(location.href).toEqual("/hi/ocr/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to likhoIndia currentPage when current page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/parallel/record.html'
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/parallel/record.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })
})
