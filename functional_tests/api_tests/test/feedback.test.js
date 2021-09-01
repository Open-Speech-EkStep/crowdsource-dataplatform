//const mocha = require('mocha');
const supertest = require('supertest')
var assert = require('assert');
var expect = require('chai').expect;


const envarg = process.argv.filter((x) => x.startsWith('-env='))[0]
const env = envarg ? envarg.split('=')[1] : 'dev' // default
const api_test_url="https://"+env+"-api.vakyansh.in"

let baseURL = supertest(api_test_url);
//let mediaText = "/media/text";
//let mediaOcr = '/media/ocr';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


describe('POST /Feedback',function(){
    const feedback="/feedback";

    it('check happy path for feedback',async function(){
       const resp = await baseURL.post(feedback)
        .send({ "feedback": "some feedback",
        "category": "some category",
        "language": "Hindi",
        "email": "someemail@somedomain.somecom",
        "module": "suno",
        "target_page": "home",
        "opinion_rating": 1,
        "recommended": "yes",
        "revisit": "no"})
        .set('Content-type', 'application/json')
        console.log(resp.body)
        expect(resp.status).to.equal(200);
        expect(resp.body.message).to.equal("Feedback submitted successfully.")

    });

    it('check Feedback without email',async()=>{
       const resp = await baseURL.post(feedback)
        .send({ "feedback": "some feedback",
        "category": "some category",
        "language": "Hindi",
        "email": "",
        "module": "suno",
        "target_page": "home",
        "opinion_rating": 1,
        "recommended": "yes",
        "revisit": "no"})
        .set('Content-type', 'application/json')
        console.log(resp.body)
        expect(resp.status).to.equal(400);
    });

    it('check Feedback without module',async()=>{
      const  resp = await baseURL.post(feedback)
        .send({ "feedback": "some feedback",
        "category": "some category",
        "language": "Hindi",
        "email": "someone",
        "module": "",
        "target_page": "home",
        "opinion_rating": 1,
        "recommended": "yes",
        "revisit": "no"})
        .set('Content-type', 'application/json')
        console.log(resp.body)
        expect(resp.status).to.equal(400);

    });


    it('check Feedback without opinion rating',async()=>{
       const resp = await baseURL.post(feedback)
        .send({ "feedback": "some feedback",
        "category": "some category",
        "language": "Hindi",
        "email": "someone",
        "module": "suno",
        "target_page": "home",
        "opinion_rating": "",
        "recommended": "yes",
        "revisit": "no"})
        .set('Content-type', 'application/json')
        console.log(resp.body)
        expect(resp.status).to.equal(400);
    });

    
    it('check Feedback with invalid Language ',async()=>{
       const resp = await baseURL.post(feedback)
        .send({ "feedback": "some feedback",
        "category": "some category",
        "language": "sa",
        "email": "someone",
        "module": "suno",
        "target_page": "home",
        "opinion_rating": "4",
        "recommended": "yes",
        "revisit": "no"})
        .set('Content-type', 'application/json')
        console.log(resp.body)
        expect(resp.status).to.equal(400);

    });

});
