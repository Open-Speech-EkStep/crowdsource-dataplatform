function setUserProfileName(){
    const header = document.getElementById('header-script');
    const isSignedIn = header.getAttribute('isSignedIn');
    const validator = localStorage.getItem('currentUser');

    const validatorName = validator && JSON.parse(validator);

    if(JSON.parse(isSignedIn) && validatorName) {
        $('#nav-login').addClass('d-none');
        $('#nav-user').removeClass('d-none');
        document.getElementById('nav-username').innerText = validatorName;
        return;
    }
    $('#nav-login').removeClass('d-none');
    $('#nav-user').addClass('d-none');
    document.getElementById('nav-username').innerText = undefined;
    localStorage.removeItem('currentUser');

    const validators = localStorage.getItem('validatorDetails');
    const validatorList = validators && JSON.parse(validators);

    if(validatorList){
        const index =  validatorList.findIndex(e => e === validatorName);
        const newSet = validatorList.slice(0, index).concat(validatorList.slice(index + 1, validatorList.length));
        localStorage.setItem('validatorDetails', JSON.stringify(newSet));
    }
}

$(document).ready(setUserProfileName);

module.exports = {setUserProfileName};