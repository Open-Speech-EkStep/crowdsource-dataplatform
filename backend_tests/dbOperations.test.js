const { spy } = require('fetch-mock');
const {
    updateContributionDetails
} = require('./../src/dbQuery');

const mockDB = {
    many: jest.fn(() => Promise.resolve()),
    none: jest.fn(() => Promise.resolve()),
    any: jest.fn(() => Promise.resolve()),
}

jest.mock('pg-promise', () => jest.fn(() => {
    return jest.fn(() => mockDB);
}));

const encryptMock = jest.mock('../src/encryptAndDecrypt');
encryptMock.encrypt = jest.fn();

const dbOperations = require('../src/dbOperations');

describe("Running tests for dbOperations", () => {
    describe('tests for getSentencesBasedOnAge', () => {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test("should return expected result", () => {
            const mockResult = [
                { sentenceId: 1, sentence: "Mock sentence 1" },
                { sentenceId: 2, sentence: "Mock sentence 2" },
                { sentenceId: 3, sentence: "Mock sentence 3" }
            ];

            mockDB.many.mockReturnValue(mockResult);

            const result = dbOperations.getSentencesBasedOnAge(
                "10-20", "abcdefghi", "test_username", "Hindi", "Gujrati", "Male"
            );

            expect(result).toEqual(mockResult);
        });

        test('should call query with label medium for kids', () => {
            const ageGroup = "0-13";
            const spyDB = jest.spyOn(mockDB, 'many')

            dbOperations.getSentencesBasedOnAge(ageGroup, "abcdefghi", "test_username", "Hindi", "Gujrati", "Male")

            expect(spyDB).toHaveBeenCalledWith(expect.anything(), ["abcdefghi", "test_username", "medium", "Hindi", "Gujrati", "Male", ageGroup]);
        });

        test('should call query with label medium for adults', () => {
            const ageGroup = "50-59";
            const spyDB = jest.spyOn(mockDB, 'many')

            dbOperations.getSentencesBasedOnAge(ageGroup, "abcdefghi", "test_username", "Hindi", "Gujrati", "Male")

            expect(spyDB).toHaveBeenCalledWith(expect.anything(), ["abcdefghi", "test_username", "medium", "Hindi", "Gujrati", "Male", ageGroup]);
        })
    });

    describe('Update DB with audio path', () => {
        const testAudioPath = 'testPath';
        const testSentenceId = 1;
        const testUserId = 123;
        const testUserName = 'testName';
        const testState = 'testState';
        const testCountry = 'testCountry';
        const testAudioDuration = 10;
        const callback = () => { };
        let spyDB;

        beforeEach(() => {
            spyDB = jest.spyOn(mockDB, 'any')
        });

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('call query with null speaker details if not exists', () => {
            dbOperations.updateDbWithAudioPath(
                testAudioPath,
                testSentenceId,
                null,
                testUserId,
                testUserName,
                testState,
                testCountry,
                testAudioDuration,
                callback
            )

            expect(spyDB).toHaveBeenCalledWith(
                updateContributionDetails,
                [
                    testAudioPath,
                    null,
                    null,
                    null,
                    testSentenceId,
                    undefined,
                    testUserName,
                    testState,
                    testCountry,
                    testAudioDuration
                ]
            );
        });

        test('call query with age, gender and mother tongue if speaker details exists', () => {
            dbOperations.updateDbWithAudioPath(
                testAudioPath,
                testSentenceId,
                '{"age": "10-15", "gender": "male", "motherTongue": "Language"}',
                testUserId,
                testUserName,
                testState,
                testCountry,
                testAudioDuration,
                callback
            )

            expect(spyDB).toHaveBeenCalledWith(
                updateContributionDetails,
                [
                    testAudioPath,
                    "10-15",
                    "male",
                    "Language",
                    testSentenceId,
                    undefined,
                    testUserName,
                    testState,
                    testCountry,
                    testAudioDuration
                ]
            );
        });

        test('call query with rounded audio duration', () => {
            const testAudioDuration = 4.78951;
            const expectedAudioDuration = 4.79;

            dbOperations.updateDbWithAudioPath(
                testAudioPath,
                testSentenceId,
                null,
                testUserId,
                testUserName,
                testState,
                testCountry,
                testAudioDuration,
                callback
            )

            expect(spyDB).toHaveBeenCalledWith(
                updateContributionDetails,
                [
                    testAudioPath,
                    null,
                    null,
                    null,
                    testSentenceId,
                    undefined,
                    testUserName,
                    testState,
                    testCountry,
                    expectedAudioDuration
                ]
            );
        });
    })
});
