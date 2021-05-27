const {CONTRIBUTION_LANGUAGE} = require('./constants');

function testUserName(username) {
    let mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return mailformat.test(username);
}

$(document).ready(function () {
    localStorage.removeItem('profanityUserDetails');
    localStorage.removeItem('profanityCheckLanguage');
    $("#profanityUserModal").modal('show');
    $('#proceed-box').on('click', (e) => {

        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        if (!['sunoindia', 'likhoindia', 'dekhoindia'].includes(type)) {
            alert("Matching type not found")
            return;
        }

        const userNameValue = $('#username').val().trim();
        if (!testUserName(userNameValue)) {
            alert("Enter valid email")
            return;
        }

        const language = document.getElementById('preferred-language').value;
        if (language === "") {
            alert("Choose preferred language")
            return;
        }

        const speakerDetails = {
            userName: userNameValue,
            language: language,
        };
        console.log(speakerDetails);
        localStorage.setItem('profanityUserDetails', JSON.stringify(speakerDetails));
        localStorage.setItem('profanityCheckLanguage', language);
        localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
        location.href = `/en/${type}/profanity.html`;
    });
    // $(window).unload(function(){
    //     localStorage.removeItem('profanityUserDetails');
    //     localStorage.removeItem('profanityCheckLanguage');
    // });
});