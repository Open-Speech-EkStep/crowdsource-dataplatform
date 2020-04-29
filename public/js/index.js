const startRecordBtn = document.getElementById("start-record");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
const state= document.getElementById("state");
const email= document.getElementById("email");
const speakerName= document.getElementById("speakerName");
const speakerDetailsKey = "speakerDetails";
const speakerDetailsValue = localStorage.getItem(speakerDetailsKey);


if(speakerDetailsValue)
{
    const parsedSpeakerDetails = JSON.parse(speakerDetailsValue);
    console.log(parsedSpeakerDetails);
    gender.value = parsedSpeakerDetails.gender;
    age.value = parsedSpeakerDetails.age;
    state.value=parsedSpeakerDetails.state;
    email.value=parsedSpeakerDetails.email;
    speakerName.value=parsedSpeakerDetails.speakerName;
}


startRecordBtn.addEventListener('click',(event)=>{
    const speakerDetails = {
        gender:gender.value,
        age:age.value,
        state:state.value,
        email:email.value,
        speakerName:speakerName.value
    }
    localStorage.setItem(speakerDetailsKey,JSON.stringify(speakerDetails));
    location.href="/record"
})