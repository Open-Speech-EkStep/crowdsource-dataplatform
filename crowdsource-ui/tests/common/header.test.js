const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('../utils');
const {CURRENT_MODULE} = require('../../build/js/common/constants');
const {onActiveNavbar,showUserProfile} = require('../../build/js/common/header.js');
const headerHtml = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/header.ejs`, 'UTF-8')
);


describe("onActiveNavbar",()=> {
  document.body =headerHtml;

  const $header = $('#module_name');
  const allDivs = $header.children();

  test("should add active class to home nav Item in nav bar for landing page when no prev nav item has active", () => {
    mockLocalStorage();
    onActiveNavbar("home");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("home");
    expect(allDivs[0].classList.contains('active')).toEqual(true);
    expect(allDivs[1].classList.contains('active')).toEqual(false);
    expect(allDivs[2].classList.contains('active')).toEqual(false);
    expect(allDivs[3].classList.contains('active')).toEqual(false);
    expect(allDivs[4].classList.contains('active')).toEqual(false);

    localStorage.clear()

  })

  test("should add active class to suno nav Item in nav bar for sunoIndia", () => {
    mockLocalStorage();
    onActiveNavbar("suno");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("suno");
    expect(allDivs[0].classList.contains('active')).toEqual(false);
    expect(allDivs[1].classList.contains('active')).toEqual(true);
    expect(allDivs[2].classList.contains('active')).toEqual(false);
    expect(allDivs[3].classList.contains('active')).toEqual(false);
    expect(allDivs[4].classList.contains('active')).toEqual(false);

    localStorage.clear()

  })

  test("should add active class to bolo nav Item in nav bar for boloIndia", () => {
    mockLocalStorage();
    onActiveNavbar("bolo");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("bolo");

    expect(allDivs[0].classList.contains('active')).toEqual(false);
    expect(allDivs[1].classList.contains('active')).toEqual(false);
    expect(allDivs[2].classList.contains('active')).toEqual(true);
    expect(allDivs[3].classList.contains('active')).toEqual(false);
    expect(allDivs[4].classList.contains('active')).toEqual(false);

    localStorage.clear()

  })

  test("should add active class to likho nav Item in nav bar for likhoIndia", () => {
    mockLocalStorage();
    onActiveNavbar("likho");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("likho");
    expect(allDivs[0].classList.contains('active')).toEqual(false);
    expect(allDivs[1].classList.contains('active')).toEqual(false);
    expect(allDivs[2].classList.contains('active')).toEqual(false);
    expect(allDivs[3].classList.contains('active')).toEqual(true);
    expect(allDivs[4].classList.contains('active')).toEqual(false);

    localStorage.clear()

  })

  test("should add active class to dekho nav Item in nav bar for dekhoIndia", () => {
    mockLocalStorage();
    onActiveNavbar("dekho");

    expect(localStorage.getItem(CURRENT_MODULE)).toEqual("dekho");
    expect(allDivs[0].classList.contains('active')).toEqual(false);
    expect(allDivs[1].classList.contains('active')).toEqual(false);
    expect(allDivs[2].classList.contains('active')).toEqual(false);
    expect(allDivs[3].classList.contains('active')).toEqual(false);
    expect(allDivs[4].classList.contains('active')).toEqual(true);

    localStorage.clear()

  })
})

describe("showUserProfile",()=> {
  test("should show user profile icon with username on web", () => {
    document.body =headerHtml;
    const $navUser = $('#nav-user');
    const $userProfileName = $('#user_profile_name');
    const $anonymousUser = $('#anonymous_user');
    const $navUserName = $navUser.find('#nav-username');

    showUserProfile("testUser");

    expect($navUser.hasClass('d-none')).toEqual(false);
    expect($navUserName.text()).toEqual("testUser");
    expect($userProfileName.hasClass('d-none')).toEqual(true);
    expect($anonymousUser.hasClass('d-none')).toEqual(true);
  })

  test("should show user profile icon with username on web with anonymous username", () => {
    document.body = headerHtml;
    const $navUser = $('#nav-user');
    const $navUserName = $navUser.find('#nav-username');
    const $userProfileName = $('#user_profile_name');
    const $anonymousUser = $('#anonymous_user');

    showUserProfile("");

    expect($navUser.hasClass('d-none')).toEqual(false);
    expect($navUserName.text()).toEqual("");
    expect($userProfileName.hasClass('d-none')).toEqual(true);
    expect($anonymousUser.hasClass('d-none')).toEqual(false);
    expect($anonymousUser.text().trim()).toEqual("<%= __('(No Username)')%>");
  })
})
