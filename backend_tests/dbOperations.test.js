import { when } from 'jest-when'

const {
    updateContributionDetails, updateSentencesWithContributedState, getValidationSentencesQuery, getCountOfTotalSpeakerAndRecordedAudio, getGenderData, getAgeGroupsData, getMotherTonguesData, feedbackInsertion, saveReportQuery, markContributionSkippedQuery, rewardsInfoQuery, getContributorIdQuery, getTotalUserContribution, checkCurrentMilestoneQuery, checkNextMilestoneQuery, findRewardInfo, insertRewardQuery
} = require('./../src/dbQuery');

const mockDB = {
    many: jest.fn(() => Promise.resolve()),
    one: jest.fn(() => Promise.resolve()),
    none: jest.fn(() => Promise.resolve()),
    any: jest.fn(() => Promise.resolve()),
    oneOrNone: jest.fn(() => Promise.resolve()),
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
            when(spyDBany).calledWith(updateContributionDetails, [testAudioPath,
                null,
                null,
                null,
                testSentenceId,
                undefined,
                testUserName,
                testState,
                testCountry,
                testAudioDuration]).mockReturnValue(Promise.resolve());
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
            when(spyDBany).calledWith(updateContributionDetails,
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
                    testAudioDuration]).mockReturnValue(Promise.resolve());
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
            when(spyDBany).calledWith(updateContributionDetails,
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
                ]).mockReturnValue(Promise.resolve());


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
        when(spyDBany).calledWith(getValidationSentencesQuery, [language]).mockReturnValue(Promise.resolve())

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

    test('Save Report', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const userId = '123'
        const sentenceId = '456'
        const language = 'testLanguage'
        const reportText = 'report text'
        const userName = 'test user'
        const source = 'contribution'

        dbOperations.saveReport(userId, sentenceId, reportText, language, userName, source);

        expect(spyDBany).toHaveBeenCalledWith(saveReportQuery, [undefined, userName, sentenceId, reportText, language, source])
    });

    test('Mark Skipped Contribution', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const userId = '123'
        const sentenceId = '456'
        const userName = 'test user'

        dbOperations.markContributionSkipped(userId, sentenceId, userName);

        expect(spyDBany).toHaveBeenCalledWith(markContributionSkippedQuery, [undefined, userName, sentenceId])
    });

    test('Get Rewards info', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const language = 'testLanguage'

        dbOperations.getRewardsInfo(language);

        expect(spyDBany).toHaveBeenCalledWith(rewardsInfoQuery, [language])
    });

    describe('Test Get Rewards', () => {
        const spyDBany = jest.spyOn(mockDB, 'any'), spyDBone = jest.spyOn(mockDB, 'one'), spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone');
        const userId = '123'
        const userName = 'userName'
        const category = 'category'
        const language = 'testLanguage'
        const contributor_id = 10
        const contribution_count = 5
        const milestoneId = 1
        when(spyDBone).calledWith(getTotalUserContribution, [contributor_id, language]).mockReturnValue({ 'contribution_count': contribution_count });
        when(spyDBany).calledWith(insertRewardQuery, [contributor_id, language, expect.anything(), category]).mockReturnValue([{ 'generated_badge_id': 1 }]);
        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [undefined, userName]).mockReturnValue({ 'contributor_id': contributor_id });
        when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language]).mockReturnValue({ 'id': milestoneId, 'grade': 'copper', 'milestone': 100 });
        when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, category]).mockReturnValue([]);

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call queries for rewards data if user found', async () => {
            await dbOperations.getRewards(userId, userName, language, category);

            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(1, getContributorIdQuery, [undefined, userName])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(2, checkCurrentMilestoneQuery, [contribution_count, language])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(3, checkNextMilestoneQuery, [contribution_count, language])
            expect(spyDBone).toHaveBeenCalledWith(getTotalUserContribution, [contributor_id, language])
        });

        describe('Test get contributor id', () => {

            test('should throw error if user not found', async () => {
                when(spyDBoneOrNone).calledWith(getContributorIdQuery, [undefined, userName]).mockReturnValue(null);

                await expect(dbOperations.getRewards(userId, userName, language, category)).rejects.toThrowError('No User found')
                jest.clearAllMocks();
            });

            test('should return contributor id', async () => {
                when(spyDBoneOrNone).calledWith(getContributorIdQuery, [undefined, userName]).mockReturnValue({ 'contributor_id': contributor_id });

                await dbOperations.getRewards(userId, userName, language, category);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(getContributorIdQuery, [undefined, userName])
                jest.clearAllMocks();
            });
        })

        describe('Test create badge', () => {

            test('should call insertRewardQuery id rewardsList is empty', async () => {
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, category]).mockReturnValue([]);

                await dbOperations.getRewards(userId, userName, language, category);

                expect(spyDBany).toHaveBeenCalledWith(findRewardInfo, [contributor_id, language, category])
                expect(spyDBany).toHaveBeenCalledWith(insertRewardQuery, [contributor_id, language, expect.anything(), category])
                expect(spyDBany).toHaveBeenCalledTimes(2)
                jest.clearAllMocks()
            });

            test('should not call insertRewardQuery if matched badge', async () => {
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, category]).mockReturnValue([{ "reward_catalogue_id": milestoneId }]);

                await dbOperations.getRewards(userId, userName, language, category);

                expect(spyDBany).toHaveBeenCalledWith(findRewardInfo, [contributor_id, language, category])
                expect(spyDBany).toHaveBeenCalledTimes(1)
                jest.clearAllMocks();
            });
        });

        describe('Test get current milestone data', () => {

            test('get current milestone data if exists', async () => {
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, expect.anything(), category]).mockReturnValue([]);
                when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language]).mockReturnValue({ 'id': 1, 'grade': 'copper', 'milestone': 100 });

                const result = await dbOperations.getRewards(userId, userName, language, category);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language])
                expect(result.currentMilestone).toBe(100)
                expect(result.currentBadgeType).toBe('copper')
                jest.clearAllMocks();
            });

            test('get current milestone as 0 if data not exists', async () => {
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, expect.anything(), category]).mockReturnValue([]);
                when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language]).mockReturnValue(null);

                const result = await dbOperations.getRewards(userId, userName, language, category);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language])
                expect(result.currentMilestone).toBe(0)
                expect(result.currentBadgeType).toBe('')
                jest.clearAllMocks();
            });
        });

        describe('Test get next milestone data', () => {

            test('get next milestone data if exists', async () => {
                when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language]).mockReturnValue({ 'id': 2, 'grade': 'silver', 'milestone': 200 });

                const result = await dbOperations.getRewards(userId, userName, language, category);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language])
                expect(result.nextMilestone).toBe(200)
                expect(result.nextBadgeType).toBe('silver')
                jest.clearAllMocks();
            });

            test('get next milestone as 0 if data not exists', async () => {
                when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language]).mockReturnValue({});

                const result = await dbOperations.getRewards(userId, userName, language, category);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language])
                expect(result.nextMilestone).toBe(0)
                expect(result.nextBadgeType).toBe('')
                jest.clearAllMocks();
            });
        });
    });
});
