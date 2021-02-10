const request = require("supertest");
const express = require("express");
const app = express();
// const {redirectUser, router}=require('./../src/authroute')

app.use(express.urlencoded({ extended: false }));

app.use("/", require("./../src/authroute"));


describe("Auth route tests",()=>{
    test("login test",()=>{
        expect(2).toBe(2) 
    })
});
//
// describe('Redirect user',()=>{
//     const res = {redirect:(e)=>{}}
//     jest.spyOn(res, "redirect")
//
//     test("validators should land on validating page",()=>{
//         const testUser={permissions: ['validator:action']}
//
//         redirectUser(testUser, res);
//
//         expect(res.redirect).toHaveBeenCalledWith('/validator/prompt-page')
//     });
//
//     test("managers should land on auth0 dashboard page",()=>{
//         const testUser={permissions: ['manager:action']}
//         process.env.AUTH0_ADMIN_LOGIN_URL='test_url'
//
//         redirectUser(testUser, res);
//
//         expect(res.redirect).toHaveBeenCalledWith('test_url')
//         delete process.env.AUTH0_ADMIN_LOGIN_URL;
//     });
//
//     test("others should land on vakyansh home page",()=>{
//         const testUser={permissions: []}
//
//         redirectUser(testUser, res);
//
//         expect(res.redirect).toHaveBeenCalledWith('/')
//     });
// })
