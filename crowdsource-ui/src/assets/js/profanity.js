const { CONTRIBUTION_LANGUAGE } = require('./constants');
const fetch = require('./fetch')

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
    $('#proceed-box').on('click', () => {

        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        if (!['asr', 'parallel', 'ocr', 'text'].includes(type)) {
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
            asr: "asr",
            text: "text",
            ocr: "ocr",
            parallel: "parallel"
        }
        verifyUser(userNameValue).then(res => {
            if (res.ok) {
                localStorage.setItem('profanityUserDetails', JSON.stringify(speakerDetails));
                localStorage.setItem('profanityCheckLanguage', language);
                localStorage.setItem(CONTRIBUTION_LANGUAGE, language);
                // if (type === 'boloindia') {
                //     location.href = `/en/profanity-text.html`;
                // } else {
                    location.href = `/en/${keyMap[type]}/profanity.html`;
                // }
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