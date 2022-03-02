const assert = require('assert');
const expect = require('chai').expect;
const {validateResponseWithCookie} = require('../api');
const {successStatus, badRequestStatus} = require('../constant/responseStatus');
const {validateSuccesful, invalidParam} = require('../constant/responseMessage');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /validate/{contributionId}/{action}', function () {
    const skip = "skip";
    const accept = "accept";
    const reject = "reject";
    it('check when action is skip', async () => {
        const body = {
            "sentenceId": 1592864,
            "state": "Punjab",
            "country": "India",
            "userName": "name",
            "device": "device",
            "browser": "browser_name",
            "type": "text",
            "fromLanguage": "Gujarati",
            "language": "English"
        }
        const resp = await validateResponseWithCookie(body,2331659,skip);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(validateSuccesful);
    });
    it('check when sentence id is empty', async () => {
        const body = {
            "sentenceId": "",
            "state": "Punjab",
            "country": "India",
            "userName": "name",
            "device": "device",
            "browser": "browser_name",
            "type": "text",
            "fromLanguage": "Gujarati",
            "language": "English"
        }
        const resp = await validateResponseWithCookie(body,52333,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when sentence id is zero', async () => {
        const body = {
            "sentenceId": 0,
            "state": "Punjab",
            "country": "India",
            "userName": "name",
            "device": "device",
            "browser": "browser_name",
            "type": "text",
            "fromLanguage": "Gujarati",
            "language": "English"
        }
        const resp = await validateResponseWithCookie(body,52333,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
});