
var assert = require('assert');
var expect = require('chai').expect;
const { baseURL,api_test_url } = require('../config/config')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


describe('POST /Feedback', function () {
    const feedback = "/feedback";

    it('check happy path for feedback', async function () {
        const resp = await baseURL.post(feedback)
            .send({
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someemail@somedomain.somecom",
                "module": "suno",
                "target_page": "home",
                "opinion_rating": 1,
                "recommended": "yes",
                "revisit": "no"
            })
            .set('Content-type', 'application/json')
        expect(resp.status).to.equal(200);
        console.log(api_test_url,process.env.ENV);
        expect(resp.body.message).to.equal("Feedback submitted successfully.")

    });

    it('check Feedback without email', async () => {
        const resp = await baseURL.post(feedback)
            .send({
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "",
                "module": "suno",
                "target_page": "home",
                "opinion_rating": 1,
                "recommended": "yes",
                "revisit": "no"
            })
            .set('Content-type', 'application/json')
        expect(resp.status).to.equal(400);
    });

    it('check Feedback without module', async () => {
        const resp = await baseURL.post(feedback)
            .send({
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": "",
                "target_page": "home",
                "opinion_rating": 1,
                "recommended": "yes",
                "revisit": "no"
            })
            .set('Content-type', 'application/json')
        expect(resp.status).to.equal(400);

    });


    it('check Feedback without opinion rating', async () => {
        const resp = await baseURL.post(feedback)
            .send({
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": "suno",
                "target_page": "home",
                "opinion_rating": "",
                "recommended": "yes",
                "revisit": "no"
            })
            .set('Content-type', 'application/json')
        expect(resp.status).to.equal(400);
    });


    it('check Feedback with invalid Language ', async () => {
        const resp = await baseURL.post(feedback)
            .send({
                "feedback": "some feedback",
                "category": "some category",
                "language": "sa",
                "email": "someone",
                "module": "suno",
                "target_page": "home",
                "opinion_rating": "4",
                "recommended": "yes",
                "revisit": "no"
            })
            .set('Content-type', 'application/json')
        expect(resp.status).to.equal(400);

    });

});
