function validateUserName($userName, $userNameError, $tncCheckbox) {
    const userNameValue = $userName.val().trim();
    if (testUserName(userNameValue)) {
        $userName.addClass('is-invalid');
        $userNameError.removeClass('d-none');
    } else {
        $userName.removeClass('is-invalid');
        $userNameError.addClass('d-none');
    }
    $tncCheckbox.trigger('change');
}

function resetSpeakerDetails() {
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const userName = document.getElementById('username');
    const selectedGender = document.querySelector(
        'input[name = "gender"]:checked'
    );
    if (selectedGender) selectedGender.checked = false;
    age.selectedIndex = 0;
    motherTongue.selectedIndex = 0;
    userName.value = '';
}

const testUserName = (val) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^\S+@\S+[\.][0-9a-z]+$/;
    return mobileRegex.test(val) || emailRegex.test(val);
};

function setUserNameTooltip($userName) {
    if ($userName.val().length > 11) {
        $userName.tooltip('enable');
        $userName.tooltip('show');
    } else {
        $userName.tooltip('disable');
        $userName.tooltip('hide');
    }
}

const setStartRecordBtnToolTipContent = (userName, $startRecordBtnTooltip) => {
    if (testUserName(userName)) {
        $startRecordBtnTooltip.attr(
            'data-original-title',
            'Please validate any error message before proceeding'
        );
    } else {
        $startRecordBtnTooltip.attr(
            'data-original-title',
            'Please agree to the Terms and Conditions before proceeding'
        );
    }
};

const setSpeakerDetails = (speakerDetailsKey, age, motherTongue, $userName) => {
    const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);
    if (speakerDetailsValue) {
        const parsedSpeakerDetails = JSON.parse(speakerDetailsValue);
        const genderRadio = document.querySelector(
            'input[name = "gender"][value="' + parsedSpeakerDetails.gender + '"]'
        );
        if (genderRadio) {
            genderRadio.checked = true;
            genderRadio.previous = true;
        }
        age.value = parsedSpeakerDetails.age;
        motherTongue.value = parsedSpeakerDetails.motherTongue;
        $userName.val(
            parsedSpeakerDetails.userName
                ? parsedSpeakerDetails.userName.trim().substring(0, 12)
                : ''
        );
        validateUserName($userName, $userName.next(), $('#tnc'));
    }
};


module.exports = {
    testUserName,
    validateUserName,
    setSpeakerDetails,
    resetSpeakerDetails,
    setUserNameTooltip,
    setStartRecordBtnToolTipContent
};