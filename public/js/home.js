const startRecordBtn = document.getElementById("start-record");
const genderRadios = document.querySelectorAll('input[name = "gender"]');
const age = document.getElementById("age");
const state = document.getElementById("state");
const username = document.getElementById("username");
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
    state.value = parsedSpeakerDetails.state;
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

startRecordBtn.addEventListener('click', (event) => {
    const checkedGender = Array.from(genderRadios).filter(el => el.checked)
    var genderValue = checkedGender.length ? checkedGender[0].value : ""
    const speakerDetails = {
        gender: genderValue,
        age: age.value,
        state: state.value,
        username: username.value,
    }
    localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
    location.href = "/record"
})