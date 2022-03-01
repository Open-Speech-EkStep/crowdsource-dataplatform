const assert = require('assert');
const expect = require('chai').expect;
const {locationInfoResponse} = require('../api');
const {badRequest} = require('../constant/responseMessage');
const {successStatus, badRequestStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('GET /location-info', function () {
    const locationInfoExpectedResponse = {
                        "country": "Canada",
                        "regionName": "Quebec"
                    }
    it('check with valid IP address', async function () {
        const queryParams = { ip: '24.48.0.1' }
        const resp = await locationInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.not.be.empty;
        expect(resp.body).to.eql(locationInfoExpectedResponse);
    });
    it('check without IP address', async function () {
        const queryParams = { ip: '' }
        const resp = await locationInfoResponse(queryParams);
        expect(resp.status).to.equal(badRequestStatus);
        expect(badRequest);
    });
    it('check with invalid IP address', async function () {
        const queryParams = { ip: '1000234000000' }
        const resp = await locationInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.be.empty;
    });
    it('check with invalid IP address', async function () {
        const queryParams = { ip: '0.0.0.0' }
        const resp = await locationInfoResponse(queryParams);
        expect(resp.status).to.equal(successStatus);
        expect(resp.body).to.be.empty;
    });
});
