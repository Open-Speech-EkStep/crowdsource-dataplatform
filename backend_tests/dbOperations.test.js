const { spy } = require('fetch-mock');
const {
    UpdateAudioPathAndUserDetails,
    setNewUserAndFileName,
    unassignIncompleteSentences,
    updateAndGetSentencesQuery,
    updateAndGetUniqueSentencesQuery,
    getValidationSentencesQuery,
    sentencesCount,
    getCountOfTotalSpeakerAndRecordedAudio,
    getGenderData,
    getAgeGroupsData,
    getMotherTonguesData,
    unassignIncompleteSentencesWhenLanChange,
    updateSentencesWithContributedState,
    addValidationQuery,
    updateSentencesWithValidatedState
} = require('./../src/dbQuery');

describe("Running tests for dbOperations", () => {
    describe('tests for getSentencesBasedOnAge', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.resetAllMocks();
        });
        afterEach(() => {
            jest.clearAllMocks();
        })
        
        test("should return expected result", () => {
            const mockResult = [
                { sentenceId: 1, sentence: "Mock sentence 1" },
                { sentenceId: 2, sentence: "Mock sentence 2" },
                { sentenceId: 3, sentence: "Mock sentence 3" }
            ];

            jest.mock('pg-promise', () => jest.fn(() => {
                return jest.fn(() => ({
                    many: jest.fn(() => mockResult),
                }))
            }));
            const dbOperations = require('../src/dbOperations');

            const result = dbOperations.getSentencesBasedOnAge(
                "10-20", "abcdefghi", "test_username", "Hindi", "Gujrati", "Male"
            );
            expect(result).toEqual(mockResult);
        });

        test('should call query with label medium for kids', () => {
            const ageGroup = "0-13";
            const mockDB = {
                many: jest.fn(),
            }
            jest.mock('pg-promise', () => jest.fn(() => {
                return jest.fn(()=>mockDB);
            }));
            const spyDB  = jest.spyOn(mockDB, 'many')
            const dbOperations = require('../src/dbOperations');
            dbOperations.getSentencesBasedOnAge(ageGroup, "abcdefghi", "test_username", "Hindi", "Gujrati", "Male")
            expect(spyDB).toHaveBeenCalledWith(expect.anything(), ["abcdefghi", "test_username", "medium", "Hindi", "Gujrati", "Male", ageGroup]);
        });

        test('should call query with label medium for adults', () => {
            const ageGroup = "50-59";
            const mockDB = {
                many: jest.fn(),
            }
            jest.mock('pg-promise', () => jest.fn(() => {
                return jest.fn(()=>mockDB);
            }));
            const spyDB  = jest.spyOn(mockDB, 'many')
            const dbOperations = require('../src/dbOperations');
            dbOperations.getSentencesBasedOnAge(ageGroup, "abcdefghi", "test_username", "Hindi", "Gujrati", "Male")
            expect(spyDB).toHaveBeenCalledWith(expect.anything(), ["abcdefghi", "test_username", "medium", "Hindi", "Gujrati", "Male", ageGroup]);
        })
    });
});
