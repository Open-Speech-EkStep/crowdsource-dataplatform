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
    //https://api.ipify.org/?format=json
    return fetch('https://api.ipify.org/?format=json').then(ipAddressJson => {
        if("ip" in ipAddressJson){
            const ip = ipAddressJson["ip"];
            return fetch(`/location-info?ip=${ip}`);
        } else {
            return new Promise((resolve, reject)=>{
                reject("Ip Address not available")
            })
        }
    });
}

module.exports = {setPageContentHeight, toggleFooterPosition, fetchLocationInfo}
