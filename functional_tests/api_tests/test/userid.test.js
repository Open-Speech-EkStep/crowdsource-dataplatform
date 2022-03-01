const assert = require('assert');
const expect = require('chai').expect;
const {userIdResponse} = require('../api');
const {successStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('GET /get-userid', function () {
    it('check get-userId response', async function () {
        const resp = await userIdResponse();
        expect(resp.status).to.equal(successStatus);
        expect("OK");
    });
});
