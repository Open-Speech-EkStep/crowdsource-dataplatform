const {CURRENT_MODULE} = require('../common/constants');

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

module.exports = {onActiveNavbar,showUserProfile};
