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

function toggleFooterPosition() {
    const $footer = $('footer');
    $footer.toggleClass('fixed-bottom')
    $footer.toggleClass('bottom')
}

function fetchLocationInfo(){
    return fetch('http://ip-api.com/json/?fields=country,regionName');
}

module.exports = {setPageContentHeight, toggleFooterPosition, fetchLocationInfo}
