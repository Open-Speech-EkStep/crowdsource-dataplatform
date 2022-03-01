const supertest = require('supertest')
let api_test_url = "";

if (process.env.ENV === "") {
    api_test_url = "https://test-api.vakyansh.in"
}
else {
    api_test_url = "https://" + process.env.ENV + "-api.vakyansh.in"
}

let baseURL = supertest(api_test_url);

module.exports = { baseURL, api_test_url }