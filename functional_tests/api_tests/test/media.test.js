
var assert = require('assert');
var expect = require('chai').expect;
const { baseURL } = require('../config/config')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


describe('POST /Media', function () {
    const mediaAsr = "/media/asr";

    it('check happy case for ASR', async () => {
        const resp = await baseURL.post(mediaAsr)
            .type('form')
            .send({ "userName": "amuly2aa", "language": "Odia" })
            .set('Content-type', 'application/json')
            .set('Cookie', `userId=834983984392`);
        expect(resp.status).to.equal(200);
    });

    it('check when language is not present', async () => {
        const resp = await baseURL.post(mediaAsr)
            .type('form')
            .send({ "userName": "", "language": "" })
            .set('Content-type', 'application/json')
        expect(resp.status).to.equal(400);
        expect(resp.body.error).to.equal("required parameters missing")
    });


});