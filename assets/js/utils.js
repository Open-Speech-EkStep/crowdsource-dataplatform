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

const logout = () =>{
    console.log("here");
    $('#nav-login').removeClass('d-none');
    $('#nav-user').addClass('d-none');
    document.getElementById('nav-username').innerText = undefined;
    const currentUser = localStorage.getItem('currentUser');
    const parsedCurrentUser = JSON.parse(currentUser);
    localStorage.removeItem('currentUser');
    delete(localStorage.validatorDetails[parsedCurrentUser]);
    document.getElementById('logout-2').click();
}

module.exports = {setPageContentHeight, toggleFooterPosition, logout}
