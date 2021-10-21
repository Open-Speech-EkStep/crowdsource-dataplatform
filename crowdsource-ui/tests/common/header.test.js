const {readFileSync} = require('fs');
const {stringToHTML} = require('../utils');
const {showUserProfile} = require('../../build/js/common/header.js');
const headerHtml = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/header.ejs`, 'UTF-8')
);

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
