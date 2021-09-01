const supertest = require('supertest')
var assert = require('assert');
var expect = require('chai').expect;




const envarg = process.argv.filter((x) => x.startsWith('-env='))[0]
const env = envarg ? envarg.split('=')[1] : 'dev' // default
const api_test_url="https://"+env+"-api.vakyansh.in"

let baseURL = supertest(api_test_url);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



describe('POST /Media',function(){
    const mediaAsr = "/media/asr";

    it('check happy case for ASR',async()=>{
       const resp = await baseURL.post(mediaAsr)
        .type('form')
        .send({"userName":"amuly2aa","language":"Odia"})
        .set('Content-type', 'application/json')
        .set('Cookie', `userId=834983984392`);
        console.log(resp.body)
        expect(resp.status).to.equal(200);
    });

    it('check when language is not present',async()=>{
       const resp = await baseURL.post(mediaAsr)
        .type('form')
        .send({"userName":"","language":""})
        .set('Content-type', 'application/json')
        console.log(resp.body)
        expect(resp.status).to.equal(400);
        expect(resp.body.error).to.equal("required parameters missing")
    });


});