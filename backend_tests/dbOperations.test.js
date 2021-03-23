const { spy } = require('fetch-mock');
const {
    updateContributionDetails, updateSentencesWithContributedState, getValidationSentencesQuery, getCountOfTotalSpeakerAndRecordedAudio, getGenderData, getAgeGroupsData, getMotherTonguesData, feedbackInsertion
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
process.env.LAUNCH_IDS = '1,2'

const dbOperations = require('../src/dbOperations');
const { topLanguagesByHoursContributed, topLanguagesBySpeakerContributions, listLanguages } = require('../src/dashboardDbQueries');

const res = { status: () => { return { send: () => { } }; } };

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

            expect(spyDB).toHaveBeenCalledWith(expect.anything(), ["abcdefghi", "test_username", "medium", "Hindi", "Gujrati", "Male", ageGroup, expect.anything()]);
        });

        test('should call query with label medium for adults', () => {
            const ageGroup = "50-59";
            const spyDB = jest.spyOn(mockDB, 'many')

            dbOperations.getSentencesBasedOnAge(ageGroup, "abcdefghi", "test_username", "Hindi", "Gujrati", "Male")

            expect(spyDB).toHaveBeenCalledWith(expect.anything(), ["abcdefghi", "test_username", "medium", "Hindi", "Gujrati", "Male", ageGroup, expect.anything()]);
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
        let spyDBany, spyDBnone;

        beforeEach(() => {
            spyDBany = jest.spyOn(mockDB, 'any')
            spyDBnone = jest.spyOn(mockDB, 'none')
        });

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('call query with null speaker details if not exists', async () => {
            await dbOperations.updateDbWithAudioPath(
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

            expect(spyDBany).toHaveBeenCalledWith(
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

            expect(spyDBnone).toHaveBeenCalledWith(
                updateSentencesWithContributedState,
                [testSentenceId]
            )
        });

        test('call query with age, gender and mother tongue if speaker details exists', async () => {
            await dbOperations.updateDbWithAudioPath(
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

            expect(spyDBany).toHaveBeenCalledWith(
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

            expect(spyDBnone).toHaveBeenCalledWith(
                updateSentencesWithContributedState,
                [testSentenceId]
            )
        });

        test('call query with rounded audio duration', async () => {
            const testAudioDuration = 4.78951;
            const expectedAudioDuration = 4.79;

            await dbOperations.updateDbWithAudioPath(
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

            expect(spyDBany).toHaveBeenCalledWith(
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

            expect(spyDBnone).toHaveBeenCalledWith(
                updateSentencesWithContributedState,
                [testSentenceId]
            )
        });
    });

    test('get validationsentences should call getValidationSentences query once with language', () => {
        const language = 'testLanguage';
        const req = { params: { language: language } };
        const spyDBany = jest.spyOn(mockDB, 'any')

        dbOperations.getValidationSentences(req, res);

        expect(spyDBany).toHaveBeenCalledWith(getValidationSentencesQuery, [language]);
        jest.clearAllMocks();
    });

    test('Get all Details should call getCountOfTotalSpeakerAndRecordedAudio query once with language', () => {
        const language = 'testLanguage';
        const spyDBany = jest.spyOn(mockDB, 'any')

        dbOperations.getAllDetails(language);

        expect(spyDBany).toHaveBeenCalledWith(getCountOfTotalSpeakerAndRecordedAudio, [language]);
        jest.clearAllMocks();
    });

    test('Get All Info should call age, gender and mother tongue data query each once with given language', async () => {
        const language = 'testLanguage';
        const spyDBany = jest.spyOn(mockDB, 'any')

        await dbOperations.getAllInfo(language);

        expect(spyDBany).toHaveBeenCalledTimes(3)
        expect(spyDBany).toHaveBeenCalledWith(getGenderData, [language])
        expect(spyDBany).toHaveBeenCalledWith(getAgeGroupsData, [language])
        expect(spyDBany).toHaveBeenCalledWith(getMotherTonguesData, [language])
    });

    test('Get top language by hours', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')

        dbOperations.getTopLanguageByHours();

        expect(spyDBany).toHaveBeenCalledWith(topLanguagesByHoursContributed);
    });

    test('Get top language by speakers', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')

        dbOperations.getTopLanguageBySpeakers();

        expect(spyDBany).toHaveBeenCalledWith(topLanguagesBySpeakerContributions);
    });

    test('Get languages', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')

        dbOperations.getLanguages();

        expect(spyDBany).toHaveBeenCalledWith(listLanguages, []);
    });

    test('Insert Feedback', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const subject = 'subject'
        const feedback = 'test feedback'
        const language = 'testLanguage'

        dbOperations.insertFeedback(subject, feedback, language);

        expect(spyDBany).toHaveBeenCalledWith(feedbackInsertion, [subject, feedback, language])
    });
});
