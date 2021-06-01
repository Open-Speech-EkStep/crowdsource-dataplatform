const { CONTRIBUTION_LANGUAGE } = require('./constants');

function testUserName(username) {
    let mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return mailformat.test(username);
}

const verifyUser = (userName) => {
    return fetch('/profanity/verify', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            userName: userName,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

$(document).ready(function () {
    localStorage.removeItem('profanityUserDetails');
    localStorage.removeItem('profanityCheckLanguage');
    $("#profanityUserModal").modal('show');
    $('#proceed-box').on('click', (e) => {

        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        if (!['sunoindia', 'likhoindia', 'dekhoindia', 'boloindia'].includes(type)) {
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
        let keyMap = {
            sunoindia: "sunoIndia",
            boloindia: "boloIndia",
            dekhoindia: "dekhoIndia",
            likhoindia: "likhoIndia"
        }
        verifyUser(userNameValue).then(res => {
            if (res.ok) {
                localStorage.setItem('profanityUserDetails', JSON.stringify(speakerDetails));
                localStorage.setItem('profanityCheckLanguage', language);
                localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
                if (type === 'boloindia') {
                    location.href = `/en/profanity-boloindia.html`;
                } else {
                    location.href = `/en/${keyMap[type]}/profanity.html`;
                }
            } else {
                alert("User not found")
            }
        }).catch(err => {
            console.log(err)
            alert("User not found")
        })
    });
    // $(window).unload(function(){
    //     localStorage.removeItem('profanityUserDetails');
    //     localStorage.removeItem('profanityCheckLanguage');
    // });
});