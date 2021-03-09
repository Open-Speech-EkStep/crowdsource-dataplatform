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
    return fetch('https://www.cloudflare.com/cdn-cgi/trace').then(res=>res.text()).then(ipAddressText => {
        const dataArray = ipAddressText.split('\n');
        let ipAddress = "";
        for(let ind in dataArray){
            if(dataArray[ind].startsWith("ip=")){
                ipAddress = dataArray[ind].replace('ip=','');
                break;
            }
        }
        if(ipAddress.length !== 0){
            return fetch(`/location-info?ip=${ipAddress}`);
        } else {
            return new Promise((resolve, reject)=>{
                reject("Ip Address not available")
            })
        }
    });
}

module.exports = {setPageContentHeight, toggleFooterPosition, fetchLocationInfo}
