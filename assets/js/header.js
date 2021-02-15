function setUserProfileName(){
    // const localSpeakerData = localStorage.getItem('speakerDetails');
    // const localSpeakerDataParsed = JSON.parse(localSpeakerData);
    //
    // if (!localSpeakerDataParsed) {
    //     return;
    // }
    const currentUser = localStorage.getItem('currentUser');
    const validatorName = JSON.parse(currentUser);

    if(!validatorName){
       return;
    }

    $('#nav-login').addClass('d-none');
    $('#nav-user').removeClass('d-none');
    document.getElementById('nav-username').innerText = validatorName;
}

// $(document).ready(setUserProfileName);

module.exports = {setUserProfileName};