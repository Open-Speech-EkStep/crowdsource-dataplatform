const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE} = require('./constants');
const {
    updateLocaleLanguagesDropdown
  } = require('./utils');

function setupScroll() {
    const $navRow = $("#nav-row");
    const navRowHeight = $navRow.height();
    const $termsOfUse = $("#terms-of-use");
    const navRowPosition = $navRow.offset();
    const $termsOfUsePosition = $termsOfUse.offset();
    const $privacyPolicy = $("#privacy-policy");
    const $privacyPolicyPosition = $privacyPolicy.offset();
    const $copyright = $("#copyright");
    const $copyrightPosition = $copyright.offset();
    const navTermsOfUse = document.getElementById("nav-terms-of-use");
    const navPrivacyPolicy = document.getElementById("nav-privacy-policy");
    const navCopyright = document.getElementById("nav-copyright");
    navTermsOfUse.onclick = () => {
        scrollTo(0, $termsOfUsePosition.top - navRowHeight  - 100);
    };
    navPrivacyPolicy.onclick = () => {
        scrollTo(0, $privacyPolicyPosition.top - navRowHeight);
    };
    navCopyright.onclick = () => {
        scrollTo(0, $copyrightPosition.top + 10000);
    };

    window.onscroll = () => {
      if (pageYOffset > navRowPosition.top) {
          $navRow.addClass("fixed-top");
          $termsOfUse.css({
              paddingTop: navRowHeight,
          });
      } else {
          $navRow.removeClass("fixed-top");
          $termsOfUse.css({
              paddingTop: 0,
          });
      }
    $('#navbarSupportedContent').removeClass('show');
  };
}


$(document).ready(function () {
    localStorage.setItem(CURRENT_MODULE, "home");
    document.body.querySelector('footer').classList.remove('fixed-bottom');
    setupScroll();
    const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  updateLocaleLanguagesDropdown(language);
});