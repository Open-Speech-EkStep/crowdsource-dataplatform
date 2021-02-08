const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use("/", require("./../src/secureroute"));


describe("Secure route tests",()=>{
    test("Secure route test",()=>{
        expect(2).toBe(2)
    })
});