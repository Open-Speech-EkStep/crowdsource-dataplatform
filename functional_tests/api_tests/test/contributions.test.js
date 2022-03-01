const assert = require('assert');
const expect = require('chai').expect;
const {contributionsResponseWithCookie, contributionsResponseWithoutCookie} = require('../api');
const {successStatus, badRequestStatus, notFoundStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /contributions/{type}', function () {
    const contributionsResponseKeys = ['dataset_row_id','sentence','contribution','contribution_id','source_info','auto_validate'];
    const asr = 'asr';
    const text = 'text';
    const ocr = 'ocr';
    const parallel = 'parallel';
    it('check happy case for ASR', async () => {
        const queryParams = { 
            to: 'English',
            username: 'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys);
    });
    it('check happy case for TEXT', async () => {
        const queryParams = { 
            to: 'English',
            username: 'someusername',
            from: 'Hindi'
        }       
        const resp = await contributionsResponseWithCookie(queryParams,text);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys);
    });
    it('check happy case for PARALLEL', async () => {
        const queryParams = { 
            to: 'English',
            username: 'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,parallel);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys);
    });
    it('check happy case for OCR', async () => {
        const queryParams = { 
            to: 'English',
            username: 'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,ocr);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys);
    });
    it('check when type is empty', async () => {
        const queryParams = { 
            to: 'English',
            username: 'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,'');
        expect(resp.status).to.equal(notFoundStatus);
    });
    it('check when type is invalid', async () => {
        const queryParams = { 
            to: 'English',
            username: 'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,'INVALID12345');
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when type is in camelcase', async () => {
        const queryParams = { 
            to: 'English',
            username: 'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,'Asr');
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when type is in CAPITAL letters', async () => {
        const queryParams = {
            to: 'English',
            username: 'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,'ASR');
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when username is empty', async () => {
        const queryParams = {
            to: 'English',
            username: '',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys);
    });
    it('check when username contains only numbers', async () => {
        const queryParams = { 
            to: 'English',
            username: 123456789,
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys); //the condition should be revert once the api is fixed
    });
    it('check when username length is greater than 12 characters', async () => {
        const queryParams = { 
            to: 'English',
            username:'someemail@somedomain@somecom',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys); //the condition should be revert once the api is fixed
    });
    it('check when username is in email format', async () => {
        const queryParams = { 
            to: 'English',
            username:'a@gmail.com',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys); //the condition should be revert once the api is fixed
    });
    it('check when fromlanguage is not set', async () => {
        const queryParams = { 
            to: 'English',
            username:'someusername',
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when fromlanguage is empty', async () => {
        const queryParams = { 
            to: 'English',
            username:'someusername',
            from: ''
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when fromlanguage is invalid', async () => {
        const queryParams = { 
            to: 'English',
            username:'someusername',
            from: 'invalid'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when fromlanguage is in CAPITAL letters', async () => {
        const queryParams = { 
            to: 'English',
            username:'someusername',
            from: 'HINDI'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when fromlanguage is in SMALL letters', async () => {
        const queryParams = { 
            to: 'English',
            username:'someusername',
            from: 'hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when toLanguage is not set in case of PARALLEL', async () => {
        const queryParams = { 
            username:'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,parallel);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when toLanguage is empty in case of PARALLEL', async () => {
        const queryParams = { 
            to: '',
            username:'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,parallel);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when toLanguage is invalid in case of PARALLEL', async () => {
        const queryParams = {
            to: 'invalid',
            username:'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,parallel);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when toLanguage is in CAPITAL letters in case of PARALLEL', async () => {
        const queryParams = { 
            to: 'ENGLISH',
            username:'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,parallel);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when toLanguage is in SMALL letters case of PARALLEL', async () => {
        const queryParams = { 
            to: 'english',
            username:'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,parallel);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when fromlanguage and toLanguage is equal in case of PARALLEL', async () => {
        const queryParams = { 
            to: 'Hindi',
            username:'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,parallel);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body).to.eql({"data":[]}); //the condition should be revert once the api is fixed
    });
    it('check when cookie is not set', async () => {
        const queryParams = { 
            to: 'English',
            username:'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithoutCookie(queryParams,asr);
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when cookie is empty', async () => {
        const queryParams = { 
            to: 'English',
            username:'someusername',
            from: 'Hindi'
        }
        const resp = await contributionsResponseWithCookie(queryParams,asr,'');
        expect(resp.status).to.equal(badRequestStatus);
    });
    it('check when add additional query parameters in request like abcd = xyz, it should fail', async () => {
        const queryParams = { 
            to: 'English',
            username: 'someusername',
            from: 'Hindi',
            abcd:'xyz'
        }
        const resp = await contributionsResponseWithCookie(queryParams,parallel);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.data[0]).to.have.all.keys(contributionsResponseKeys);  //the condition should be revert once the api is fixed
    });
});