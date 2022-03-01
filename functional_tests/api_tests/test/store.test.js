const assert = require('assert');
const expect = require('chai').expect;
const {storeResponseWithCookie} = require('../api');
const {internalServerError} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /store', function () {
    it('check when sentence id is zero', async () => {
        const body = {
            "sentenceId": 0,
            "userInput": "text contribution",
            "speakerDetails": 
            {
              "userName": "name",
              "motherTongue": "Hindi",
              "gender": "Male",
              "age": "upto 10"
            },
            "language": "English",
            "state": "Punjab",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "ocr"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(internalServerError);
    });
    it('check when sentence id is empty', async () => {
        const body = {
            "sentenceId": "",
            "userInput": "text contribution",
            "speakerDetails": 
            {
              "userName": "name",
              "motherTongue": "Hindi",
              "gender": "Male",
              "age": "upto 10"
            },
            "language": "English",
            "state": "Punjab",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "ocr"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(internalServerError);
    });
    it('check when sentence id is not set', async () => {
        const body = {
            "userInput": "text contribution",
            "speakerDetails": 
            {
              "userName": "name",
              "motherTongue": "Hindi",
              "gender": "Male",
              "age": "upto 10"
            },
            "language": "English",
            "state": "Punjab",
            "country": "India",
            "device": "deviceName",
            "browser": "browserName",
            "type": "ocr"
        } 
        const resp = await storeResponseWithCookie(body);
        expect(resp.status).to.equal(internalServerError);
    });
});