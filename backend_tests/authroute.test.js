const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use("/", require("./../src/authroute"));


describe("Auth route tests",()=>{
    test("login test",()=>{
        expect(2).toBe(2) 
    })
});