const assert = require('assert');
const expect = require('chai').expect;
const {feedbackResponseWithCookie} = require('../api');
const {successfulFeedback,badRequest} = require('../constant/responseMessage');
const {successStatus, badRequestStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /feedback', function () {
    const moreThanFiftyCharString = "FiftyChar".repeat(6);
    const moreThanTwentyCharString = "TwentyChar".repeat(3);
      it('check happy path for feedback', async function () {
       const body = {
        "feedback": "some feedback",
        "category": "some category",
        "language": "Hindi",
        "email": "some@email",
        "module": "tts",
        "target_page": "home",
        "opinion_rating": 1,
        "recommended": "yes",
        "revisit": "no"
        }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(successfulFeedback);
    });
    it('check Feedback without feedback', async () => {
        const body = {
                "feedback": "",
                "category": "some category",
                "language": "Hindi",
                "email": "some@email",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 5,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(successfulFeedback);
    });
    it('check Feedback without category', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "",
                "language": "Hindi",
                "email": "some@email",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 5,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(successfulFeedback);
    });
    it('check Feedback without email', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 5,
                "recommended": "yes",
                "revisit": "maybe"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with "Anonymous" email', async () => {
        const body ={
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "Anonymous",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 5,
                "recommended": "yes",
                "revisit": "maybe"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(successfulFeedback);
    });
    it('check Feedback with email length more than 12 characters', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someemail@somedomain.somecom",
                "module": "asr",
                "target_page": "home",
                "opinion_rating": 5,
                "recommended": "maybe",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with email in email format', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "a@gmail.com",
                "module": "asr",
                "target_page": "home",
                "opinion_rating": 5,
                "recommended": "maybe",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body)
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback without target page', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": "asr",
                "target_page": "",
                "opinion_rating": 1,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with target page having length more than 50 characters', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": "text",
                "target_page": moreThanFiftyCharString,
                "opinion_rating": 2,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback without module', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Assamese",
                "email": "someone",
                "module": "",
                "target_page": "home",
                "opinion_rating": 1,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with module having length more than 20 characters', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": moreThanTwentyCharString,
                "target_page": "home",
                "opinion_rating": 2,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback without opinion rating', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": "",
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with opinion rating other than 1-5', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 10,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with invalid Language ', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "invalid",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 3,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback without Language ', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 3,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with Language in CAPITAL letters', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "ENGLISH",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 3,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with Language in SMALL letters', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "english",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 3,
                "recommended": "yes",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback with invalid recommend ', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Bengali",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 4,
                "recommended": "invalid",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback without recommend ', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "English",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 4,
                "recommended": "",
                "revisit": "no"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(successfulFeedback);
    });
    it('check Feedback with invalid revisit ', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 2,
                "recommended": "yes",
                "revisit": "invalid"
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check Feedback without revisit ', async () => {
        const body = {
                "feedback": "some feedback",
                "category": "some category",
                "language": "Hindi",
                "email": "someone",
                "module": "tts",
                "target_page": "home",
                "opinion_rating": 2,
                "recommended": "yes",
                "revisit": ""
            }
        const resp = await feedbackResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(successfulFeedback);
    });
});
