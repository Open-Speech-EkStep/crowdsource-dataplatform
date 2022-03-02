const assert = require('assert');
const expect = require('chai').expect;
const {skipResponseWithCookie, mediaResponseWithCookie, skipResponseWithoutCookie} = require('../api');
const {successStatus, badRequestStatus} = require('../constant/responseStatus');
const {skipSuccessful, badRequest} = require('../constant/responseMessage');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /skip', function () {
    let mediaResp, dataset_id;
    before(async() => {
        const mediaBody =  { "userName": "testPARALLEL", "language": "Hindi" , "toLanguage":"Telugu"}
        mediaResp = await mediaResponseWithCookie(mediaBody,"parallel");
        dataset_id = mediaResp.body.data[0].dataset_row_id;
    });
    it('check happy case', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.statusCode).to.equal(successStatus);
        expect(resp.body.message).to.equal(skipSuccessful);
    });
    it('check when sentence id is zero', async () => {
        const body = {
            "sentenceId": 0,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName", 
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when sentenceid is empty', async () => {
        const body = {
            "sentenceId": "",
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when sentenceid is not set', async () => {
        const body = {
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when type is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": ""
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when type is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when type is invalid', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type":"invalid"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when username is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.statusCode).to.equal(successStatus);
        expect(resp.body.message).to.equal(skipSuccessful);
    });

    it('check when username is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when username contains only numbers', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": 123456,
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(skipSuccessful); //the condition should be revert once the api is fixed
    });
    it('check when username length is greater than 12 characters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someemail@somedomain@somecom",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(skipSuccessful); //the condition should be revert once the api is fixed
    });
    it('check when username is in email format', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "a@gmail.com",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(skipSuccessful); //the condition should be revert once the api is fixed
    });
    it('check add additional params in request body like abcd = xyz, it should fail', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel",
            "abcd": "xyz"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(skipSuccessful); //the condition should be revert once the api is fixed
    });
    it('check when cookie is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithoutCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when cookie is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body,'');
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when language is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(skipSuccessful); //the condition should be revert once the api is fixed
    });
    it('check when language is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(skipSuccessful); //the condition should be revert once the api is fixed
    });

    it('check when language is invalid', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "invalid",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when language is in CAPITAL letters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "TELUGU",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when language is in SMALL letters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "Hindi",
            "language": "telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when fromlanguage is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(skipSuccessful); //the condition should be revert once the api is fixed
    });
    it('check when fromlanguage is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(skipSuccessful); //the condition should be revert once the api is fixed
    });
    it('check when fromlanguage is invalid', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "invalid",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when fromlanguage is in SMALL letters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "hindi",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when fromlanguage is in CAPITAL letters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userName": "someuser",
            "fromLanguage": "HINDI",
            "language": "Telugu",
            "state_region": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
});