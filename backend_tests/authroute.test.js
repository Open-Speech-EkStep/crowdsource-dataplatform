const request = require("supertest");
const express = require("express");
const app = express();

const authRoutes =require('./../src/authroute')

app.use(express.urlencoded({ extended: false }));
app.use("/", authRoutes);


describe("Auth route tests",()=>{
    test("login test",()=>{
        expect(2).toBe(2) 
    })

    // test("/login/valiadator should redirect to login after setting validator actions",async ()=>{
    //     const res = await request(app).get("/login/validator");
    // })
});

