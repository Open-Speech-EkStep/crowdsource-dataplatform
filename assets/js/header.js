function setUserProfileName(){
    const header = document.getElementById('header-script');
    const isSignedIn = header.getAttribute('isSignedIn');
    const currentUser = localStorage.getItem('currentUser');
    const currentUserName = currentUser && JSON.parse(currentUser);

    if(JSON.parse(isSignedIn)) {

        $('#nav-login').addClass('d-none');
        $('#nav-user').removeClass('d-none');
        document.getElementById('nav-username').innerText = currentUserName;
        return;
    }
    $('#nav-login').removeClass('d-none');
    $('#nav-user').addClass('d-none');
    document.getElementById('nav-username').innerText = undefined;
    localStorage.removeItem('currentUser');

    const validators = localStorage.getItem('validatorDetails');
    const validatorsName = validators && JSON.parse(validators);

    if(validatorsName){
        const index =  validatorsName.findIndex(e => e === currentUserName);
        const newSet = validatorsName.slice(0, index).concat(validatorsName.slice(index + 1, validatorsName.length));
        localStorage.setItem('validatorDetails', JSON.stringify(newSet));
    }
}


$(document).ready(setUserProfileName);

module.exports = {setUserProfileName};