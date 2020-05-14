const $startRecordBtn = $("#start-record");
const genderRadios = document.querySelectorAll('input[name = "gender"]');
const age = document.getElementById("age");
const motherTongue = document.getElementById("mother-tongue");
const username = document.getElementById("username");
const $tncCheckbox = $("#tnc");
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
    username.value = parsedSpeakerDetails.username;
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
    }
    else {
        $startRecordBtn.prop("disabled", "true");
    }
});

$startRecordBtn.on('click', (event) => {
    const checkedGender = Array.from(genderRadios).filter(el => el.checked)
    var genderValue = checkedGender.length ? checkedGender[0].value : ""
    const speakerDetails = {
        gender: genderValue,
        age: age.value,
        mother: motherTongue.value,
        username: username.value,
    }
    localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
    location.href = "/record"
})