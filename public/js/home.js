const $startRecordBtn = $("#start-record");
const genderRadios = document.querySelectorAll('input[name = "gender"]');
const age = document.getElementById("age");
const motherTongue = document.getElementById("mother-tongue");
const userName = document.getElementById("username");
const $tncCheckbox = $("#tnc");
const $usernameAlert = $("#username-alert");
const $tncAlert = $("#tnc-alert");
const mobileRegex  =/^[6-9]\d{9}$/;
const emailRegex = /^\S+@\S+[\.][0-9a-z]+$/


$(document).ready(function () {
    $tncCheckbox.prop('checked', false);
});

const speakerDetailsKey = "speakerDetails";
const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);
if (speakerDetailsValue) {
    const parsedSpeakerDetails = JSON.parse(speakerDetailsValue);
    const genderRadio = document.querySelector('input[name = "gender"][value=\"' + parsedSpeakerDetails.gender + '\"]');
    if (genderRadio) {
        genderRadio.checked = true;
        genderRadio.previous = true;
    }
    age.value = parsedSpeakerDetails.age;
    motherTongue.value = parsedSpeakerDetails.motherTongue;
    userName.value = parsedSpeakerDetails.userName ? parsedSpeakerDetails.userName.trim() : "";
}

genderRadios.forEach(element => {
    element.addEventListener('click', e => {
        if (e.target.previous) {
            e.target.checked = false;
        }
        e.target.previous = e.target.checked;
    })
});
$tncCheckbox.change(function () {
    if (this.checked) {
        $startRecordBtn.removeAttr('disabled');
        $tncAlert.removeClass("show").addClass("d-none");
    }
    else {
        $startRecordBtn.prop("disabled", "true");
        $tncAlert.removeClass("d-none").addClass("show");
    }
});

const showAlert = ($element) => 
{
    $element.removeClass("d-none").addClass("show");
    setTimeout(() => {
        $element.removeClass("show").addClass("d-none");
    }, 3000);
}

$startRecordBtn.on('click', (event) => {
    if($tncCheckbox.prop('checked')){
        const checkedGender = Array.from(genderRadios).filter(el => el.checked)
        const genderValue = checkedGender.length ? checkedGender[0].value : ""
        const userNameValue = userName.value.trim();
        if(mobileRegex.test(userNameValue) || emailRegex.test(userNameValue))
        {
            
            showAlert($usernameAlert);
            return;
        }
        const speakerDetails = {
            gender: genderValue,
            age: age.value,
            motherTongue: motherTongue.value,
            userName: userNameValue,
        }
        localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
        location.href = "/record"
    }
})

//lazy load other css libs
setTimeout(() => {
    fetch("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css");
    fetch("https://fonts.googleapis.com/icon?family=Material+Icons");
    fetch("css/notyf.min.css");
    fetch("css/record.css");
}, 2000);
