const assert = require('assert');
const expect = require('chai').expect;
const {badRequest, parameterMissing} = require('../constant/responseMessage');
const {mediaResponseWithCookie, mediaResponseWithoutCookie} = require('../api');
const {successStatus, badRequestStatus, notFoundStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /media/{type}', function () {
    const mediaResponsekeys =['dataset_row_id', 'media_data', 'source_info'];
    const asr = 'asr';
    const text = 'text';
    const ocr = 'ocr';
    const parallel = 'parallel';
    it('check happy case for ASR', async () => {
        const body = { "userName": "testASR", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys);
    });
    it('check happy case for TEXT', async () => {
        const body = { "userName": "testTEXT", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,text);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys);
    });
    it('check happy case for OCR', async () => {
        const body = { "userName": "testOCR", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,ocr);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys);
    });
    it('check happy case for PARALLEL', async () => {
        const body = { "userName": "testPARALLEL", "language": "Hindi" , "toLanguage":"Telugu"}
        const resp = await mediaResponseWithCookie(body,parallel);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys);
    });
    it('check when type is empty', async () => {
        const body = { "userName": "testTYPE", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,'');
        expect(resp.status).to.equal(notFoundStatus);
    });
    it('check when type is invalid', async () => {
        const body = { "userName": "testTYPE", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,"INVALID12345");
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when type is camelcase', async () => {
        const body = { "userName": "testTYPE", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,'Asr');
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when type is in CAPITAL letters', async () => {
        const body = { "userName": "testTYPE", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,'ASR');
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when username is empty', async () => {
        const body = { "userName": "", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys)
    });
    it('check when username contains only numbers', async () => {
        const body = { "userName":123456789 , "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check when username length is greater than 12 characters', async () => {
        const body = { "userName":"someemail@somedomain@somecom" , "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when username is in email format', async () => {
        const body = { "userName":"a@gmail.com" , "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when language is not set', async () => {
        const body = { "userName": "test" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when language is empty', async () => {
        const body = { "userName": "test", "language": "" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check when language is invalid', async () => {
        const body = { "userName": "test", "language": "invalid" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body).to.eql({"data":[]}); //the condition should be revert once the api is fixed
    });
    it('check when language is in CAPITAL letters', async () => {
        const body = { "userName": "test", "language": "HINDI" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body).to.eql({"data":[]}); //the condition should be revert once the api is fixed
    });
    it('check when language is in SMALL letters', async () => {
        const body = { "userName": "test", "language": "hindi" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body).to.eql({"data":[]}); //the condition should be revert once the api is fixed
    });
    it('check when toLanguage is not set in case of PARALLEL', async () => {
        const body = { "userName": "test", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,parallel);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check when toLanguage is empty in case of PARALLEL', async () => {
        const body = { "userName": "test", "language": "Hindi", "toLanguage":"" }
        const resp = await mediaResponseWithCookie(body,parallel);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check when toLanguage is invalid in case of PARALLEL', async () => {
        const body = { "userName": "test", "language": "Hindi", "toLanguage": "invalid" }
        const resp = await mediaResponseWithCookie(body,parallel);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check when toLanguage is in CAPITAL letters in case of PARALLEL', async () => {
        const body = { "userName": "test", "language": "Hindi", "toLanguage": "TELUGU" }
        const resp = await mediaResponseWithCookie(body,parallel);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check when toLanguage is in SMALL letters in case of PARALLEL', async () => {
        const body = { "userName": "test", "language": "Hindi", "toLanguage": "telugu" }
        const resp = await mediaResponseWithCookie(body,parallel);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check when language and toLanguage is equal in case of PARALLEL', async () => {
        const body = { "userName": "test", "language": "Hindi", "toLanguage": "Hindi" }
        const resp = await mediaResponseWithCookie(body,parallel);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check when cookie is not set', async () => {
        const body = { "userName": "testASR", "language": "Hindi" }
        const resp = await mediaResponseWithoutCookie(body,asr);
        expect(resp.status).to.equal(badRequestStatus);
        expect(resp.body.error).to.equal(parameterMissing);
    });
    it('check when cookie is empty', async () => {
        const body = { "userName": "testASR", "language": "Hindi" }
        const resp = await mediaResponseWithCookie(body,asr,'');
        expect(resp.status).to.equal(badRequestStatus);
        expect(resp.body.error).to.equal(parameterMissing);
    });
    it('when add additional params in request body like abcd = xyz, it should fail', async () => {
        const body = { "userName": "testASR", "language": "Hindi", "abcd":"xyz" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check when age is empty', async () => {
        const body = { "userName": "testASR", "language": "Hindi", "age":'' }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys);
    });
    it('check when age is invalid', async () => {
        const body = { "userName": "testASR", "language": "Hindi", "age":'garbageValue123' }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys); //the condition should be revert once the api is fixed
    });
    it('check with valid age ', async () => {
        const body = { "userName": "testASR", "language": "Hindi", "age": "upto 10" }
        const resp = await mediaResponseWithCookie(body,asr);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(mediaResponsekeys);
    });
});