const submitQueryBtn = document.getElementById("submitQuery");
const email = document.getElementById("email");
const query = document.getElementById("query");
submitQueryBtn.addEventListener("click",event => {
    if(!email.value || !query.value)
    {
        notyf.error('Please fill out all the required fields');
        return;
    }
    submitQuery(JSON.stringify({
        email:email.value,
        query:query.value
    }))
})
const submitQuery = (queryText) => {
   
}