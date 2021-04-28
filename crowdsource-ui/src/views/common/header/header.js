const {
    SELECTED_MODULE,
  } = require('../common/constants');


function onActiveNavbar(value) {
    const $header = $('#module_name');
    localStorage.setItem(SELECTED_MODULE, value);
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


module.exports = {
    onActiveNavbar,
};
