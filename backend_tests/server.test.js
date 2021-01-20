const routes = require("../src/app");
import * as dbOperations from '../src/dbOperations';

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use("/", routes);

const testDatagetAllInfo = [[{ "dummy_data": "abc" }], [{ "dummy_data": "abc" }], [{ "dummy_data": "abc" }]]

jest.mock('../src/dbOperations', () => ({
    getAllDetails: jest.fn().mockReturnValue({ "total_speaker": 2345, "sentence": 100 }),
    getAllInfo: jest.fn().mockReturnValue(testDatagetAllInfo),
}))


describe("Test the root path", () => {

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("It should response the GET method", async () => {
        await request(app)
            .get("/about-us")
            .expect(200);
    });

    test("It should response the GET method of getDetails", async () => {
        dbOperations.getAllDetails.mockReturnValue({ "total_speaker": 2345, "sentence": 100 })
        const response = await request(app).get("/getDetails/Hindi");

        expect(dbOperations.getAllDetails).toHaveBeenCalled()
        expect(dbOperations.getAllDetails).toHaveBeenCalledWith("Hindi")
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual({ "total_speaker": 2345, "sentence": 100 })
    });

    test("It should response the GET method of getAllInfo", async () => {
        const expectedResponse = { "ageGroups": [{ "dummy_data": "abc" }], "genderData": [{ "dummy_data": "abc" }], "motherTongues": [{ "dummy_data": "abc" }] }

        const response = await request(app).get("/getAllInfo/Hindi");

        expect(dbOperations.getAllDetails).not.toHaveBeenCalled()
        expect(dbOperations.getAllInfo).toHaveBeenCalled()
        expect(dbOperations.getAllInfo).toHaveBeenCalledWith("Hindi")
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual(expectedResponse)
    });

    test("It should response the GET method", async () => {
        const res = await request(app).get("/terms-and-conditions");

        expect(res.status).toBe(200);
        expect(res.text.includes("may be prohibited to be deleted as required under any applicable law")).toBe(true)
    });

    test("It should response the GET method", async () => {
        const res = await request(app).get("/thank-you");

        expect(res.status).toBe(200);
        expect(res.text.includes("Vakyansh has been envisioned to meet a goal of approx. 10,000")).toBe(true)
    });

    test("It should response the GET method", async () => {
        const res = await request(app).get("/record");

        expect(res.status).toBe(200);
        expect(res.text.includes("Get comfortable with the prompted text, before recording")).toBe(true)
    });


    //   test("It should response the post method of get sentences and update db", async () => {
    //     // dbOperations.updateAndGetSentences.mockReturnValue({})

    //     const response = await request(app).post("/sentences").send({ name: 'Joe', age: 2 });;
    //     expect(abc.updateAndGetSentences).toHaveBeenCalled()
    //     // expect(abc.updateAndGetSentences).toHaveBeenCalledWith("Hindi")
    //     expect(response.status).toBe(200)
    //     // console.log(response.cookie)
    //   });
});
