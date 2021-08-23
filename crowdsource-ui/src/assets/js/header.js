const {
  setUserModalOnShown,
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

const onOpenUserDropDown = ()=>{
  const $userDropDown = $('#userDropDown');
  const $userNavBar = $('#userNavBar');
  $userDropDown.off('show.bs.dropdown').on('show.bs.dropdown',()=>{
    $userNavBar.addClass('active')
  })

  $userDropDown.off('hide.bs.dropdown').on('hide.bs.dropdown',()=>{
    $userNavBar.removeClass('active')
  })
}

const showUserProfile = function (userName) {
  const $navUser = $('#nav-user');
  const $navUserName = $navUser.find('#nav-username');
  const $userProfileName = $('#user_profile_name');
  const $anonymousUser = $('#anonymous_user');
  $navUser.removeClass('d-none');
  if (userName != undefined && userName != null) {
    if(isMobileDevice()){
      if(userName.trim().length == 0){
        $userProfileName.addClass('d-none');
        $anonymousUser.removeClass('d-none');
      } else {
        $userProfileName.removeClass('d-none');
        $userProfileName.text(userName);
        $anonymousUser.addClass('d-none');
      }
    } else {
      if(userName.trim().length == 0){
        $userProfileName.addClass('d-none');
        $anonymousUser.removeClass('d-none');
        $navUserName.text(userName);
      } else {
        $userProfileName.addClass('d-none');
        $anonymousUser.addClass('d-none');
        $navUserName.text(userName);
      }
    }
  }
}

const onChangeUser = (url, module) => {
  try {
    const $userName = $('#username');
  const $startRecordBtn = $('#proceed-box');
  let $startRecordBtnTooltip;
  if($startRecordBtn) {
    $startRecordBtnTooltip = $startRecordBtn.parent();
  }

  setUserModalOnShown($userName);

  if($startRecordBtnTooltip) {
    $startRecordBtnTooltip.tooltip('disable');
  }
  setGenderRadioButtonOnClick();
  setUserNameOnInputFocus();
  $('#change_user').on('click', () => {
    setStartRecordingBtnOnClick(url, module);
  })
  } catch (error) {
    console.log(error);
  }
  
}

const $locale_language_dropdown = $('#locale_language_dropdown');
$locale_language_dropdown.off('show.bs.dropdown').on('show.bs.dropdown',()=>{
  $locale_language_dropdown.addClass('active')
})

$locale_language_dropdown.off('hide.bs.dropdown').on('hide.bs.dropdown',()=>{
  $locale_language_dropdown.removeClass('active')
})

const collapseMobileNavigation = () => {
  const $navbar = $('.navbar-collapse');
  if($navbar.hasClass('show')) {
    $navbar.collapse('hide');
  }
};

$('#localeDropdownMenuButton').click(() => {
  collapseMobileNavigation();
});

$('#nav-user').click(() => {
  collapseMobileNavigation();
});

module.exports = {
  onActiveNavbar,
  onChangeUser,
  showUserProfile,
  onOpenUserDropDown
};
