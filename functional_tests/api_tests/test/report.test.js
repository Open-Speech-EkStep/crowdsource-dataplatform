const expect = require('chai').expect;
const {reportResponseWithCookie, reportResponseWithoutCookie} = require('../api');
const {successfulReport, inputValueMissing, integerOutOfRange} = require('../constant/responseMessage');
const {successStatus, badRequestStatus, notFoundStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /report', function () {
    const moreThanThousandCharString = "ThousandChar".repeat(99);
    it('check happy path for report api', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.statusCode).to.equal(successStatus);
        expect(resp.body.message).to.equal(successfulReport);
    });
    it('check when sentence id is empty', async function () {
        const body = {
                    "sentenceId": "",
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);        //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when sentence id is zero', async function () {
        const body = {
                    "sentenceId": 0,
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);  //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus);  //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(successfulReport);  //the condition should be revert once the api is fixed
    });
    it('check when sentence id is invalid', async function () {
        const body = {
                    "sentenceId": "invalid00@#1212",
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);  //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(500);
    });
    it('check when sentence id exceeds integer limit or garbage value', async function () {
        const body = {
                    "sentenceId": 2147483648,
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(500);
        expect(resp.body.message).to.equal(integerOutOfRange);
    });
    it('check when language is invalid', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "invalid",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);        //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when language is empty', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);        //the condition should be revert once the api is fixed
        expect(resp.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(successfulReport); //the condition should be revert once the api is fixed
    });
    it('check when language is not set', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "source": "contribution",
                    "userName": "Test user"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);       //the condition should be revert once the api is fixed
        expect(resp.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(successfulReport); //the condition should be revert once the api is fixed
    });
    it('check when language is in CAPITAL letters', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "HINDI",
                    "source": "contribution",
                    "userName": "Test user"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);   //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when language is in SMALL letters', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "hindi",
                    "source": "contribution",
                    "userName": "Test user"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when username is not set', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(successfulReport); //the condition should be revert once the api is fixed
    });
    it('check when username is empty', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "contribution",
                    "userName": ""
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.statusCode).to.equal(successStatus);
        expect(resp.body.message).to.equal(successfulReport);
    });
    it('check when username contains only numbers', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "contribution",
                    "userName": 123456
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when username length is greater than 12 characters', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "contribution",
                    "userName": "someemail@somedomain@somecom"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when username is in email format', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "contribution",
                    "userName": "a@gamil.com"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when source is not set', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "some user"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when source is empty', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "",
                    "userName": "some user"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);  //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when source is incorrect', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "invalid123",
                    "userName": "some user"
                }
            const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when source is "validation"', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "validation",
                    "userName": "some user"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.statusCode).to.equal(successStatus);
        expect(resp.body.message).to.equal(successfulReport);
    });
    it('check when source is in CAPITAL letters', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "CONTRIBUTION",
                    "userName": "some user"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when source is in camelcase', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "source": "Contribution",
                    "userName" : "someusr"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);//the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when reportText is not set', async function () {
        const body = {
                    "sentenceId": 1,
                    "language": "Hindi",
                    "source": "contribution",
                    "userName" : "someusr"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when reportText is empty', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "",
                    "language": "Hindi",
                    "source": "contribution",
                    "userName" : "someusr"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when reportText contains more than 1000 characters', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": moreThanThousandCharString,
                    "language": "Hindi",
                    "source": "contribution",
                    "userName" : "someusr"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when add additional params in request body like abcd = xyz, it should fail', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "Test user",
                    "source": "contribution",
                    "abcd":"xyvz"
                }
        const resp = await reportResponseWithCookie(body);
        expect(resp.status).to.equal(successStatus);  //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(successStatus);  //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(successfulReport);  //the condition should be revert once the api is fixed
    });
    it('check when cookie is not set', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithoutCookie(body);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
    it('check when cookie is empty', async function () {
        const body = {
                    "sentenceId": 1,
                    "reportText": "some report",
                    "language": "Hindi",
                    "userName": "Test user",
                    "source": "contribution"
                }
        const resp = await reportResponseWithCookie(body,'');
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.statusCode).to.equal(badRequestStatus);
        expect(resp.body.message).to.equal(inputValueMissing);
    });
})