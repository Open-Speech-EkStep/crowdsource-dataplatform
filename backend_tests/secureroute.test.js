const request = require("supertest");
const express = require("express");
const app = express();
const secureRouter = require("./../src/secureroute");
import {sessionMiddleware, managerAuthMiddleWare, validatorAuthMiddleware} from '../src/middleware/authMiddleware';
jest.mock('../src/middleware/authMiddleware', () => ({
    sessionMiddleware: jest.fn(),
    managerAuthMiddleWare: jest.fn(),
    validatorAuthMiddleware: jest.fn()
  }))
app.use(express.urlencoded({ extended: false }));

app.use("/", secureRouter);

describe("Test /manager with session authorized",()=>{
    beforeEach(() => {
        sessionMiddleware.mockImplementation((req,res,next)=>{
            next()
        })
    });
    test("test manager endpoint access success",async ()=>{
        managerAuthMiddleWare.mockImplementation((req,res,next)=>{
            next()
        })
        await request(app)
            .get("/manager")
            .expect(200);
    });
    test("test manager endpoint access unauthorized",async ()=>{
        managerAuthMiddleWare.mockImplementation((req,res,next) => {
            res.sendStatus(401);
        })
        await request(app)
            .get("/manager")
            .expect(401);
    });
});
describe("Test /manager with session unauthorized",()=>{
    beforeEach(() => {
        sessionMiddleware.mockImplementation((req,res,next)=>{
            res.sendStatus(401);
        })
    });
    test("test manager endpoint access success",async ()=>{
        managerAuthMiddleWare.mockImplementation((req,res,next)=>{
            next()
        })
        await request(app)
            .get("/manager")
            .expect(401);
    });
    test("test manager endpoint access unauthorized",async ()=>{
        managerAuthMiddleWare.mockImplementation((req,res,next) => {
            res.sendStatus(401);
        })
        await request(app)
            .get("/manager")
            .expect(401);
    });
});

describe("Test /validator with session authorized",()=>{
    beforeEach(() => {
        sessionMiddleware.mockImplementation((req,res,next)=>{
            next()
        })
    });
    test("test validator endpoint access success",async ()=>{
        validatorAuthMiddleware.mockImplementation((req,res,next)=>{
            next()
        })
        await request(app)
            .get("/validator")
            .expect(200);
    });
    test("test validator endpoint access unauthorized",async ()=>{
        validatorAuthMiddleware.mockImplementation((req,res,next) => {
            res.sendStatus(401);
        })
        await request(app)
            .get("/validator")
            .expect(401);
    });
})

describe("Test /validator with session unauthorized",()=>{
    beforeEach(() => {
        sessionMiddleware.mockImplementation((req,res,next)=>{
            res.sendStatus(401)
        })
    });
    test("test validator endpoint access success",async ()=>{
        validatorAuthMiddleware.mockImplementation((req,res,next)=>{
            next()
        })
        await request(app)
            .get("/validator")
            .expect(401);
    });
    test("test validator endpoint access unauthorized",async ()=>{
        validatorAuthMiddleware.mockImplementation((req,res,next) => {
            res.sendStatus(401);
        })
        await request(app)
            .get("/validator")
            .expect(401);
    });
})