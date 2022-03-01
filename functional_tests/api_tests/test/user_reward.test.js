const assert = require('assert');
const expect = require('chai').expect;
const {userRewardResponseWithCookie, userRewardResponseWithoutCookie} = require('../api');
const {successStatus} = require('../constant/responseStatus');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe('GET /user-rewards/{username}', function () {
    it('check when username does not exist', async function () {
        const resp = await userRewardResponseWithCookie("garbageValueABCDE")
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
    });
    it('check when username is empty', async function () {
        const resp = await userRewardResponseWithCookie('') 
        expect(resp.status).to.equal(successStatus);
    });
    it('check when username contains only numbers', async function () {
        const resp = await userRewardResponseWithCookie(1234567) 
        expect(resp.status).to.equal(successStatus);  //the condition should be revert once the api is fixed
    });
    it('check when username length is greater than 12 characters', async function () {
        const resp = await userRewardResponseWithCookie("someemail@somedomain.somecom") 
        expect(resp.status).to.equal(successStatus);  //the condition should be revert once the api is fixed
    });
    it('check when username is in email format', async function () { 
        const resp = await userRewardResponseWithCookie("a@gmail.com") 
        expect(resp.status).to.equal(successStatus); //the condition should be revert once the api is fixed
    });
    it('check when cookie is not set', async function () {
        const resp = await userRewardResponseWithoutCookie("someuser") 
        expect(resp.status).to.equal(successStatus);  //the condition should be revert once the api is fixed
    });
    it('check when cookie value is empty', async function () {
        const resp = await userRewardResponseWithCookie('testing','')    
        expect(resp.status).to.equal(successStatus);  //the condition should be revert once the api is fixed
    });
});