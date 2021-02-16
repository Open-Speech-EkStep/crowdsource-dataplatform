function convertPXToVH(px) {
    return px * (100 / document.documentElement.clientHeight);
}

function setPageContentHeight() {
    const $footer = $('footer');
    const $nav = $('.navbar');
    const edgeHeightInPixel = $footer.outerHeight() + $nav.outerHeight()
    const contentHeightInVH = 100 - convertPXToVH(edgeHeightInPixel)
    $('#content-wrapper').css('min-height', contentHeightInVH + 'vh');
}

function toggleFooterPosition(){
    const $footer = $('footer');
    $footer.toggleClass('fixed-bottom')
    $footer.toggleClass('bottom')
}

const logout = () => {
    $('#nav-login').removeClass('d-none');
    $('#nav-user').addClass('d-none');
    document.getElementById('nav-username').innerText = undefined;
    const currentUser = localStorage.getItem('currentUser');
    const parsedCurrentUser = JSON.parse(currentUser);

    localStorage.removeItem('currentUser');
    const validators = localStorage.getItem('validatorDetails');
    const validatorsName = JSON.parse(validators);

    const index = validatorsName.findIndex(e => e === parsedCurrentUser);
    const newSet = validatorsName.slice(0, index).concat(validatorsName.slice(index + 1, validatorsName.length));
    localStorage.setItem('validatorDetails', JSON.stringify(newSet));

    document.getElementById('logout-2').click();
}

module.exports = {setPageContentHeight, toggleFooterPosition, logout}
