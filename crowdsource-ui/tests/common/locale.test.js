const {mockLocalStorage, mockLocation} = require('../utils');
const {CURRENT_MODULE,INITIATIVES} = require('../../build/js/common/constants');
const {changeLocale} = require('../../build/js/common/locale.js');


describe("changeLocale", () => {
  test("should redirect to text initiative home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.text.value);
    changeLocale('en');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/en/text/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();

  })

  test("should redirect to asr initiative home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    changeLocale('en');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/en/asr/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to ocr initiative home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    changeLocale('en');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/en/ocr/home.html")
    expect(localeValue).toEqual("en")
    localStorage.clear();
  })

  test("should redirect to parallel initiative home page with given localisation language", () => {
    mockLocalStorage();
    mockLocation();
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
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
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.text.value);
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/text/home.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to text initiative previous page when previous page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/text/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.text.value);
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = sessionStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/text/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to asr initiative currentPage when current page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/asr/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to ocr initiative currentPage when current page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/dashboard.html'
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/ocr/dashboard.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })

  test("should redirect to parallel initiative currentPage when current page is not homepage", () => {
    mockLocalStorage();
    mockLocation();
    location.href = '/en/parallel/record.html'
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem('i18n', 'hi');
    changeLocale('hi');
    const localeValue = localStorage.getItem("i18n");
    expect(location.href).toEqual("/hi/parallel/record.html")
    expect(localeValue).toEqual("hi")
    localStorage.clear();
  })
})
