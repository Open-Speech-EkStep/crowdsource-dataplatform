const {CURRENT_MODULE, SPEAKER_DETAILS_KEY} = require('./constants');
const {setUserModalOnShown,setSpeakerDetails,setGenderRadioButtonOnClick,setUserNameOnInputFocus,setStartRecordingBtnOnClick} = require('./speakerDetails');

function onActiveNavbar(value) {
  const $header = $('#module_name');
  localStorage.setItem(CURRENT_MODULE, value);
  const allDivs = $header.children();
  let targetedDivIndex = -1;
  allDivs.each(function (index, element) {
    if (element.getAttribute('value') === value) {
      targetedDivIndex = index;
    }
  });
  const previousActiveDiv = $header.find('.active');
  previousActiveDiv && previousActiveDiv.removeClass('active');
  allDivs[targetedDivIndex].classList.add('active');
}

const showUserProfile = function (userName){
  const $navUser = $('#nav-user');
  const $navUserName = $navUser.find('#nav-username');
  if(userName && userName.length> 0){
  $navUser.removeClass('d-none');
    $navUserName.text(userName);
  }
}

const onChangeUser = (url, module)=>{
  const age = document.getElementById('age');
  const motherTongue = document.getElementById('mother-tongue');
  const $userName = $('#username');
  const $startRecordBtn = $('#proceed-box');
  const $startRecordBtnTooltip = $startRecordBtn.parent();
  setUserModalOnShown($userName);
  $startRecordBtnTooltip.tooltip('disable');
  setSpeakerDetails(SPEAKER_DETAILS_KEY, age, motherTongue, $userName);
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();
  $('#change_user').on('click',()=>{
    setStartRecordingBtnOnClick(url,module);
  })
}

module.exports = {onActiveNavbar,showUserProfile,onChangeUser};
