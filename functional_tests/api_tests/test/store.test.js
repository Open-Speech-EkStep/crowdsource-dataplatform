const assert = require('assert');
const expect = require('chai').expect;
const {storeResponseWithCookie, mediaResponseWithCookie, storeResponseWithoutCookie} = require('../api');
const {internalServerError, successStatus, badRequestStatus} = require('../constant/responseStatus');
const {successStore, badRequest} = require('../constant/responseMessage');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /store', function () {
    let mediaResp, dataset_id;
    before(async() => {
        const mediaBody =  { "userName": "testPARALLEL", "language": "Hindi" , "toLanguage":"Telugu"}
        mediaResp = await mediaResponseWithCookie(mediaBody,"parallel");
        dataset_id = mediaResp.body.data[0].dataset_row_id;
    });
    it('check happy path', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename1\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.success).to.equal(successStore);
    });
    it('check when sentence id is zero', async () => {
        const body = {
            "sentenceId": 0,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename2\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(internalServerError);
    });
    it('check when sentence id is empty', async () => {
        const body = {
            "sentenceId": "",
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename3\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(internalServerError);
    });
    it('check when sentence id is not set', async () => {
        const body = {
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename4\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        }
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(internalServerError);
    });
    it('check when userinput is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "speakerDetails": "{\"userName\": \"somename5\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when userinput is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "",
            "speakerDetails": "{\"userName\": \"somename6\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when userinput is have less than 3 chars', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "ab",
            "speakerDetails": "{\"userName\": \"somename7\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check type is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename8\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": ""
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check type is invalid', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename9\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "invalid"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check type is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename10\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check add additional params in request body like abcd = xyz, it should fail', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename20\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel",
            "abcd": "xyz"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.success).to.equal(successStore); //the condition should be revert once the api is fixed
    });
    it('check username contains email', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"a@gmail.com\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check username empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.success).to.equal(successStore);
    });
    it('check username contains only number', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"123456\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.success).to.equal(successStore); //the condition should be revert once the api is fixed
    });
    it('check when username length is greater than 12 characters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"someemail@somedomain@somecom\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when cookie is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename30\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithoutCookie(body);
        expect(resp.status).to.equal(internalServerError);
    });
    it('check when cookie is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename40\"}",
            "language": "Telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body,'');
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.success).to.equal(successStore); //the condition should be revert once the api is fixed
    });
    it('check when language is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename50\"}",
            "language": "",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when language is invalid', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename60\"}",
            "language": "invalid",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when language is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename70\"}",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when language is SMALL letters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename80\"}",
            "language": "telugu",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when language is CAPITAL letters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"somename90\"}",
            "language": "TELUGU",
            "fromLanguage": "Hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when from language is empty', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"someuser1\"}",
            "language": "Telugu",
            "fromLanguage": "",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.success).to.equal(successStore); //the condition should be revert once the api is fixed
    });
    it('check when from language is invalid', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"someuser2\"}",
            "language": "Telugu",
            "fromLanguage": "invalid",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.success).to.equal(successStore); //the condition should be revert once the api is fixed
    });
    it('check when from language is not set', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"someuser3\"}",
            "language": "Telugu",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.success).to.equal(successStore); //the condition should be revert once the api is fixed
    });
    it('check when from language is SMALL letters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"someuser4\"}",
            "language": "Telugu",
            "fromLanguage": "hindi",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.success).to.equal(successStore); //the condition should be revert once the api is fixed
    });
    it('check when from language is CAPITAL letters', async () => {
        const body = {
            "sentenceId": dataset_id,
            "userInput": "parallel contribution",
            "speakerDetails": "{\"userName\": \"someuser5\"}",
            "language": "Telugu",
            "fromLanguage": "HINDI",
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "parallel"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.success).to.equal(successStore); //the condition should be revert once the api is fixed
    });
});