const assert = require('assert');
const expect = require('chai').expect;
const {rewardInfoResponse} = require('../api');
const {invalidQuery, dataNotFound} = require('../constant/responseMessage');
const {successStatus, badRequestStatus, notFoundStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('GET /rewards-info', function () {
    const rewardInfoExpectedResponse = [
                        {
                            "contributions": 5,
                            "badge": "Bronze"
                        },
                        {
                            "contributions": 50,
                            "badge": "Silver"
                        },
                        {
                            "contributions": 200,
                            "badge": "Gold"
                        },
                        {
                            "contributions": 600,
                            "badge": "Platinum"
                        }
                    ];
    it('check when type is asr and source is contribute', async function () {
        const queryParams = { 
            type: 'asr' ,
            language: 'Hindi' ,
            source: 'contribute' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when type is asr and source is validate', async function () {
        const queryParams = { 
            type: 'asr' ,
            language: 'Tamil' ,
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when type is text and source is contribute', async function () {
        const queryParams = { 
            type: 'text' ,
            language: 'Kannada' ,
            source: 'contribute' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when type is text and source is validate', async function () {
        const queryParams = { 
            type: 'text',
            language: 'Punjabi',
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });

    it('check when type is parallel and source is contribute', async function () {
        const queryParams = { 
            type: 'parallel' ,
            language: 'Assamese' ,
            source: 'contribute' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when type is parallel and source is validate', async function () {
        const queryParams = { 
            type: 'parallel' ,
            language: 'English' ,
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when type is ocr and source is contribute', async function () {
        const queryParams = { 
            type: 'ocr' ,
            language: 'Odia' ,
            source: 'contribute'  
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when type is ocr and source is validate', async function () {
        const queryParams = { 
            type: 'ocr' ,
            language: 'Bengali' ,
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when type is empty', async function () {
        const queryParams = { 
            type: "",
            language: 'Bengali',
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when type is not set', async function () {
        const queryParams = { 
            language: 'Bengali',
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when type is invalid', async function () {
        const queryParams = { 
            type: 'invalid',
            language: 'Malayalam',
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when type is in capital letters', async function () {
        const queryParams = { 
            type: 'OCR',
            language: 'Gujarati',
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when type is in camelcase', async function () {
        const queryParams = { 
            type: 'Ocr',
            language: 'Gujarati',
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when language is empty', async function () {
        const queryParams = { 
            type: 'ocr',
            language: "",
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when language is not set', async function () {
        const queryParams = { 
            type: 'ocr',
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when language is invalid', async function () {
        const queryParams = { 
            type: 'ocr',
            language: 'invalid',
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(notFoundStatus);
        expect(dataNotFound);
    });
    it('check when language is in capital letters', async function () {
        const queryParams = { 
            type: 'ocr',
            language: "TELUGU",
            source: 'validate'
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when language is in small letters', async function () {
        const queryParams = { 
            type: 'ocr',
            language: "telugu",
            source: 'validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.eql(rewardInfoExpectedResponse);
    });
    it('check when source is empty', async function () {
        const queryParams = { 
            type: 'ocr',
            language: 'Kananda',
            source: "" 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when source is not set', async function () {
        const queryParams = { 
            type: 'ocr',
            language: 'Kannada'
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when source is invalid', async function () {
        const queryParams = { 
            type: 'ocr',
            language: 'Kannada',
            source: 'invalid' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when source is in capital letters', async function () {
        const queryParams = { 
            type: 'ocr',
            language: 'Gujarati',
            source: 'VALIDATE' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when source is in camelcase', async function () {
        const queryParams = { 
            type: 'ocr',
            language: 'Gujarati',
            source: 'Validate' 
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidQuery);
    });
    it('check when add additional query parameters in request like abcd = xyz, it should fail', async function () {
        const queryParams = { 
            type: 'ocr',
            language: 'Gujarati',
            source: 'validate' ,
            abcd: 'xyz'
        }
        const resp = await rewardInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);   //the condition should be revert once the api is fixedv
        expect(resp.body).to.eql(rewardInfoExpectedResponse);  //the condition should be revert once the api is fixed
    });
});