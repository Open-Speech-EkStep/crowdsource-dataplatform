import { when } from 'jest-when'

const {
    updateContributionDetails,
    updateContributionDetailsWithUserInput,
    updateMediaWithContributedState,
    feedbackInsertion,
    saveReportQuery,
    markContributionSkippedQuery,
    rewardsInfoQuery,
    getTotalUserContribution,
    checkCurrentMilestoneQuery,
    checkNextMilestoneQuery,
    findRewardInfo,
    insertRewardQuery,
    getTotalUserValidation,
    addContributorIfNotExistQuery,
    getBadges,
    addValidationQuery,
    updateMediaWithValidatedState,
    getContributionHoursForLanguage,
    getDataRowInfo,
    getOrderedUniqueMediaQuery,
    getUserRewardsQuery
} = require('./../src/dbQuery');

const mockDB = {
    many: jest.fn(() => Promise.resolve()),
    one: jest.fn(() => Promise.resolve()),
    none: jest.fn(() => Promise.resolve()),
    any: jest.fn(() => Promise.resolve()),
    oneOrNone: jest.fn(() => Promise.resolve()),
    result: jest.fn(() => Promise.resolve()),
}
jest.mock('config', () => ({
    "autoValidation": "disabled",
}));

const mockpgPromise = jest.fn(() => mockpgp)

const mockpgp = jest.fn(() => mockDB)

jest.mock('pg-promise', () => mockpgPromise);

process.env.LAUNCH_IDS = '1,2';
const dbOperations = require('../src/dbOperations');
const res = { status: () => { return { send: () => { } }; }, sendStatus: () => { } };
delete process.env.LAUNCH_IDS;

describe("Running tests for dbOperations", () => {
    const mockpgp = require('pg-promise')()
    const type = 'text';
    const spyDBany = jest.spyOn(mockDB, 'any');
    const spyDBnone = jest.spyOn(mockDB, 'none');
    const spyDBoneOrNone = jest.spyOn(mockDB, 'oneOrNone');
    const spyDBone = jest.spyOn(mockDB, 'one');
    const spyDBresult = jest.spyOn(mockDB, 'result');
    const age = '', gender = '', motherTongue = '';

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

            expect(spyDBany).toHaveBeenCalledWith(getOrderedUniqueMediaQuery, [testUserId, testUsername, mediumLabel, language, type]);
        });

        test('should call query with label medium for adults', () => {
            dbOperations.getMediaBasedOnAge(ageGroup, testUserId, testUsername, language, type, toLanguage)

            expect(spyDBany).toHaveBeenCalledWith(getOrderedUniqueMediaQuery, [testUserId, testUsername, mediumLabel, language, type]);
        })
    });

    describe('Update DB methods', () => {
        const testDatasetId = 1, testUserId = 123, contributor_id = 27;
        const testUserName = 'testName', testState = 'testState', testCountry = 'testCountry';
        const age = '', gender = '', motherTongue = '', device = '', browser = '', type = 'asr', allowValidation = true;
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
                when(spyDBone).calledWith(addContributorIfNotExistQuery, [testUserId, testUserName, age, gender, motherTongue]).mockReturnValue({ 'contributor_id': contributor_id });
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
                when(spyDBresult).calledWith(updateMediaWithContributedState, [testDatasetId]).mockReturnValue(Promise.resolve({}));
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
                when(spyDBone).calledWith(addContributorIfNotExistQuery, [testUserId, testUserName, age, gender, motherTongue]).mockReturnValue({ 'contributor_id': contributor_id });
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
                        browser,
                        allowValidation
                    ]).mockReturnValue(Promise.resolve([{ 'contribution_id': 97531 }]));
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
                        browser,
                        allowValidation
                    ]
                );

                expect(spyDBresult).toHaveBeenCalledWith(
                    updateMediaWithContributedState,
                    [testDatasetId]
                )
            });
        })
    });

    test('Insert Feedback', () => {
        const spyDBany = jest.spyOn(mockDB, 'any');
        const category = '';
        const feedback = '';
        const email = 'example@gmail.com';
        const language = 'testLanguage';
        const module = 'asr';
        const target_page = 'Landing Page';
        const opinion_rating = 3;
        const recommended = 'yes';
        const revisit = 'no'

        dbOperations.insertFeedback(email, feedback, category, language, module, target_page, opinion_rating, recommended, revisit);

        expect(spyDBany).toHaveBeenCalledWith(feedbackInsertion, [email, feedback, category, language, module, target_page, opinion_rating, recommended, revisit]);
    });

    test('Save Report', async () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const spyDBone = jest.spyOn(mockDB, 'one')
        const userId = '123'
        const datasetId = '456'
        const language = 'testLanguage'
        const reportText = 'report text'
        const userName = 'test user'
        const source = 'contribution'
        const contributor_id = 10
        when(spyDBone).calledWith(addContributorIfNotExistQuery, [userId, userName, age, gender, motherTongue]).mockReturnValue({ 'contributor_id': contributor_id });

        await dbOperations.saveReport(userId, datasetId, reportText, language, userName, source);

        expect(spyDBany).toHaveBeenCalledWith(saveReportQuery, [contributor_id, datasetId, reportText, language, source])
    });

    test('Mark Skipped Contribution', async () => {
        const spyDBany = jest.spyOn(mockDB, 'any')
        const spyDBone = jest.spyOn(mockDB, 'one')
        const userId = '123'
        const datasetId = '456'
        const userName = 'test user'
        const contributor_id = 10
        const language = 'Hindi';
        const country = "india";
        const state_region = "state";
        const device = "OSX";
        const browser = "CHROME";
        when(spyDBone).calledWith(addContributorIfNotExistQuery, [userId, userName, age, gender, motherTongue]).mockReturnValue({ 'contributor_id': contributor_id });

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

        beforeEach(() => {
            when(spyDBone).calledWith(addContributorIfNotExistQuery, [userId, userName, age, gender, motherTongue]).mockReturnValue({ 'contributor_id': contributor_id });
            when(spyDBone).calledWith(getTotalUserContribution, [contributor_id, language, textType]).mockReturnValue({ 'count': 1 });
            when(spyDBone).calledWith(getTotalUserValidation, [contributor_id, language, textType]).mockReturnValue({ 'count': 1 });
            when(spyDBone).calledWith(getContributionHoursForLanguage, [language]).mockReturnValue(10);
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

            expect(spyDBone).toHaveBeenNthCalledWith(1, addContributorIfNotExistQuery, [userId, userName, age, gender, motherTongue])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(1, checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryContribute])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(2, checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType])
            expect(spyDBone).toHaveBeenCalledWith(getTotalUserContribution, [contributor_id, language, textType])
        });

        test('should call queries for rewards data if user found for validate', async () => {
            await dbOperations.getRewards(userId, userName, language, categoryValidate, textType);

            expect(spyDBone).toHaveBeenNthCalledWith(1, addContributorIfNotExistQuery, [userId, userName, age, gender, motherTongue])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(1, checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryValidate])
            expect(spyDBoneOrNone).toHaveBeenNthCalledWith(2, checkNextMilestoneQuery, [contribution_count, language, categoryValidate, textType])
            expect(spyDBone).toHaveBeenCalledWith(getTotalUserValidation, [contributor_id, language, textType])
        });

        describe('Test get contributor id', () => {

            test('should call addContributorIfNotExistQuery', async () => {
                when(spyDBone).calledWith(addContributorIfNotExistQuery, [userId, userName, '', '', '']).mockReturnValue({ 'contributor_id': contributor_id });

                await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBone).toBeCalledWith(addContributorIfNotExistQuery, [userId, userName, '', '', '']);
                jest.clearAllMocks();
            });
        })

        describe('Test create badge', () => {

            test('should call insertRewardQuery if rewardsList is empty', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([]);

                await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBany).toHaveBeenCalledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType])
                expect(spyDBany).toHaveBeenCalledWith(insertRewardQuery, [contributor_id, expect.anything()])
                jest.clearAllMocks()
            });

            test('should not call insertRewardQuery if badge already present', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([{ "milestone_id": milestoneId }]);

                await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBany).toHaveBeenCalledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType])
                expect(spyDBany).not.toHaveBeenCalledWith(insertRewardQuery, [contributor_id, expect.anything()]);
                jest.clearAllMocks();
            });
        });

        describe('Test get latest badge data', () => {

            test('get latest badge data if exists', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([]);
                when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryContribute]).mockReturnValue({ 'milestone_id': 1, 'grade': 'copper', 'milestone': 100 });

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(result.currentBadgeType).toBe('copper')
                jest.clearAllMocks();
            });

            test('get latest badge data as 0 if data not exists', async () => {
                when(spyDBany).calledWith(getBadges, [expect.anything(), language]).mockReturnValue([]);
                when(spyDBany).calledWith(findRewardInfo, [contributor_id, language, categoryContribute, textType]).mockReturnValue([]);
                when(spyDBoneOrNone).calledWith(checkCurrentMilestoneQuery, [contribution_count, language, textType, categoryContribute]).mockReturnValue(null);

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(result.currentBadgeType).toBe('')
                jest.clearAllMocks();
            });
        });

        describe('Test get next badge data', () => {

            test('get next badge data if exists', async () => {
                when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType]).mockReturnValue({ 'milestone_id': 2, 'grade': 'silver', 'milestone': 200 });

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType])
                expect(result.nextMilestone).toBe(200)
                expect(result.nextBadgeType).toBe('silver')
                jest.clearAllMocks();
            });

            test('get next badge as 0 if data not exists', async () => {
                when(spyDBoneOrNone).calledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType]).mockReturnValue({});

                const result = await dbOperations.getRewards(userId, userName, language, categoryContribute, textType);

                expect(spyDBoneOrNone).toHaveBeenCalledWith(checkNextMilestoneQuery, [contribution_count, language, categoryContribute, textType])
                expect(result.nextMilestone).toBe(0)
                expect(result.nextBadgeType).toBe('')
                jest.clearAllMocks();
            });
        });

    });

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

        beforeEach(() => {
            when(spyDBone).calledWith(addContributorIfNotExistQuery, [userId, userName, age, gender, motherTongue]).mockReturnValue({ contributor_id: contributorId })
            when(spyDBresult).calledWith(addValidationQuery, expect.anything()).mockReturnValue(Promise.resolve({}))
            when(spyDBresult).calledWith(updateMediaWithValidatedState, expect.anything()).mockReturnValue(Promise.resolve({}))
        })

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call addValidationQuery and updateMediaWithValidatedState if action is accept/reject', async () => {
            const action = 'accept';

            const req = { 'body': { sentenceId: datasetId, state, country, userName, device, browser }, 'cookies': { userId }, params: { action, contributionId } }

            await dbOperations.updateTablesAfterValidation(req, res);

            expect(spyDBresult).toHaveBeenNthCalledWith(1, addValidationQuery, [contributorId, datasetId, action, contributionId, state, country, device, browser]);
            expect(spyDBresult).toHaveBeenNthCalledWith(2, updateMediaWithValidatedState, [datasetId, contributionId])
        });

        test('should only call addValidationQuery if action is skip', async () => {
            const action = 'skip';

            const req = { 'body': { sentenceId: datasetId, state, country, userName, device, browser }, 'cookies': { userId }, params: { action, contributionId } }

            await dbOperations.updateTablesAfterValidation(req, res);

            expect(spyDBresult).toBeCalledWith(addValidationQuery, [contributorId, datasetId, action, contributionId, state, country, device, browser]);
            expect(spyDBresult).toBeCalledTimes(1);
        })
    })

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

    test('Test getUserRewards', async () => {
        const userId = 123;
        const userName = 'name';
        when(spyDBone).calledWith(addContributorIfNotExistQuery, [userId, userName, age, gender, motherTongue]).mockReturnValue({ contributor_id: 1 })
        await dbOperations.getUserRewards(userId, userName);
        expect(spyDBany).toBeCalledWith(getUserRewardsQuery, [1])
    })
});
