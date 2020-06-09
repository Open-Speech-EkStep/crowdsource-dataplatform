const submitQueryBtn = document.getElementById("submitQuery");
const email = document.getElementById("email");
const query = document.getElementById("query");

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    types: [
        {
            type: 'success',
            className: "fnt-1-5"
        },
        {
            type: 'error',
            className: "fnt-1-5"
        }
    ]
});

submitQueryBtn.addEventListener("click", event => {
    if (!email.value || !query.value) {
        notyf.error({ message: 'Please fill out all the required fields' });
        return;
    }
    submitQuery(JSON.stringify({
        email: email.value,
        query: query.value
    }))
})
const submitQuery = (queryText) => {
    fetch("/contact-us", {
        method: "POST",
        body: queryText,
        headers: {
            'Content-Type': 'application/json'
          },
    })
        .then(res => res.json())
        .then(result => {
            if(result.success)
            {
                notyf.success('Your query has been submitted. Our Team will reach out to you soon');
                email.value="";
                query.value="";
            }
        })
        .catch(err => {
            console.log(err)
            notyf.error('An error occured while submitting your request. Please try after some time');
        })
}