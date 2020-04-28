const startRecordBtn = document.getElementById("start-record");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
startRecordBtn.addEventListener('click',(event)=>{
    if(gender.selectedIndex==0)
    {
        alert("Please select gender");
        return;
    }
    if(age.selectedIndex==0)
    {
        alert("Please select age");
        return;
    }
    const speakerDetails = {
        gender:gender.value,
        age:age.value,
    }
    localStorage.setItem("speakerDetails",JSON.stringify(speakerDetails));
    location.href="/record"
})