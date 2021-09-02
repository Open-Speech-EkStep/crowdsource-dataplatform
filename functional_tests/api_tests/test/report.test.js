
var expect = require('chai').expect;
const { baseURL } = require('../config/config')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('POST /Rerport', function () {
    const report = "/report";

    it('check happy path for report api', async function () {
        const resp = await baseURL.post(report)
            .send({
                "sentenceId": "1",
                "reportText": "some report",
                "language": "Hindi",
                "userName": "Test user",
                "source": "contribution"
            })
            .set('Cookie', `userId=7823378782`)
            .set('Content-type', 'application/json');
        expect(resp.status).to.equal(200);
        expect(resp.body.message).to.equal("Reported successfully.")

    });

    it('when setence id is blank', async function () {
        const resp = await baseURL.post(report)
            .send({
                "sentenceId": "",
                "reportText": "some report",
                "language": "Hindi",
                "userName": "Test user",
                "source": "contribution"
            })
            .set('Cookie', `userId=7823378782`)
            .set('Content-type', 'application/json');
        expect(resp.body.statusCode).to.equal(400)
        expect(resp.body.message).to.equal("Input values missing")

    });


    it('when language is incorrect', async function () {
        const resp = await baseURL.post(report)
            .send({
                "sentenceId": "1",
                "reportText": "some report",
                "language": "ABCDS",
                "userName": "Test user",
                "source": "contribution"
            })
            .set('Cookie', `userId=7823378782`)
            .set('Content-type', 'application/json');
        expect(resp.statusCode).to.equal(200);
        expect(resp.body.message).to.equal("Reported successfully.")

    });

    it('when language is missing', async function () {
        const resp = await baseURL.post(report)
            .send({
                "sentenceId": "1",
                "reportText": "some report",
                "source": "contribution"
            })
            .set('Cookie', `userId=7823378782`)
            .set('Content-type', 'application/json');
        expect(resp.status).to.equal(200);
        expect(resp.body.statusCode).to.equal(400)
        expect(resp.body.message).to.equal("Input values missing")

    });


    it('when username is not present', async function () {
        const resp = await baseURL.post(report)
            .send({
                "sentenceId": "1",
                "reportText": "some report",
                "language": "Hindi",
                "source": "contribution"
            })
            .set('Cookie', `userId=7823378782`)
            .set('Content-type', 'application/json');
        expect(resp.status).to.equal(200);
        expect(resp.body.message).to.equal("Reported successfully.")

    });

    it('when source is incorrect', async function () {
        const resp = await baseURL.post(report)
            .send({
                "sentenceId": "1",
                "reportText": "some report",
                "language": "Hindi",
                "source": "contri"
            })
            .set('Cookie', `userId=7823378782`)
            .set('Content-type', 'application/json');
        expect(resp.status).to.equal(200);
        expect(resp.body.statusCode).to.equal(400);
        expect(resp.body.message).to.equal("Input values missing")

    });



})