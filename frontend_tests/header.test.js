const {setUserProfileName} = require('../assets/js/header');
const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/common/header.ejs`, 'UTF-8') + readFileSync(`${__dirname}/../views/home.ejs`, 'UTF-8')
);

describe('setUserProfileName',()=>{
    test('should not set validator name in header when validator has not loggged in',()=>{
        const header = document.getElementById('header-script');
        header.setAttribute('isSignedIn',"false");
        setUserProfileName();

        expect($('#nav-login').hasClass('d-none')).toEqual(false);
        expect($('#nav-user').hasClass('d-none')).toEqual(true);
        expect(document.getElementById('nav-username').innerText).toEqual(undefined);
    })

    test('should set validator name in header when validator has loggged in',()=>{
        mockLocalStorage();
        const header = document.getElementById('header-script');
        header.setAttribute('isSignedIn',"true");
        localStorage.setItem('currentUser',JSON.stringify("abc"));

        setUserProfileName();
        expect($('#nav-login').hasClass('d-none')).toEqual(true);
        expect($('#nav-user').hasClass('d-none')).toEqual(false);
        expect(document.getElementById('nav-username').innerText).toEqual("abc");
        localStorage.clear();
    })

    test('should remove current user from validators list after validator has logged off',()=>{
        mockLocalStorage();
        const header = document.getElementById('header-script');
        header.setAttribute('isSignedIn',"false");
        localStorage.setItem('currentUser',JSON.stringify("abc"));
        localStorage.setItem('validatorDetails',JSON.stringify(["abc","xyz"]));

        setUserProfileName();
        expect($('#nav-login').hasClass('d-none')).toEqual(false);
        expect($('#nav-user').hasClass('d-none')).toEqual(true);
        expect(document.getElementById('nav-username').innerText).toEqual(undefined);

        expect(localStorage.getItem('validatorDetails')).toEqual(JSON.stringify(["xyz"]));
        localStorage.clear();
    })
})