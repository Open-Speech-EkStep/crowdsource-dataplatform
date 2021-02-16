function setUserProfileName(){
    const header = document.getElementById('header-script');
    const isSignedIn = header.getAttribute('isSignedIn');
    const validator = localStorage.getItem('currentUser');
    const admin = localStorage.getItem('admin');

    const validatorName = validator && JSON.parse(validator);

    const adminName = admin && JSON.parse(admin);

    if(JSON.parse(isSignedIn)) {
        $('#nav-login').addClass('d-none');
        $('#nav-user').removeClass('d-none');
        document.getElementById('nav-username').innerText = validatorName || adminName;
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