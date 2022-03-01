const assert = require('assert');
const expect = require('chai').expect;
const {skipResponseWithCookie} = require('../api');
const {successStatus, badRequestStatus} = require('../constant/responseStatus');
const {skipSuccessful, badRequest} = require('../constant/responseMessage');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /skip', function () {
    it('check when sentence id is zero', async () => {
        const body = {
            "language": "Hindi",
            "sentenceId": 0,
            "userName": "name",
            "fromLanguage": "English",
            "state_region": "Punjab",
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
            "language": "Hindi",
            "sentenceId": 500492,
            "userName": "name",
            "fromLanguage": "English",
            "state_region": "Punjab",
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
            "language": "Hindi",
            "sentenceId": 500492,
            "userName": "name",
            "fromLanguage": "English",
            "state_region": "Punjab",
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
            "language": "Hindi",
            "sentenceId": 500492,
            "userName": "name",
            "fromLanguage": "English",
            "state_region": "Punjab",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "invalid"
        }
        const resp = await skipResponseWithCookie(body);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
});