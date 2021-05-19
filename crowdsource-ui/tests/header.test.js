const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');
const {CURRENT_MODULE} = require('../build/js/common/constants');
const {onActiveNavbar,showUserProfile} = require('../build/js/common/header.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/common/header.ejs`, 'UTF-8')
);

describe("onActiveNavbar",()=> {
  const $header = $('#module_name');
  const allDivs = $header.children();

  test("should add active class to bolo nav Item in nav bar for boloIndia when no prev nav item has active", () => {
    mockLocalStorage();
    onActiveNavbar("bolo");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("bolo");
    expect(allDivs[0].classList.contains('active')).toEqual(true);
    expect(allDivs[1].classList.contains('active')).toEqual(false);
    expect(allDivs[2].classList.contains('active')).toEqual(false);
    expect(allDivs[3].classList.contains('active')).toEqual(false);

    localStorage.clear()

  })

  test("should add active class to suno nav Item in nav bar for sunoIndia", () => {
    mockLocalStorage();
    onActiveNavbar("suno");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("suno");
    expect(allDivs[1].classList.contains('active')).toEqual(true);
    expect(allDivs[0].classList.contains('active')).toEqual(false);
    expect(allDivs[2].classList.contains('active')).toEqual(false);
    expect(allDivs[3].classList.contains('active')).toEqual(false);

    localStorage.clear()

  })

  test("should add active class to likho nav Item in nav bar for likhoIndia", () => {
    mockLocalStorage();
    onActiveNavbar("likho");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("likho");
    expect(allDivs[2].classList.contains('active')).toEqual(true);
    expect(allDivs[0].classList.contains('active')).toEqual(false);
    expect(allDivs[1].classList.contains('active')).toEqual(false);
    expect(allDivs[3].classList.contains('active')).toEqual(false);

    localStorage.clear()

  })

  test("should add active class to dekho nav Item in nav bar for dekhoIndia", () => {
    mockLocalStorage();
    onActiveNavbar("dekho");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("dekho");
    expect(allDivs[3].classList.contains('active')).toEqual(true);
    expect(allDivs[0].classList.contains('active')).toEqual(false);
    expect(allDivs[1].classList.contains('active')).toEqual(false);
    expect(allDivs[2].classList.contains('active')).toEqual(false);

    localStorage.clear()

  })
})

describe("showUserProfile",()=> {
  test("should show user profile icon with username", () => {
    const $navUser = $('#nav-user');
    const $navUserName = $navUser.find('#nav-username');

    showUserProfile("testUser");

    expect($navUser.hasClass('d-none')).toEqual(false);
    expect($navUserName.text()).toEqual("testUser");

    localStorage.clear()
  })
})
