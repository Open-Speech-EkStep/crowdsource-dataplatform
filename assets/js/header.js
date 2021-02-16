function setUserProfileName(){
    const currentUser = localStorage.getItem('currentUser');
    const validatorName = JSON.parse(currentUser);
    if(!validatorName){
        $('#nav-login').removeClass('d-none');
        $('#nav-user').addClass('d-none');
       return;
    }
    $('#nav-login').addClass('d-none');
    $('#nav-user').removeClass('d-none');
    document.getElementById('nav-username').innerText = validatorName;
}


$(document).ready(setUserProfileName);

module.exports = {setUserProfileName};