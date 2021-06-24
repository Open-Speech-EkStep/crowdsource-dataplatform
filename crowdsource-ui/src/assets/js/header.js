const {SPEAKER_DETAILS_KEY} = require('./constants');
const {
  setUserModalOnShown,
  setSpeakerDetails,
  setGenderRadioButtonOnClick,
  setUserNameOnInputFocus,
  setStartRecordingBtnOnClick
} = require('./speakerDetails');

const {isMobileDevice} = require('./common');

function onActiveNavbar(value) {
  const $header = $('#module_name');
  localStorage.setItem("selectedModule", value);
  const allDivs = $header.children();
  let targetedDivIndex = -1;
  allDivs.each(function (index, element) {
    if (element.getAttribute('value') === value) {
      targetedDivIndex = index;
    }
  });
  const previousActiveDiv = $header.find('.active');
  previousActiveDiv.removeClass('active');
  allDivs[targetedDivIndex].classList.add('active');
}

const showUserProfile = function (userName) {
  const $navUser = $('#nav-user');
  const $navUserName = $navUser.find('#nav-username');
  const $userProfileName = $('#user_profile_name');
  const $anonymousUser = $('#anonymous_user');
  $navUser.removeClass('d-none');
  if (userName != undefined && userName != null) {
    if(userName.trim().length == 0){
      $userProfileName.addClass('d-none');
      $anonymousUser.removeClass('d-none');
    } else {
      $userProfileName.removeClass('d-none');
      $userProfileName.text(userName);
      $anonymousUser.addClass('d-none');
    }
    if (!isMobileDevice()) {
      $navUserName.text(userName);
    }
  }
}

const onChangeUser = (url, module) => {
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  setUserModalOnShown($userName);
  $startRecordBtnTooltip.tooltip('disable');
  // setSpeakerDetails(SPEAKER_DETAILS_KEY, age, motherTongue, $userName);
  // setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();
  $('#change_user').on('click', () => {
    setStartRecordingBtnOnClick(url, module);
  })
}

module.exports = {
  onActiveNavbar,
  onChangeUser,
  showUserProfile
};
