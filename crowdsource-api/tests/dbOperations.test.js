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
    getOrderedMediaQuery,
    updateViews,
    updateMaterializedViews,
    getContributionListQuery,
    getDatasetLanguagesQuery,
    getContributionLanguagesQuery,
    hasTargetQuery,
    isAllContributedQuery,
    getDataRowInfo,
    getOrderedUniqueMediaQuery,
    getLanguageGoal,
    getLanguageGoalQuery,
    getContributionAmount,
    getValidationAmount,
    getContributionHoursForText,
    getValidationHoursForText,
    getContributionHoursForAsr,
    getValidationHoursForAsr
} = require('./../src/dbQuery');

const {
    languageGoalQuery, currentProgressQuery, participationStatsQuery
} = require('./../src/dashboardDbQueries');

const mockDB = {
    many: jest.fn(() => Promise.resolve()),
    one: jest.fn(() => Promise.resolve()),
    none: jest.fn(() => Promise.resolve()),
    any: jest.fn(() => Promise.resolve()),
    oneOrNone: jest.fn(() => Promise.resolve()),
    result: jest.fn(() => Promise.resolve()),
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
    const mockpgp = require('pg-promise')()
    const type = 'text';
    const spyDBany = jest.spyOn(mockDB, 'any');
    const spyDBnone = jest.spyOn(mockDB, 'none');
    const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone');
    const spyDBmany = jest.spyOn(mockDB, 'many');
    const spyDBone = jest.spyOn(mockDB, 'one');
    const spyDBresult = jest.spyOn(mockDB, 'result');

    beforeEach(() => {
        mockpgp.as = jest.fn()
        mockpgp.as.format = jest.fn().mockReturnValue(type);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('tests for getMediaBasedOnAge', () => {
        const testUserId = "abcdefghi", testUsername = "test_username";
        const language = "Hindi", ageGroup = "10-20", toLanguage = "Tamil"
        const mediumLabel = 'medium';

        afterEach(() => {
            jest.clearAllMocks();
        })

        test("should return expected result", () => {
            const mockResult = [
                { sentenceId: 1, media_data: "Mock sentence 1" },
                { sentenceId: 2, media_data: "Mock sentence 2" },
                { sentenceId: 3, media_data: "Mock sentence 3" }
            ];

            spyDBany.mockReturnValue(mockResult);

            const result = dbOperations.getMediaBasedOnAge(ageGroup, testUserId, testUsername, language, type, toLanguage);

            expect(result).toEqual(mockResult);
        });

        test('should call query with label medium for kids', () => {
            dbOperations.getMediaBasedOnAge(ageGroup, testUserId, testUsername, language, type, toLanguage)

            expect(spyDBany).toHaveBeenCalledWith(getOrderedUniqueMediaQuery, [testUserId, testUsername, mediumLabel, language, type, expect.anything()]);
        });

        test('should call query with label medium for adults', () => {
            dbOperations.getMediaBasedOnAge(ageGroup, testUserId, testUsername, language, type, toLanguage)

            expect(spyDBany).toHaveBeenCalledWith(getOrderedUniqueMediaQuery, [testUserId, testUsername, mediumLabel, language, type, expect.anything()]);
        })
    });

    describe('Update DB methods', () => {
        const testDatasetId = 1, testUserId = 123, contributor_id = 27;
        const testUserName = 'testName', testState = 'testState', testCountry = 'testCountry';
        const age = '', gender = '', motherTongue = '', device = '', browser = '', type = 'asr';
        const languageOne = 'Tamil', languageTwo = 'Hindi';
        const mockCb = jest.fn();

        afterEach(() => {
            jest.resetAllMocks();
        })

        describe('Update DB with audio path', () => {
            const testAudioPath = 'testPath';
            const testAudioDuration = 10;

            beforeEach(() => {
                when(spyDBoneOrNone).calledWith(getDataRowInfo, [testDatasetId]).mockReturnValue({ type: 'text', language: languageOne });
                when(spyDBoneOrNone).calledWith(getContributorIdQuery, [testUserId, testUserName]).mockReturnValue({ 'contributor_id': contributor_id });
                when(spyDBany).calledWith(updateContributionDetails, [
                    testDatasetId,
                    contributor_id,
                    testAudioPath,
                    languageOne,
                    testAudioDuration,
                    testState,
                    testCountry,
                    device,
                    browser
                ]).mockReturnValue(Promise.resolve());
                when(spyDBresult).calledWith(updateMediaWithContributedState, [testDatasetId]).mockReturnValue(Promise.resolve());
                // when(spyDBnone).calledWith(updateMaterializedViews).mockReturnValue(Promise.resolve());
            })

            afterEach(() => {
                jest.clearAllMocks();
            })

            test('should respond bad request when different from and to languages for text/asr/ocr types', async () => {
                await dbOperations.updateDbWithAudioPath(
                    testAudioPath, testDatasetId, testUserId,
                    testUserName, testState, testCountry,
                    testAudioDuration, languageTwo, age, gender,
                    motherTongue, device, browser, type, mockCb
                );
                expect(mockCb).toBeCalledWith(400, expect.anything())
            });

            test('should respond bad request when same from and to languages for parallel type', async () => {
                when(spyDBoneOrNone).calledWith(getDataRowInfo, [testDatasetId]).mockReturnValue({ type: 'parallel', language: languageOne });
                await dbOperations.updateDbWithAudioPath(
                    testAudioPath, testDatasetId, testUserId,
                    testUserName, testState, testCountry,
                    testAudioDuration, languageOne, age, gender,
                    motherTongue, device, browser, type, mockCb
                );
                expect(mockCb).toBeCalledWith(400, expect.anything())
            });

            test('should call updateContributionDetails, updateMediaWithContributedState, updateMaterializedViews', async () => {
                await dbOperations.updateDbWithAudioPath(
                    testAudioPath,
                    testDatasetId,
                    testUserId,
                    testUserName,
                    testState,
                    testCountry,
                    testAudioDuration,
                    languageOne,
                    age,
                    gender,
                    motherTongue,
                    device, browser,
                    mockCb
                )

                expect(spyDBany).toHaveBeenCalledWith(
                    updateContributionDetails,
                    [
                        testDatasetId,
                        contributor_id,
                        testAudioPath,
                        languageOne,
                        testAudioDuration,
                        testState,
                        testCountry,
                        device,
                        browser
                    ]
                );

                expect(spyDBresult).toHaveBeenCalledWith(
                    updateMediaWithContributedState,
                    [testDatasetId]
                );

                //expect(spyDBnone).toHaveBeenCalledWith(updateMaterializedViews);
            });

            test('call query with rounded audio duration', async () => {
                const testAudioDuration = 4.78951;
                const expectedAudioDuration = 4.79;
                when(spyDBany).calledWith(updateContributionDetails,
                    [
                        testDatasetId,
                        contributor_id,
                        testAudioPath,
                        languageOne,
                        expectedAudioDuration,
                        testState,
                        testCountry,
                        device, browser
                    ]).mockReturnValue(Promise.resolve());

                await dbOperations.updateDbWithAudioPath(
                    testAudioPath,
                    testDatasetId,
                    testUserId,
                    testUserName,
                    testState,
                    testCountry,
                    testAudioDuration,
                    languageOne,
                    age,
                    gender,
                    motherTongue,
                    device,
                    browser,
                    mockCb
                )

                expect(spyDBany).toHaveBeenCalledWith(
                    updateContributionDetails,
                    [
                        testDatasetId,
                        contributor_id,
                        testAudioPath,
                        languageOne,
                        expectedAudioDuration,
                        testState,
                        testCountry,
                        device,
                        browser
                    ]
                );

                expect(spyDBresult).toHaveBeenCalledWith(
                    updateMediaWithContributedState,
                    [testDatasetId]
                )
            });
        });

        describe('Update DB with user input', () => {
            const testUserInput = 'testPath';

            beforeEach(() => {
                when(spyDBoneOrNone).calledWith(getContributorIdQuery, [testUserId, testUserName]).mockReturnValue({ 'contributor_id': contributor_id });
                when(spyDBoneOrNone).calledWith(getDataRowInfo, [testDatasetId]).mockReturnValue({ type: 'text', language: languageOne });
                when(spyDBany).calledWith(updateContributionDetailsWithUserInput,
                    [
                        testDatasetId,
                        contributor_id,
                        testUserInput,
                        languageOne,
                        testState,
                        testCountry,
                        device,
                        browser
                    ]).mockReturnValue(Promise.resolve());
            })

            afterEach(() => {
                jest.clearAllMocks();
            })

            test('should respond bad request when different from and to languages for text/asr/ocr types', async () => {
                await dbOperations.updateDbWithUserInput(
                    testUserName,
                    testUserId, languageTwo, testUserInput,
                    testDatasetId, testState, testCountry,
                    age, gender,
                    motherTongue, device, browser, type, '', mockCb
                );
                expect(mockCb).toBeCalledWith(400, expect.anything())
            });

            test('should respond bad request when same from and to languages for parallel type', async () => {
                when(spyDBoneOrNone).calledWith(getDataRowInfo, [testDatasetId]).mockReturnValue({ type: 'parallel', language: languageOne });
                await dbOperations.updateDbWithUserInput(
                    testUserName,
                    testUserId, languageOne, testUserInput,
                    testDatasetId, testState, testCountry,
                    age, gender,
                    motherTongue, device, browser, type, languageTwo, mockCb
                );
                expect(mockCb).toBeCalledWith(400, expect.anything())
            });

            test('should call query with correct parameters', async () => {
                await dbOperations.updateDbWithUserInput(
                    testUserName,
                    testUserId,
                    languageOne,
                    testUserInput,
                    testDatasetId,
                    testState,
                    testCountry,
                    age,
                    gender,
                    motherTongue,
                    device, browser,
                    mockCb
                )

                expect(spyDBany).toHaveBeenCalledWith(
                    updateContributionDetailsWithUserInput,
                    [
                        testDatasetId,
                        contributor_id,
                        testUserInput,
                        languageOne,
                        testState,
                        testCountry,
                        device,
                        browser
                    ]
                );

                expect(spyDBresult).toHaveBeenCalledWith(
                    updateMediaWithContributedState,
                    [testDatasetId]
                )
            });
        })
    })

    // test('getContributionList should call getContributionListQuery query once with language', async () => {
    //     const language = 'testLanguage';
    //     const userId = 123;
    //     const type = 'text'
    //     const userName = 'name';
    //     const contributorId = 1;
    //     const req = { params: { type: type }, query: { from: language, username: userName }, cookies: { userId } };
    //     const spyDBany = jest.spyOn(mockDB, 'any')
    //     const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone')
    //     when(spyDBany).calledWith(getContributionListQuery, [contributorId, type, language, '']).mockReturnValue(Promise.resolve())
    //     when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ contributor_id: contributorId })

    //     await dbOperations.getContributionList(req, res);

    //     expect(spyDBany).toHaveBeenCalledWith(getContributionListQuery, [contributorId, type, language, '']);
    //     jest.clearAllMocks();
    // });

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
        const spyDBany = jest.spyOn(mockDB, 'any');
        const category = '';
        const feedback = '';
        const email = 'example@gmail.com';
        const language = 'testLanguage';
        const module = 'bolo';
        const target_page = 'Landing Page';
        const opinion_rating = 3;
        const recommended = 'yes';
        const revisit = 'no'

        dbOperations.insertFeedback(email, feedback, category, language, module, target_page, opinion_rating, recommended, revisit);

        expect(spyDBany).toHaveBeenCalledWith(feedbackInsertion, [email, feedback, category, language, module, target_page, opinion_rating, recommended, revisit]);
    });

    test('Save Report', async () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone')
        const userId = '123'
        const datasetId = '456'
        const language = 'testLanguage'
        const reportText = 'report text'
        const userName = 'test user'
        const source = 'contribution'
        const contributor_id = 10
        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ 'contributor_id': contributor_id });

        await dbOperations.saveReport(userId, datasetId, reportText, language, userName, source);

        expect(spyDBany).toHaveBeenCalledWith(saveReportQuery, [contributor_id, datasetId, reportText, language, source])
    });

    test('Mark Skipped Contribution', async () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone')
        const userId = '123'
        const datasetId = '456'
        const userName = 'test user'
        const contributor_id = 10
        const language = 'Hindi';
        const country = "india";
        const state_region = "state";
        const device = "OSX";
        const browser = "CHROME";
        when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ 'contributor_id': contributor_id });

        await dbOperations.markContributionSkipped(userId, datasetId, userName, language, state_region, country, device, browser);

        expect(spyDBany).toHaveBeenCalledWith(markContributionSkippedQuery, [contributor_id, datasetId, language, state_region, country, device, browser])
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
        const contributor_id = 10
        const contribution_count = 1
        const milestoneId = 1
        const bronzeBadge = 1, silverBadge = 2, goldBadge = 3;
        const textType = 'text';
        const asrType = 'asr';
        const ocrType = 'ocr';
        const parallelType = 'parallel';
        // one or None - get contributor id
        // any - total contributions
        // one - total validations
        // one or None - current milestone data
        // any - actual badges <= current nearest milestone
        // any - find my badges
        // any (n times)- insert rewards that are missed due to not being validated
        // any - insert rewards for latest nearest milestone
        // one or None - next Milestone data

        beforeEach(() => {
            when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ 'contributor_id': contributor_id });
            when(spyDBany).calledWith(getTotalUserContribution, [contributor_id, language, textType]).mockReturnValue([{ 'contribution_id': 1234 }]);
            when(spyDBany).calledWith(getTotalUserValidation, [contributor_id, language, textType]).mockReturnValue([{ 'contribution_id': 1234 }]);
            when(spyDBone).calledWith(getContributionHoursForLanguage, [language]).mockReturnValue(10);
            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [categoryContribute, textType, language]).mockReturnValue(100);
            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [categoryContribute, asrType, language]).mockReturnValue(100);
            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [categoryContribute, parallelType, language]).mockReturnValue(100);
            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [categoryContribute, ocrType, language]).mockReturnValue(100);
            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [categoryValidate, textType, language]).mockReturnValue(100);
            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [categoryValidate, asrType, language]).mockReturnValue(100);
            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [categoryValidate, parallelType, language]).mockReturnValue(100);
            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [categoryValidate, ocrType, language]).mockReturnValue(100);
            when(spyDBoneOrNone).calledWith(getContributionHoursForText, [language, textType]).mockReturnValue(5.5);
            when(spyDBoneOrNone).calledWith(getValidationHoursForText, [language, textType]).mockReturnValue(2.3);
            when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([{ grade: 'bronze', id: 23, milestone: 5 }, { grade: 'silver', id: 24, milestone: 50 }, { grade: 'gold', id: 25, milestone: 100 }])
            when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([]);
            when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryValidate, textType]).mockReturnValue([]);
            when(spyDBany).calledWith(insertRewardQuery, [contributor_id, bronzeBadge]).mockReturnValue([{ 'generated_badge_id': bronzeBadge }]);
            when(spyDBany).calledWith(insertRewardQuery, [contributor_id, silverBadge]).mockReturnValue([{ 'generated_badge_id': silverBadge }]);
            when(spyDBany).calledWith(insertRewardQuery, [contributor_id, goldBadge]).mockReturnValue([{ 'generated_badge_id': goldBadge }]);
            when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType]).mockReturnValue({ 'grade': 'silver', 'milestone': 100 });
            when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryValidate, textType]).mockReturnValue({ 'grade': 'silver', 'milestone': 100 });
            when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryContribute]).mockReturnValue({ 'milestone_id': milestoneId, 'grade': 'copper', 'milestone': 100 });
            when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryValidate]).mockReturnValue({ 'milestone_id': milestoneId, 'grade': 'copper', 'milestone': 100 });
        })

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call queries for rewards data if user found for contribute', async () => {
            await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(1, getContributorIdQuery, [userId, userName])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(2, checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryContribute])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(3, checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(4, getLanguageGoalQuery, [categoryContribute, textType, language])
            expect(spyDBany).toHaveBeenCalledWith(getTotalUserContribution, [contributor_id, language, textType])
        });

        test('should call queries for rewards data if user found for validate', async () => {
            await dbOperations.getRewards(userId, userName, language, categoryValidate, textType);

            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(1, getContributorIdQuery, [userId, userName])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(2, checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryValidate])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(3, checkNextMilestoneQuery, [contribution_count, language, categoryValidate, textType])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(4, getLanguageGoalQuery, [categoryValidate, textType, language])
            expect(spyDBany).toHaveBeenCalledWith(getTotalUserValidation, [contributor_id, language, textType])
        });

        describe('Test get contributor id', () => {

            test('should call addContributorQuery if user not found', async () => {
                when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue(null);
                when(spyDBone).calledWith(addContributorQuery, [userId, userName, '', '', '']).mockReturnValue({ 'contributor_id': contributor_id });

                await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                await expect(spyDBone).toBeCalledWith(addContributorQuery, [userId, userName, '', '', '']);
                jest.clearAllMocks();
            });

            test('should return contributor id', async () => {
                when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ 'contributor_id': contributor_id });

                await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(getContributorIdQuery, [userId, userName])
                jest.clearAllMocks();
            });
        })

        describe('Test create badge', () => {

            test('should call insertRewardQuery id rewardsList is empty', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([]);

                await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBany).toHaveBeenCalledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType])
                expect(spyDBany).toHaveBeenCalledWith(insertRewardQuery, [contributor_id, expect.anything()])
                jest.clearAllMocks()
            });

            test('should not call insertRewardQuery if matched badge', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([{ "milestone_id": milestoneId }]);

                await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBany).toHaveBeenCalledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType])
                expect(spyDBany).not.toHaveBeenCalledWith(insertRewardQuery, [contributor_id, expect.anything()]);
                jest.clearAllMocks();
            });
        });

        describe('Test get current milestone data', () => {

            test('get current milestone data if exists', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([]);
                when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryContribute]).mockReturnValue({ 'milestone_id': 1, 'grade': 'copper', 'milestone': 100 });

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType])
                expect(result.currentMilestone).toBe(100)
                expect(result.currentBadgeType).toBe('copper')
                jest.clearAllMocks();
            });

            test('get current milestone as 0 if data not exists', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([]);
                when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryContribute]).mockReturnValue(null);

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType])
                expect(result.currentMilestone).toBe(0)
                expect(result.currentBadgeType).toBe('')
                jest.clearAllMocks();
            });
        });

        describe('Test get next milestone data', () => {

            test('get next milestone data if exists', async () => {
                when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType]).mockReturnValue({ 'milestone_id': 2, 'grade': 'silver', 'milestone': 200 });

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType])
                expect(result.nextMilestone).toBe(200)
                expect(result.nextBadgeType).toBe('silver')
                jest.clearAllMocks();
            });

            test('get next milestone as 0 if data not exists', async () => {
                when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType]).mockReturnValue({});

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType])
                expect(result.nextMilestone).toBe(0)
                expect(result.nextBadgeType).toBe('')
                jest.clearAllMocks();
            });
        });

        describe('test get current amount', () => {

            test('should call getContributionHoursForText for type text contribute', async () => {
                when(spyDBoneOrNone).calledWith(getContributionHoursForText, [language, textType]).mockReturnValue({ amount: 10 })
                await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);
                expect(spyDBoneOrNone).toBeCalledWith(getContributionHoursForText, [language, textType])
            });

            test('should call getContributionHoursForAsr for type asr contribute', async () => {
                when(spyDBoneOrNone).calledWith(getContributionHoursForAsr, [language, asrType]).mockReturnValue({ amount: 10 })
                await dbOperations.getRewards(userId, userName, language, categoryContribute, asrType);
                expect(spyDBoneOrNone).toBeCalledWith(getContributionHoursForAsr, [language, asrType])
            });

            test('should call getContributionAmount for type ocr contribute', async () => {
                when(spyDBoneOrNone).calledWith(getContributionAmount, [language, ocrType]).mockReturnValue({ amount: 10 })
                await dbOperations.getRewards(userId, userName, language, categoryContribute, ocrType);
                expect(spyDBoneOrNone).toBeCalledWith(getContributionAmount, [language, ocrType])
            });

            test('should call getContributionAmount for type parallel contribute', async () => {
                when(spyDBoneOrNone).calledWith(getContributionAmount, [language, parallelType]).mockReturnValue({ amount: 10 })
                await dbOperations.getRewards(userId, userName, language, categoryContribute, parallelType);
                expect(spyDBoneOrNone).toBeCalledWith(getContributionAmount, [language, parallelType])
            });

            test('should call getValidationAmount for type ocr validate', async () => {
                when(spyDBoneOrNone).calledWith(getValidationAmount, [language, ocrType]).mockReturnValue({ amount: 10 })
                await dbOperations.getRewards(userId, userName, language, categoryValidate, ocrType);
                expect(spyDBoneOrNone).toBeCalledWith(getValidationAmount, [language, ocrType])
            });

            test('should call getValidationAmount for type parallel validate', async () => {
                when(spyDBoneOrNone).calledWith(getValidationAmount, [language, parallelType]).mockReturnValue({ amount: 10 })
                await dbOperations.getRewards(userId, userName, language, categoryValidate, parallelType);
                expect(spyDBoneOrNone).toBeCalledWith(getValidationAmount, [language, parallelType])
            });

            test('should call getValidationHoursForText for type text validate', async () => {
                when(spyDBoneOrNone).calledWith(getValidationHoursForText, [language, textType]).mockReturnValue({ amount: 10 })
                await dbOperations.getRewards(userId, userName, language, categoryValidate, textType);
                expect(spyDBoneOrNone).toBeCalledWith(getValidationHoursForText, [language, textType])
            });

            test('should call getValidationHoursForAsr for type asr validate', async () => {
                when(spyDBoneOrNone).calledWith(getValidationHoursForAsr, [language, asrType]).mockReturnValue({ amount: 10 })
                await dbOperations.getRewards(userId, userName, language, categoryValidate, asrType);
                expect(spyDBoneOrNone).toBeCalledWith(getValidationHoursForAsr, [language, asrType])
            });
        })
    });

    describe('Test language-goal', () => {

        test('should call getLanguageGoalQuery and return goal', async () => {
            const goal = 100;
            const type = 'text', language = 'Hindi', source = 'contribute';
            const mockSend = { send: jest.fn() };
            const mockStatus = { status: jest.fn().mockReturnValue(mockSend), send: jest.fn() };
            const response = mockStatus;
            const req = { params: { type, language, source } }

            when(spyDBoneOrNone).calledWith(getLanguageGoalQuery, [source, type, language]).mockReturnValue({ goal });

            await dbOperations.languageGoal(req, response);

            expect(mockStatus.status).toBeCalledWith(200)
            expect(mockSend.send).toBeCalledWith({ goal })
        });
    })

    describe('Test Update Tables after validation', () => {
        const datasetId = 1;
        const contributionId = 1;
        const state = 'Test State';
        const country = 'Test Country';
        const userId = 123;
        const contributorId = 1;
        const userName = 'name';
        const device = 'mac';
        const browser = 'chrome';

        test('should call addValidationQuery and updateMediaWithValidatedState if action is accept/reject', async () => {
            spyDBnone.mockReturnValue(Promise.resolve())
            spyDBresult.mockReturnValue(Promise.resolve())
            when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ contributor_id: contributorId })
            const action = 'accept';

            const req = { 'body': { sentenceId: datasetId, state, country, userName, device, browser }, 'cookies': { userId }, params: { action, contributionId } }

            await dbOperations.updateTablesAfterValidation(req, res);

            expect(spyDBresult).toHaveBeenNthCalledWith(1, addValidationQuery, [contributorId, datasetId, action, contributionId, state, country, device, browser]);
            expect(spyDBresult).toHaveBeenNthCalledWith(2, updateMediaWithValidatedState, [datasetId, contributionId])
        });

        test('should only call addValidationQuery if action is skip', async () => {
            spyDBnone.mockReturnValue(Promise.resolve())
            spyDBresult.mockReturnValue(Promise.resolve())
            when(spyDBoneOrNone).calledWith(getContributorIdQuery, [userId, userName]).mockReturnValue({ contributor_id: contributorId })
            const action = 'skip';

            const req = { 'body': { sentenceId: datasetId, state, country, userName, device, browser }, 'cookies': { userId }, params: { action, contributionId } }

            await dbOperations.updateTablesAfterValidation(req, res);

            expect(spyDBresult).toBeCalledWith(addValidationQuery, [contributorId, datasetId, action, contributionId, state, country, device, browser]);
            expect(spyDBresult).toBeCalledTimes(1);
        })
    })

    describe('Test getAvailableLanguages', () => {
        const type = 'text'
        const req = { params: { type: type } };

        test('should call getDatasetLanguagesQuery and getContributionLanguagesQuery', async () => {
            when(spyDBany).calledWith(getDatasetLanguagesQuery, [type]).mockReturnValue([{ language: '' }]);

            await dbOperations.getAvailableLanguages(req, res);

            expect(spyDBany).toBeCalledWith(getDatasetLanguagesQuery, [type]);
        })

        test('should return results in given format', async () => {
            const langOne = 'language1';
            const langTwo = 'language2';
            const mockSend = { send: jest.fn() };
            const mockStatus = { status: jest.fn().mockReturnValue(mockSend) };
            const response = mockStatus;
            when(spyDBany).calledWith(getDatasetLanguagesQuery, [type]).mockReturnValue([{ language: langOne }, { language: langTwo }]);
            const spySend = jest.spyOn(mockSend, 'send')
            const spyStatus = jest.spyOn(mockStatus, 'status')

            await dbOperations.getAvailableLanguages(req, response);

            expect(spyStatus).toBeCalledWith(200)
            expect(spySend).toBeCalledWith({ "datasetLanguages": ["language1", "language2"] })
        })
    });

    describe('get Target info', () => {
        const textType = 'text';
        const asrType = 'asr';
        const ocrType = 'ocr';
        const parallelType = 'parallel';
        const sourceLanguage = 'Hindi';
        const targetLanguage = 'English';
        when(spyDBone).calledWith(hasTargetQuery, [textType, sourceLanguage, sourceLanguage]).mockReturnValue({ result: true });
        when(spyDBone).calledWith(hasTargetQuery, [asrType, sourceLanguage, sourceLanguage]).mockReturnValue({ result: true });
        when(spyDBone).calledWith(hasTargetQuery, [ocrType, sourceLanguage, sourceLanguage]).mockReturnValue({ result: true });
        when(spyDBone).calledWith(hasTargetQuery, [parallelType, sourceLanguage, targetLanguage]).mockReturnValue({ result: true });
        when(spyDBone).calledWith(isAllContributedQuery, [textType, sourceLanguage, sourceLanguage]).mockReturnValue({ result: true });
        when(spyDBone).calledWith(isAllContributedQuery, [asrType, sourceLanguage, sourceLanguage]).mockReturnValue({ result: true });
        when(spyDBone).calledWith(isAllContributedQuery, [ocrType, sourceLanguage, sourceLanguage]).mockReturnValue({ result: true });
        when(spyDBone).calledWith(isAllContributedQuery, [parallelType, sourceLanguage, targetLanguage]).mockReturnValue({ result: true });

        test('should call queries with target as source language for text type', async () => {
            const req = { params: { type: textType, sourceLanguage: sourceLanguage }, query: {} }

            await dbOperations.getTargetInfo(req, res);

            expect(spyDBone).toBeCalledWith(hasTargetQuery, [textType, sourceLanguage, sourceLanguage]);
            expect(spyDBone).toBeCalledWith(isAllContributedQuery, [textType, sourceLanguage, sourceLanguage]);
        });

        test('should call queries with target as source language for asr type', async () => {
            const req = { params: { type: asrType, sourceLanguage: sourceLanguage }, query: {} }

            await dbOperations.getTargetInfo(req, res);

            expect(spyDBone).toBeCalledWith(hasTargetQuery, [asrType, sourceLanguage, sourceLanguage]);
            expect(spyDBone).toBeCalledWith(isAllContributedQuery, [asrType, sourceLanguage, sourceLanguage]);
        });

        test('should call queries with target as source language for ocr type', async () => {
            const req = { params: { type: ocrType, sourceLanguage: sourceLanguage }, query: {} }

            await dbOperations.getTargetInfo(req, res);

            expect(spyDBone).toBeCalledWith(hasTargetQuery, [ocrType, sourceLanguage, sourceLanguage]);
            expect(spyDBone).toBeCalledWith(isAllContributedQuery, [ocrType, sourceLanguage, sourceLanguage]);
        });

        test('should call queries with target language for parallel type', async () => {
            const req = { params: { type: parallelType, sourceLanguage: sourceLanguage }, query: { targetLanguage: targetLanguage } }

            await dbOperations.getTargetInfo(req, res);

            expect(spyDBone).toBeCalledWith(hasTargetQuery, [parallelType, sourceLanguage, targetLanguage]);
            expect(spyDBone).toBeCalledWith(isAllContributedQuery, [parallelType, sourceLanguage, targetLanguage]);
        });

        test('should return result in given format', async () => {

            const req = { params: { type: textType, sourceLanguage: sourceLanguage }, query: {} }
            const mockSend = { send: jest.fn() };
            const res = { status: jest.fn().mockReturnValue(mockSend) };
            const spySend = jest.spyOn(mockSend, 'send')
            const spyStatus = jest.spyOn(res, 'status')

            await dbOperations.getTargetInfo(req, res);

            // expect(spyStatus).toBeCalledWith(200);
            // expect(spySend).toBeCalledWith({ hasTarget: true, isAllContributed: true });
        })
    });

    describe('add remaining genders to data', () => {

        test('should add data to returned', async () => {
            const genderData = [];
            const allGenders = ['male', 'female', 'others'];

            const result = dbOperations.addRemainingGenders(genderData, allGenders);

            expect(result.length).toBe(3)
        });

        test('should not replace existing data to returned', async () => {
            const genderData = [{ gender: 'male' }];
            const allGenders = ['male', 'female', 'others'];

            const result = dbOperations.addRemainingGenders(genderData, allGenders);

            expect(result.length).toBe(3)
        });

        test('should not delete existing data to returned', async () => {
            const genderData = [{ gender: 'male' }];
            const allGenders = [];

            const result = dbOperations.addRemainingGenders(genderData, allGenders);

            expect(result.length).toBe(1)
        });
    });

    describe('getContributionProgress', () => {
        const textType = 'text';
        const asrType = 'asr';
        const ocrType = 'ocr';
        const parallelType = 'parallel';
        const hindiLanguage = 'Hindi';
        const targetLanguage = 'English';
        const contributeSource = 'contribute';
        const validateSource = 'validate';
        let progressResult = { total_contributions: 100, total_validations: 100, total_contribution_count: 100, total_validation_count: 100 };
        test('should call queries with type, language and category filters', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage}) and category=${contributeSource}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(textType, hindiLanguage, contributeSource);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with type, language and null category filters', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage})`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(textType, hindiLanguage, null);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with type, language and undefined category filters', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage})`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(textType, hindiLanguage);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with type, language and blank category filters', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage})`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(textType, hindiLanguage, '');

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with type, and null language filters', async () => {
            const filter = `1=1 and type=${textType}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(textType, null);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with type, and blank language filters', async () => {
            const filter = `1=1 and type=${textType}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(textType, '');

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with type, and undefined language filters', async () => {
            const filter = `1=1 and type=${textType}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(textType);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with null type filters', async () => {
            const filter = `1=1`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(null);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with blank type filters', async () => {
            const filter = `1=1`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress('');

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should call queries with undefined type filters', async () => {
            const filter = `1=1`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ goal: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress();

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(100);
        });
        test('should return 0 if no records from db', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage}) and category=${contributeSource}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue(null);
            const result = await dbOperations.getGoalForContributionProgress(textType, hindiLanguage, contributeSource);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(0);
        });
        test('should return 0 if no records from db 2', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage}) and category=${contributeSource}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([]);
            const result = await dbOperations.getGoalForContributionProgress(textType, hindiLanguage, contributeSource);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(0);
        });
        test('should return 0 if column is removed from db', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage}) and category=${contributeSource}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(languageGoalQuery, filter).mockReturnValue([{ somethingElse: 100 }]);
            const result = await dbOperations.getGoalForContributionProgress(textType, hindiLanguage, contributeSource);

            expect(spyDBany).toBeCalledWith(languageGoalQuery, filter);
            expect(result).toBe(0);
        });

        test('getProgressForContributionProgress should call queries with type, language filters', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage})`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue([progressResult]);
            const result = await dbOperations.getProgressForContributionProgress(textType, hindiLanguage);

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toBe(progressResult);
        });
        test('getProgressForContributionProgress should call queries with type, and null language filters', async () => {
            const filter = `1=1 and type=${textType}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue([progressResult]);
            const result = await dbOperations.getProgressForContributionProgress(textType, null);

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toBe(progressResult);
        });
        test('getProgressForContributionProgress should call queries with type, and blank language filters', async () => {
            const filter = `1=1 and type=${textType}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue([progressResult]);
            const result = await dbOperations.getProgressForContributionProgress(textType, '');

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toBe(progressResult);
        });
        test('getProgressForContributionProgress should call queries with type, and undefined language filters', async () => {
            const filter = `1=1 and type=${textType}`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue([progressResult]);
            const result = await dbOperations.getProgressForContributionProgress(textType);

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toBe(progressResult);
        });
        test('getProgressForContributionProgress should call queries with null type filters', async () => {
            const filter = `1=1`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue([progressResult]);
            const result = await dbOperations.getProgressForContributionProgress(null);

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toBe(progressResult);
        });
        test('getProgressForContributionProgress should call queries with blank type filters', async () => {
            const filter = `1=1`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue([progressResult]);
            const result = await dbOperations.getProgressForContributionProgress('');

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toBe(progressResult);
        });
        test('getProgressForContributionProgress should call queries with undefined type filters', async () => {
            const filter = `1=1`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue([progressResult]);
            const result = await dbOperations.getProgressForContributionProgress();

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toBe(progressResult);
        });
        test('getProgressForContributionProgress should return 0 if no records from db', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage})`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue(null);
            const result = await dbOperations.getProgressForContributionProgress(textType, hindiLanguage);

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toStrictEqual({ total_contributions: 0, total_validations: 0, total_contribution_count: 0, total_validation_count: 0 });
        });
        test('getProgressForContributionProgress should return 0 if no records from db 2', async () => {
            const filter = `1=1 and type=${textType} and LOWER(language)=LOWER(${hindiLanguage})`;
            mockpgp.as.format = jest.fn().mockReturnValue(filter);
            when(spyDBany).calledWith(currentProgressQuery, filter).mockReturnValue([]);
            const result = await dbOperations.getProgressForContributionProgress(textType, hindiLanguage, contributeSource);

            expect(spyDBany).toBeCalledWith(currentProgressQuery, filter);
            expect(result).toStrictEqual({ total_contributions: 0, total_validations: 0, total_contribution_count: 0, total_validation_count: 0 });
        });
        test('getProgressResultBasedOnTypeAndSource should return 0 if null is passed', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(null, textType, contributeSource);
            expect(result).toStrictEqual("0.000");
        });
        test('getProgressResultBasedOnTypeAndSource should return 0 if undefined is passed', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(undefined, textType, contributeSource);
            expect(result).toStrictEqual("0.000");
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for text and contribute', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, textType, contributeSource);
            expect(result).toStrictEqual(progressResult.total_contributions.toFixed(3));
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for text and validate', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, textType, validateSource);
            expect(result).toStrictEqual(progressResult.total_validations.toFixed(3));
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for asr and contribute', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, asrType, contributeSource);
            expect(result).toStrictEqual(progressResult.total_contributions.toFixed(3));
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for asr and validate', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, asrType, validateSource);
            expect(result).toStrictEqual(progressResult.total_validations.toFixed(3));
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for ocr and contribute', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, ocrType, contributeSource);
            expect(result).toStrictEqual(progressResult.total_contribution_count);
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for ocr and validate', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, ocrType, validateSource);
            expect(result).toStrictEqual(progressResult.total_validation_count);
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for parallel and contribute', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, parallelType, contributeSource);
            expect(result).toStrictEqual(progressResult.total_contribution_count);
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for parallel and validate', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, parallelType, validateSource);
            expect(result).toStrictEqual(progressResult.total_validation_count);
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for text and no source', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, textType);
            expect(result).toStrictEqual((progressResult.total_validations + progressResult.total_contributions).toFixed(3));
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for asr and no source', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, asrType);
            expect(result).toStrictEqual((progressResult.total_validations + progressResult.total_contributions).toFixed(3));
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for ocr and no source', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, ocrType);
            expect(result).toStrictEqual((progressResult.total_validation_count + progressResult.total_contribution_count));
        });
        test('getProgressResultBasedOnTypeAndSource should return correct for parallel and no source', async () => {
            const result = await dbOperations.getProgressResultBasedOnTypeAndSource(progressResult, parallelType);
            expect(result).toStrictEqual((progressResult.total_validation_count + progressResult.total_contribution_count));
        });
        test('increaseGoalIfLessThanCurrentProgress should return same goal if progress is less', async () => {
            const result = await dbOperations.increaseGoalIfLessThanCurrentProgress(10, 100);
            expect(result).toBe(100);
        });
        test('increaseGoalIfLessThanCurrentProgress should return return twice goal if progress is nearby', async () => {
            const result = await dbOperations.increaseGoalIfLessThanCurrentProgress(96, 100);
            expect(result).toBe(200);
        });
        test('increaseGoalIfLessThanCurrentProgress should return return four time goal if progress is double of goal', async () => {
            const result = await dbOperations.increaseGoalIfLessThanCurrentProgress(200, 100);
            expect(result).toBe(400);
        });
        test('increaseGoalIfLessThanCurrentProgress should return return 0 goal if goal is 0', async () => {
            const result = await dbOperations.increaseGoalIfLessThanCurrentProgress(200, 0);
            expect(result).toBe(0);
        });
    });

    describe('Test get participation stats', () => {
        test('should call ParticipationStatsQuery', () => {
            when(spyDBmany).calledWith(participationStatsQuery).mockReturnValue();
            dbOperations.getParticipationStats()
            expect(spyDBmany).toBeCalledWith(participationStatsQuery)
        })
    })
});
