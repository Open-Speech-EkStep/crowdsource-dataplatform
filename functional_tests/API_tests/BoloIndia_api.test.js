const supertest = require('supertest');
//const fs = require('fs')
//const assert = require('assert');
//const args = require('yargs').argv;
let api_test_url="";

//const env = args.env || 'default';

const envarg = process.argv.filter((x) => x.startsWith('-env='))[0]
const env = envarg ? envarg.split('=')[1] : 'dev' // default
//console.log(JSON.stringify(args) + 'argss')
//const filename = 'user.properties';
//const settings = JSON.parse(fs.readFileSync('env/'+env+'/' + filename, 'utf8'));

if(env=="dev")
{
api_test_url="https://dev-nplt-api.vakyansh.in"
}

else if(env=="test")
{
    api_test_url="https://test-nplt-api.vakyansh.in"
}


let baseURL = supertest(api_test_url);
let media = "/media/text";
let stats = "/available-languages/asr"

describe('First Request to Get Users',()=>{
    
    let resp;

    test('check user ', async()=>{
        console.log(process.env.api_test_url)
        resp = await baseURL.get(stats) //Sending the GET request
        expect(resp.status).toEqual(200);
        console.log(resp.body)
    });

    test('checks that the response was OK',async()=>{
        resp = await baseURL.post(media)
        .type('form')
        .send({"userName":"amuly2aa","language":"English"})
        .set('Content-type', 'application/json')
        //.set('Cookie', `userId=834983984392`);
        console.log(resp.body)
        expect(resp.status).toEqual(200);
    });

});
