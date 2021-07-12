const fetch = require('./fetch')

const getBadgesForUser = () => {
    const details = localStorage.getItem("speakerDetails");
    const username = details.userName ?? '';
    fetch(`/user-rewards/${username}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    })
    .then((res) => res.json())
    .then((result) => {
        console.log(result);
    });
}

$(document).ready(() => {
    getBadgesForUser();
})