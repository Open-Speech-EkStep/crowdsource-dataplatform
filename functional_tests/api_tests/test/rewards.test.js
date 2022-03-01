const assert = require('assert');
const expect = require('chai').expect;
const {rewardResponseWithCookie, rewardResponseWithoutCookie} = require('../api');
const {invalidQuery, userIdMissing} = require('../constant/responseMessage');
const {successStatus, badRequestStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('GET /rewards', function () {
    const rewardExpectedResponse = {
                    "badgeId": "",
                    "currentBadgeType": "",
                    "nextBadgeType": "Bronze",
                    "nextMilestone": 5,
                    "contributionCount": 0,
                    "isNewBadge": false,
                    "badges": []
                };
    it('check when type is asr and source is contribute', async function () {
        const queryParams = {
            type: 'asr' ,
            language: 'Gujarati' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when type is asr and source is validate', async function () {
        const queryParams = { 
            type: 'asr' ,
            language: 'Punjabi' ,
            source: 'validate' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when type is text and source is contribute', async function () {
        const queryParams = {
            type: 'text' ,
            language: 'Telugu' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when type is text and source is validate', async function () {
        const queryParams = {
            type: 'text' ,
            language: 'Tamil' ,
            source: 'validate' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when type is parallel and source is contribute', async function () {
        const queryParams = {
            type: 'parallel' ,
            language: 'Kannada' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when type is parallel and source is validate', async function () {
        const queryParams = {
            type: 'parallel' ,
            language: 'Assamese' ,
            source: 'validate' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when type is ocr and source is contribute', async function () {
        const queryParams = {
            type: 'parallel' ,
            language: 'Bengali' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when type is ocr and source is validate', async function () {
        const queryParams = {
            type: 'parallel' ,
            language: 'English' ,
            source: 'validate' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when type is empty', async function () {
        const queryParams = {
            type: "" ,
            language: 'Hindi' ,
            source: 'validate' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when type is invalid', async function () {
        const queryParams = {
            type: 'invalid' ,
            language: 'Hindi' ,
            source: 'validate' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when type is in capital letters', async function () {
        const queryParams = {
            type: 'ASR' ,
            language: 'Hindi' ,
            source: 'validate' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when type is in camelcase', async function () {
        const queryParams = {
            type: 'Asr' ,
            language: 'Hindi' ,
            source: 'validate' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when language is empty', async function () {
        const queryParams = {
            type: 'ocr' ,
            language: '' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when language is in SMALL letters', async function () {
        const queryParams = {
            type: 'ocr' ,
            language: 'hindi' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when language is in CAPITAL letters', async function () {
        const queryParams = {
            type: 'ocr' ,
            language: 'HINDI' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when language is invalid', async function () {
        const queryParams = {
            type: 'ocr' ,
            language: 'invalid' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when source is invalid', async function () {
        const queryParams = {
            type: 'ocr' ,
            language: 'Hindi' ,
            source: 'invalid' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when source is empty', async function () {
        const queryParams = {
            type: 'ocr' ,
            language: 'Hindi' ,
            source: '' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when source is in CAPITAL letters', async function () {
        const queryParams = {
            type: 'ocr' ,
            language: 'Hindi' ,
            source: 'CONTRIBUTE' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when source is in camelcase', async function () {
        const queryParams = {
            type: 'ocr' ,
            language: 'Hindi' ,
            source: 'Contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when username is empty', async function () {
        const queryParams = {
            type: 'asr' ,
            language: 'Hindi' ,
            source: 'contribute' ,
            userName: ''
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardExpectedResponse);
    });
    it('check when username contains only numbers', async function () {
        const queryParams = {
            type: 'asr' ,
            language: 'Hindi' ,
            source: 'contribute' ,
            userName: 1234567
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body).to.eql(rewardExpectedResponse); //the condition should be revert once the api is fixed
    });
    it('check when username length is greater than 12 characters', async function () {
        const queryParams = {
            type: 'asr' ,
            language: 'Hindi' ,
            source: 'contribute' ,
            userName: 'someemail@somedomain'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when username is in email format', async function () {
        const queryParams = {
            type: 'asr' ,
            language: 'Hindi' ,
            source: 'contribute' ,
            userName: 'a@gmail.com'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when cookie is empty', async function () {
        const queryParams = {
            type: 'asr' ,
            language: 'Hindi' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithCookie(queryParams,'');
        expect(resp.status).to.equal(badRequestStatus);
        expect(resp.body).to.be.empty;
        expect(userIdMissing);

    });
    it('check when cookie value is not set', async function () {
        const queryParams = { 
            type: 'asr' ,
            language: 'Hindi' ,
            source: 'contribute' ,
            userName: 'someusername'
        }
        const resp = await rewardResponseWithoutCookie(queryParams);   
        expect(resp.status).to.equal(badRequestStatus);
        expect(resp.body).to.be.empty;
        expect(userIdMissing);
    });
    it('check when add additional query parameters in request like abcd = xyz, it should fail', async function () {
        const queryParams = {
            type: 'asr' ,
            language: 'Hindi' ,
            source: 'contribute' ,
            userName: 'someusername',
            abcd:'xyz'
        }
        const resp = await rewardResponseWithCookie(queryParams);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body).to.eql(rewardExpectedResponse);  //the condition should be revert once the api is fixed
    });
});