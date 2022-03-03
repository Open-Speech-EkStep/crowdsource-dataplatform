const assert = require('assert');
const expect = require('chai').expect;
const {validateResponseWithCookie, contributionsResponseWithCookie, validateResponseWithoutCookie} = require('../api');
const {successStatus, badRequestStatus} = require('../constant/responseStatus');
const {validateSkipSuccesful, validateSuccesful, invalidParam} = require('../constant/responseMessage');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('POST /validate/{contributionId}/{action}', function () {
    const skip = "skip";
    const accept = "accept";
    const reject = "reject";
    let contributionResp, datasetId, contributionId;
    before(async() => {
        const contributionParams = { to: 'Telugu', username: 'someusername', from: 'Hindi' }
        contributionResp = await contributionsResponseWithCookie(contributionParams,"parallel");
        contributionId = contributionResp.body.data[0].contribution_id;
        datasetId = contributionResp.body.data[0].dataset_row_id;
    });
     it('check when action is skip', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser1",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(validateSkipSuccesful);
    });
    it('check when action is accept', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser2",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,accept);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(validateSuccesful);
    });
    it('check when action is reject', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser3",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,reject);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(validateSuccesful);
    });
    it('check when sentence id is empty', async () => {
        const body = {
            "sentenceId": "",
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser4",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when sentence id is zero', async () => {
        const body = {
            "sentenceId": 0,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser5",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when sentence id is not set', async () => {
        const body = {
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser6",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when type is not set', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser7",
            "device": "device",
            "browser": "browser_name",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });

    it('check when type is empty', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser8",
            "device": "device",
            "browser": "browser_name",
            "type": "",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when type is invalid', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser9",
            "device": "device",
            "browser": "browser_name",
            "type": "invalid",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when username is empty', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body.message).to.equal(validateSkipSuccesful);
    });
    it('check when username is not set', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when username contains only numbers', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": Math.floor((Math.random() * 200)),
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when username length is greater than 12 characters', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someemail@somedomain@somecom",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when username is in email format', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "a@gmail.com",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check add additional params in request body like abcd = xyz, it should fail', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser01",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu",
            "abcd": "xyz"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(validateSkipSuccesful); //the condition should be revert once the api is fixed
    });
    it('check when cookie is not set', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "anyuser",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithoutCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when cookie is empty', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser02",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip,'');
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when language is empty', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser03",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": ""
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(validateSkipSuccesful);  //the condition should be revert once the api is fixed
    });
    it('check when language is invalid', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser04",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "invalid"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when language is not set', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser05",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(validateSkipSuccesful);  //the condition should be revert once the api is fixed
    });
    it('check when language is in CAPITAL letters', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser06",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "TELUGU"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when language is in SMALL letters', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser07",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "Hindi",
            "language": "telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when fromLanguage is empty', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser09",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(validateSkipSuccesful);  //the condition should be revert once the api is fixed
    });
    it('check when fromLanguage is invalid', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser001",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "invalid",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when fromLanguage is not set', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser002",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
        expect(resp.body.message).to.equal(validateSkipSuccesful);  //the condition should be revert once the api is fixed
    });
    it('check when fromLanguage is in CAPITAL letters', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser003",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "HINDI",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
    it('check when fromLanguage is in SMALL letters', async () => {
        const body = {
            "sentenceId": datasetId,
            "state": "Uttar Pradesh",
            "country": "India",
            "userName": "someuser04",
            "device": "device",
            "browser": "browser_name",
            "type": "parallel",
            "fromLanguage": "hindi",
            "language": "Telugu"
        }
        const resp = await validateResponseWithCookie(body,contributionId,skip);
        expect(resp.status).to.equal(badRequestStatus);
        expect(invalidParam);
    });
});