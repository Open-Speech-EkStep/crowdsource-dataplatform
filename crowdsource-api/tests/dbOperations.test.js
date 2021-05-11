import { when } from 'jest-when'

const {
    updateContributionDetails,
    updateContributionDetailsWithUserInput,
    updateMediaWithContributedState,
    getCountOfTotalSpeakerAndRecordedAudio,
    getGenderData,
    getAgeGroupsData,
    getMotherTonguesData,
    feedbackInsertion,
    saveReportQuery,
    markContributionSkippedQuery,
    rewardsInfoQuery,
    getContributorIdQuery,
    getTotalUserContribution,
    checkCurrentMilestoneQuery,
    checkNextMilestoneQuery,
    findRewardInfo,
    insertRewardQuery,
    getTotalUserValidation,
    addContributorQuery,
    getBadges,
    addValidationQuery,
    updateMediaWithValidatedState,
    getContributionHoursForLanguage,
    getMultiplierForHourGoal,
    getOrderedMediaQuery,
    updateMaterializedViews,
    getContributionListQuery,
    getDatasetLanguagesQuery,
    getContributionLanguagesQuery,
    getOrderedUniqueMediaQuery
} = require('./../src/dbQuery');

const mockDB = {
    many: jest.fn(() => Promise.resolve()),
    one: jest.fn(() => Promise.resolve()),
    none: jest.fn(() => Promise.resolve()),
    any: jest.fn(() => Promise.resolve()),
    oneOrNone: jest.fn(() => Promise.resolve()),
}

const mockpgPromise = jest.fn(() => mockpgp)

const mockpgp = jest.fn(() => mockDB)

jest.mock('pg-promise', () => mockpgPromise);

process.env.LAUNCH_IDS = '1,2';
const dbOperations = require('../src/dbOperations');
const { topLanguagesByHoursContributed, topLanguagesBySpeakerContributions, listLanguages } = require('../src/dashboardDbQueries');
const res = { status: () => { return { send: () => { } }; }, sendStatus: () => { } };
delete process.env.LAUNCH_IDS;

describe("Running tests for dbOperations", () => {
    const spyDBany = jest.spyOn(mockDB, 'any');
    const spyDBnone = jest.spyOn(mockDB, 'none');
    const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone');
    const spyDBmany = jest.spyOn(mockDB, 'many');
    const spyDBone = jest.spyOn(mockDB, 'one');

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('tests for getMediaBasedOnAge', () => {
        const testUserId = "abcdefghi", testUsername = "test_username";
        const language = "Hindi", ageGroup = "10-20";
        const type = 'text', mediumLabel = 'medium';

        afterEach(() => {
            jest.clearAllMocks();
        })

        test("should return expected result", () => {
            const mockResult = [
                { sentenceId: 1, media_data: "Mock sentence 1" },
                { sentenceId: 2, media_data: "Mock sentence 2" },
                { sentenceId: 3, media_data: "Mock sentence 3" }
            ];

            spyDBmany.mockReturnValue(mockResult);

            const result = dbOperations.getMediaBasedOnAge(ageGroup, testUserId, testUsername, language, type);

            expect(result).toEqual(mockResult);
        });

        test('should call query with label medium for kids', () => {
            dbOperations.getMediaBasedOnAge(ageGroup, testUserId, testUsername, language, type)

            expect(spyDBmany).toHaveBeenCalledWith(getOrderedUniqueMediaQuery, [testUserId, testUsername, mediumLabel, language, type, expect.anything()]);
        });

        test('should call query with label medium for adults', () => {
            dbOperations.getMediaBasedOnAge(ageGroup, testUserId, testUsername, language, type)

            expect(spyDBmany).toHaveBeenCalledWith(getOrderedUniqueMediaQuery, [testUserId, testUsername, mediumLabel, language, type, expect.anything()]);
        })
    });

    describe('Update DB with audio path', () => {
        const testAudioPath = 'testPath', testUserName = 'testName';
        const testSentenceId = 1, testUserId = 123;
        const testState = 'testState', testCountry = 'testCountry';
        const testAudioDuration = 10, contributor_id = 27;
        const language = 'Tamil';
        const callback = () => { };

        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [testUserId, testUserName]).mockReturnValue({ 'contributor_id': contributor_id });

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call updateContributionDetails, updateMediaWithContributedState, updateMaterializedViews', async () => {
            when(spyDBany).calledWith(updateContributionDetails, [
                testSentenceId,
                contributor_id,
                testAudioPath,
                language,
                testAudioDuration,
                testState,
                testCountry,
            ]).mockReturnValue(Promise.resolve());

            await dbOperations.updateDbWithAudioPath(
                testAudioPath,
                testSentenceId,
                testUserId,
                testUserName,
                testState,
                testCountry,
                testAudioDuration,
                language,
                callback
            )

            expect(spyDBany).toHaveBeenCalledWith(
                updateContributionDetails,
                [
                    testSentenceId,
                    contributor_id,
                    testAudioPath,
                    language,
                    testAudioDuration,
                    testState,
                    testCountry
                ]
            );

            expect(spyDBnone).toHaveBeenCalledWith(
                updateMediaWithContributedState,
                [testSentenceId]
            );

            expect(spyDBnone).toHaveBeenCalledWith(updateMaterializedViews);
        });

        test('call query with rounded audio duration', async () => {
            const testAudioDuration = 4.78951;
            const expectedAudioDuration = 4.79;
            when(spyDBany).calledWith(updateContributionDetails,
                [
                    testSentenceId,
                    contributor_id,
                    testAudioPath,
                    language,
                    expectedAudioDuration,
                    testState,
                    testCountry,
                ]).mockReturnValue(Promise.resolve());

            await dbOperations.updateDbWithAudioPath(
                testAudioPath,
                testSentenceId,
                testUserId,
                testUserName,
                testState,
                testCountry,
                testAudioDuration,
                language,
                callback
            )

            expect(spyDBany).toHaveBeenCalledWith(
                updateContributionDetails,
                [
                    testSentenceId,
                    contributor_id,
                    testAudioPath,
                    language,
                    expectedAudioDuration,
                    testState,
                    testCountry,
                ]
            );

            expect(spyDBnone).toHaveBeenCalledWith(
                updateMediaWithContributedState,
                [testSentenceId]
            )
        });
    });

    test('Update DB with user input should call query with correct parameters', async () => {
        const testUserInput = 'testPath';
        const testSentenceId = 1;
        const testUserId = 123;
        const testUserName = 'testName';
        const testState = 'testState';
        const testCountry = 'testCountry';
        const contributor_id = 27;
        const language = 'Tamil';

        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [testUserId, testUserName]).mockReturnValue({ 'contributor_id': contributor_id });
        when(spyDBany).calledWith(updateContributionDetailsWithUserInput,
            [
                testSentenceId,
                contributor_id,
                testUserInput,
                language,
                testState,
                testCountry
            ]).mockReturnValue(Promise.resolve());

        await dbOperations.updateDbWithUserInput(
            testUserName,
            testUserId,
            language,
            testUserInput,
            testSentenceId,
            testState,
            testCountry
        )

        expect(spyDBany).toHaveBeenCalledWith(
            updateContributionDetailsWithUserInput,
            [
                testSentenceId,
                contributor_id,
                testUserInput,
                language,
                testState,
                testCountry
            ]
        );

        expect(spyDBnone).toHaveBeenCalledWith(
            updateMediaWithContributedState,
            [testSentenceId]
        )
    });

    test('getContributionList should call getContributionListQuery query once with language', async () => {
        const language = 'testLanguage';
        const userId = 123;
        const type = 'text'
        const userName = 'name';
        const contributorId = 1;
        const req = { params: { type: type }, query: { from: language, userName: userName }, cookies: { userId } };
        const spyDBany = jest.spyOn(mockDB, 'any')
        const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone')
        when(spyDBany).calledWith(getContributionListQuery, [contributorId, type, language, undefined]).mockReturnValue(Promise.resolve())
        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ contributor_id: contributorId })

        await dbOperations.getContributionList(req, res);

        expect(spyDBany).toHaveBeenCalledWith(getContributionListQuery, [contributorId, type, language, undefined]);
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

    const mockpgp = require('pg-promise')()
    mockpgp.as = jest.fn()
    const type = 'text';
    mockpgp.as.format = jest.fn().mockReturnValue(type)

    test('Get top language by hours', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')

        dbOperations.getTopLanguageByHours(type);

        expect(spyDBany).toHaveBeenCalledWith(topLanguagesByHoursContributed, type);
    });

    test('Get top language by speakers', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')

        dbOperations.getTopLanguageBySpeakers(type);

        expect(spyDBany).toHaveBeenCalledWith(topLanguagesBySpeakerContributions, type);
    });

    test('Get languages', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')

        dbOperations.getLanguages(type);

        expect(spyDBany).toHaveBeenCalledWith(listLanguages, type);
    });

    test('Insert Feedback', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const subject = 'subject'
        const feedback = 'test feedback'
        const language = 'testLanguage'

        dbOperations.insertFeedback(subject, feedback, language);

        expect(spyDBany).toHaveBeenCalledWith(feedbackInsertion, [subject, feedback, language])
    });

    test('Save Report', async () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone')
        const userId = '123'
        const sentenceId = '456'
        const language = 'testLanguage'
        const reportText = 'report text'
        const userName = 'test user'
        const source = 'contribution'
        const contributor_id = 10
        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ 'contributor_id': contributor_id });

        await dbOperations.saveReport(userId, sentenceId, reportText, language, userName, source);

        expect(spyDBany).toHaveBeenCalledWith(saveReportQuery, [contributor_id, sentenceId, reportText, language, source])
    });

    test('Mark Skipped Contribution', async () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone')
        const userId = '123'
        const sentenceId = '456'
        const userName = 'test user'
        const contributor_id = 10
        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ 'contributor_id': contributor_id });

        await dbOperations.markContributionSkipped(userId, sentenceId, userName);

        expect(spyDBany).toHaveBeenCalledWith(markContributionSkippedQuery, [contributor_id, sentenceId])
    });

    test('Get Rewards info', () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const type = 'testType'
        const source = 'testSource'
        const language = 'testLanguage'

        dbOperations.getRewardsInfo(type, source, language);

        expect(spyDBany).toHaveBeenCalledWith(rewardsInfoQuery, [type, source, language])
    });

    describe('Test Get Rewards', () => {
        const userId = '123'
        const userName = 'test user'
        const categoryContribute = 'contribute'
        const categoryValidate = 'validate'
        const language = 'testLanguage'
        const type = 'type'
        const contributor_id = 10
        const contribution_count = 1
        const milestoneId = 1
        const validation_count = 2
        const bronzeBadge = 1, silverBadge = 2, goldBadge = 3;
        // one or None - get contributor id
        // any - total contributions
        // one - total validations
        // one or None - current milestone data
        // any - actual badges <= current nearest milestone
        // any - find my badges
        // any (n times)- insert rewards that are missed due to not being validated
        // any - insert rewards for latest nearest milestone
        // one or None - next Milestone data
        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ 'contributor_id': contributor_id });
        when(spyDBany).calledWith(getTotalUserContribution, [contributor_id, language, type]).mockReturnValue([{ 'contribution_id': 1234 }]);
        when(spyDBany).calledWith(getTotalUserValidation, [contributor_id, language, type]).mockReturnValue([{ 'contribution_id': 1234 }]);
        when(spyDBone).calledWith(getContributionHoursForLanguage, [language]).mockReturnValue(10);
        when(spyDBoneOrNone).calledWith(getMultiplierForHourGoal, [language]).mockReturnValue(100);
        when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([{ grade: 'bronze', id: 23, milestone: 5 }, { grade: 'silver', id: 24, milestone: 50 }, { grade: 'gold', id: 25, milestone: 100 }])
        when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, type]).mockReturnValue([]);
        when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryValidate, type]).mockReturnValue([]);
        when(spyDBany).calledWith(insertRewardQuery, [contributor_id, bronzeBadge]).mockReturnValue([{ 'generated_badge_id': bronzeBadge }]);
        when(spyDBany).calledWith(insertRewardQuery, [contributor_id, silverBadge]).mockReturnValue([{ 'generated_badge_id': silverBadge }]);
        when(spyDBany).calledWith(insertRewardQuery, [contributor_id, goldBadge]).mockReturnValue([{ 'generated_badge_id': goldBadge }]);
        when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, type]).mockReturnValue({ 'grade': 'silver', 'milestone': 100 });
        when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryValidate, type]).mockReturnValue({ 'grade': 'silver', 'milestone': 100 });
        when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, type, categoryContribute]).mockReturnValue({ 'milestone_id': milestoneId, 'grade': 'copper', 'milestone': 100 });
        when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, type, categoryValidate]).mockReturnValue({ 'milestone_id': milestoneId, 'grade': 'copper', 'milestone': 100 });

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call queries for rewards data if user found for contribute', async () => {
            await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(1, getContributorIdQuery, [userId, userName])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(2, checkCurrentMilestoneQuery, [contribution_count, language, type, categoryContribute])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(3, checkNextMilestoneQuery, [contribution_count, language, categoryContribute, type])
            expect(spyDBany).toHaveBeenCalledWith(getTotalUserContribution, [contributor_id, language, type])
        });

        test('should call queries for rewards data if user found for validate', async () => {
            await dbOperations.getRewards(userId, userName, language, categoryValidate, type);

            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(1, getContributorIdQuery, [userId, userName])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(2, checkCurrentMilestoneQuery, [contribution_count, language, type, categoryValidate])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(3, checkNextMilestoneQuery, [contribution_count, language, categoryValidate, type])
            expect(spyDBany).toHaveBeenCalledWith(getTotalUserValidation, [contributor_id, language, type])
        });

        describe('Test get contributor id', () => {

            test('should call addContributorQuery if user not found', async () => {
                when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue(null);
                when(spyDBone).calledWith(addContributorQuery, [userId, userName, '', '', '']).mockReturnValue({ 'contributor_id': contributor_id });

                await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

                await expect(spyDBone).toBeCalledWith(addContributorQuery, [userId, userName, '', '', '']);
                jest.clearAllMocks();
            });

            test('should return contributor id', async () => {
                when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ 'contributor_id': contributor_id });

                await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(getContributorIdQuery, [userId, userName])
                jest.clearAllMocks();
            });
        })

        describe('Test create badge', () => {

            test('should call insertRewardQuery id rewardsList is empty', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, type]).mockReturnValue([]);

                await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

                expect(spyDBany).toHaveBeenCalledWith(findRewardInfo, [contributor_id, language, categoryContribute, type])
                expect(spyDBany).toHaveBeenCalledWith(insertRewardQuery, [contributor_id, expect.anything()])
                jest.clearAllMocks()
            });

            test('should not call insertRewardQuery if matched badge', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, type]).mockReturnValue([{ "milestone_id": milestoneId }]);

                await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

                expect(spyDBany).toHaveBeenCalledWith(findRewardInfo, [contributor_id, language, categoryContribute, type])
                expect(spyDBany).not.toHaveBeenCalledWith(insertRewardQuery, [contributor_id, expect.anything()]);
                jest.clearAllMocks();
            });
        });

        describe('Test get current milestone data', () => {

            test('get current milestone data if exists', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, type]).mockReturnValue([]);
                when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, type, categoryContribute]).mockReturnValue({ 'milestone_id': 1, 'grade': 'copper', 'milestone': 100 });

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, type])
                expect(result.currentMilestone).toBe(100)
                expect(result.currentBadgeType).toBe('copper')
                jest.clearAllMocks();
            });

            test('get current milestone as 0 if data not exists', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, type]).mockReturnValue([]);
                when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, type, categoryContribute]).mockReturnValue(null);

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, type])
                expect(result.currentMilestone).toBe(0)
                expect(result.currentBadgeType).toBe('')
                jest.clearAllMocks();
            });
        });

        describe('Test get next milestone data', () => {

            test('get next milestone data if exists', async () => {
                when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, type]).mockReturnValue({ 'milestone_id': 2, 'grade': 'silver', 'milestone': 200 });

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, type])
                expect(result.nextMilestone).toBe(200)
                expect(result.nextBadgeType).toBe('silver')
                jest.clearAllMocks();
            });

            test('get next milestone as 0 if data not exists', async () => {
                when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, type]).mockReturnValue({});

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, type);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, type])
                expect(result.nextMilestone).toBe(0)
                expect(result.nextBadgeType).toBe('')
                jest.clearAllMocks();
            });
        });
    });

    describe('Test Update Tables after validation', () => {
        const sentenceId = 1;
        const contributionId = 1;
        const state = 'Test State';
        const country = 'Test Country';
        const userId = 123;
        const contributorId = 1;
        const userName = 'name';

        test('should call addValidationQuery and updateMediaWithValidatedState if action is accept/reject', async () => {
            spyDBnone.mockReturnValue(Promise.resolve())
            when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ contributor_id: contributorId })
            const action = 'accept';

            const req = { 'body': { sentenceId, state, country, userName }, 'cookies': { userId }, params: { action, contributionId } }

            await dbOperations.updateTablesAfterValidation(req, res);

            expect(spyDBnone).toHaveBeenNthCalledWith(1, addValidationQuery, [contributorId, sentenceId, action, contributionId, state, country]);
            expect(spyDBnone).toHaveBeenNthCalledWith(2, updateMediaWithValidatedState, [sentenceId, contributionId])
        });

        test('should only call addValidationQuery if action is skip', async () => {
            spyDBnone.mockReturnValue(Promise.resolve())
            when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ contributor_id: contributorId })
            const action = 'skip';

            const req = { 'body': { sentenceId, state, country, userName }, 'cookies': { userId }, params: { action, contributionId } }

            await dbOperations.updateTablesAfterValidation(req, res);

            expect(spyDBnone).toBeCalledWith(addValidationQuery, [contributorId, sentenceId, action, contributionId, state, country]);
            expect(spyDBnone).toBeCalledTimes(1);
        })
    })

    describe('Test getAvailableLanguages', () => {
        const type = 'text'
        const req = { params: { type: type } };

        test('should call getDatasetLanguagesQuery and getContributionLanguagesQuery', async () => {
            when(spyDBmany).calledWith(getDatasetLanguagesQuery, [type]).mockReturnValue([{ data_language: '' }]);
            when(spyDBmany).calledWith(getContributionLanguagesQuery, [type]).mockReturnValue([{ from_language: '', to_language: '' }]);

            await dbOperations.getAvailableLanguages(req, res);

            expect(spyDBmany).toBeCalledWith(getDatasetLanguagesQuery, [type]);
            expect(spyDBmany).toBeCalledWith(getContributionLanguagesQuery, [type]);
        })

        test('should return results in given format', async () => {
            const langOne = 'language1';
            const langTwo = 'language2';
            const langThree = 'language3';
            const mockSend = { send: jest.fn() };
            const mockStatus = { status: jest.fn().mockReturnValue(mockSend) };
            const response = mockStatus;
            when(spyDBmany).calledWith(getDatasetLanguagesQuery, [type]).mockReturnValue([{ data_language: langOne }, { data_language: langTwo }]);
            when(spyDBmany).calledWith(getContributionLanguagesQuery, [type]).mockReturnValue([
                { from_language: langOne, to_language: langThree },
                { from_language: langTwo, to_language: langOne },
                { from_language: langTwo, to_language: langThree }]);
            const spySend = jest.spyOn(mockSend, 'send')
            const spyStatus = jest.spyOn(mockStatus, 'status')

            await dbOperations.getAvailableLanguages(req, response);

            expect(spyStatus).toBeCalledWith(200)
            expect(spySend).toBeCalledWith({ "datasetLanguages": ["language1", "language2"], "contributionLanguages": { "language1": ["language3"], "language2": ["language1", "language3"] } })
        })
    });
});
