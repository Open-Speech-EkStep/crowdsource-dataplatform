const startRecordBtn = document.getElementById("start-record");
const gender = Array.from(document.querySelectorAll('input[name = "gender"]'));
const age = document.getElementById("age");
const state= document.getElementById("state");
const username= document.getElementById("username");
const speakerDetailsKey = "speakerDetails";
const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);


if(speakerDetailsValue)
{
    const parsedSpeakerDetails = JSON.parse(speakerDetailsValue);
    const genderRadio = document.querySelector('input[name = "gender"][value='+parsedSpeakerDetails.gender+']')
    genderRadio && (genderRadio.checked =true);
    age.value = parsedSpeakerDetails.age;
    state.value=parsedSpeakerDetails.state;
    username.value=parsedSpeakerDetails.username;
}


startRecordBtn.addEventListener('click',(event)=>{
    const checkedGender = gender.filter(el => el.checked)
var genderValue = checkedGender.length ? checkedGender[0].value : null
    const speakerDetails = {
        gender:genderValue,
        age:age.value,
        state:state.value,
        username:username.value,
    }
    localStorage.setItem(speakerDetailsKey,JSON.stringify(speakerDetails));
    location.href="/record"
})