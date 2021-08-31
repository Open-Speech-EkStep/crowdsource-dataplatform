
jest.mock('@azure/storage-blob', () => ({
    // ...jest.requireActual('@azure/storage-blob'), // keep other props as they are
    BlobServiceClient: {
        fromConnectionString: jest.fn().mockReturnValue({}),
    },
}));

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
    getParticipationStats: jest.fn()
}))


describe("Test the root path", () => {

    afterEach(() => {
        jest.clearAllMocks();
    })

    //   test("It should response the post method of get sentences and update db", async () => {
    //     // dbOperations.updateAndGetSentences.mockReturnValue({})

    //     const response = await request(app).post("/sentences").send({ name: 'Joe', age: 2 });;
    //     expect(abc.updateAndGetSentences).toHaveBeenCalled()
    //     // expect(abc.updateAndGetSentences).toHaveBeenCalledWith("Hindi")
    //     expect(response.status).toBe(200)
    //     // console.log(response.cookie)
    //   });

    // test('/language-goal should respond with status 200', async () => {
    //     const response = await request(app).get('/language-goal/text/Hindi/contribute');
    //     expect(response.status).toBe(200);
    // })

    test("/participation-stats api test", async () => {
        const expectedResponse = [{'type': 'text','count': '10'},
        {'type': 'parallel','count': '14'},
        {'type': 'asr','count': '20'},
        {'type': 'ocr','count': '7'}]
        dbOperations.getParticipationStats.mockReturnValue(expectedResponse)

        const response = await request(app).get("/participation-stats");

        expect(dbOperations.getParticipationStats).toHaveBeenCalled()
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual(
            {
                bolo_india_participation: "10",
                likho_india_participation: "14",
                dekho_india_participation: "7",
                suno_india_participation: "20"
            }
        )
    });

    test("/participation-stats api test should handle empty data", async () => {
        const expectedResponse = [{'type': 'text','count': '10'}]
        dbOperations.getParticipationStats.mockReturnValue(expectedResponse)

        const response = await request(app).get("/participation-stats");

        expect(dbOperations.getParticipationStats).toHaveBeenCalled()
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual(
            {
                bolo_india_participation: "10",
                likho_india_participation: 0,
                dekho_india_participation: 0,
                suno_india_participation: 0
            })
    });
});
