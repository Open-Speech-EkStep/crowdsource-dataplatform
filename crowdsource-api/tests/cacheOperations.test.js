import { when } from 'jest-when'
const cacheOperations = require('../src/cache/cacheOperations');
const { getContributionDataForCaching, getParallelContributionDataForCaching, getValidationDataForCaching, getParallelValidationDataForCaching } = require('../src/cache/cacheDbQueries');

const mockDB = {
    any: jest.fn(() => Promise.resolve()),
}

jest.mock('../src/cache/cache', () => ({
    getAsync: jest.fn(() => Promise.resolve()),
    setAsync: jest.fn(() => Promise.resolve()),
    setWithLock: jest.fn(() => Promise.resolve())
}));
jest.mock('config', () => ({
    "caching": "enabled",
    "validation_count": 3,
    "cache_timeout": 600,
    "cache_batch_size": 1000
}));

const mockCache = require('../src/cache/cache')

describe("Running tests for cacheOperations", () => {
    // const spyDBany = jest.spyOn(mockDB, 'any');

    const language = "Hindi", toLanguage = "Tamil", limit = 1000;

    afterEach(() => {
        jest.clearAllMocks();
    })

    // test("setContributionDataForCaching should return expected result", async () => {
    //     const type = 'asr'
    //     const mockResult = [
    //         { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: null },
    //         { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: null },
    //         { dataset_row_id: 3, media_data: "some text 3", source_info: null, skipped_by: null },
    //     ];

    //     when(spyDBany).calledWith(getContributionDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

    //     await cacheOperations.setContributionDataForCaching(mockDB, type, language, toLanguage);

    //     expect(mockCache.setAsync).toBeCalledWith(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(mockResult), 600);
    // });
    test("setContributionDataForCaching should return expected result", async () => {
        const type = 'asr'
        
        await cacheOperations.setContributionDataForCaching(mockDB, type, language, toLanguage);

        expect(mockCache.setWithLock).toBeCalledWith(`dataset_row_${type}_${language}_${toLanguage}`, mockDB, getContributionDataForCaching, [type, language, toLanguage, limit]);
    });

    test("getDataForContribution should return expected result", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: null },
        ];

        
        when(mockCache.getAsync).calledWith(`dataset_row_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        const result = await cacheOperations.getDataForContribution(type, language, toLanguage, userId, userName);
        
        const resultObj = mockResult.slice()
        resultObj.forEach(d => delete d.skipped_by)

        expect(result).toEqual(resultObj);
    });

    test("getDataForContribution should return expected result remove the skipped one", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: `${userId}-${userName}` },
            { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: null }
        ];

        
        when(mockCache.getAsync).calledWith(`dataset_row_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        const result = await cacheOperations.getDataForContribution(type, language, toLanguage, userId, userName);
        
        const resultObj = mockResult.slice()
        resultObj.forEach(d => delete d.skipped_by)

        expect(result).toEqual([resultObj[1]]);
    });
    test("removeItemFromCache should return expected result remove the skipped one", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: `${userId}-${userName}` },
            { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: null }
        ];

        
        when(mockCache.getAsync).calledWith(`dataset_row_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        await cacheOperations.removeItemFromCache(1, type, language, toLanguage);

        const resultObj = mockResult.filter(d => d.dataset_row_id != 1);
        
        expect(mockCache.setAsync).toBeCalledWith(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(resultObj), 600);
    });
    test("markContributionSkippedInCache should return expected result should add details to skipped_by", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: null },
            { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: `someUserId-someUserName` }
        ];

        
        when(mockCache.getAsync).calledWith(`dataset_row_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        await cacheOperations.markContributionSkippedInCache(type, language, toLanguage, 1, userId, userName);

        mockResult[0].skipped_by = `${userId}-${userName}`;
        
        expect(mockCache.setAsync).toBeCalledWith(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(mockResult), 600);
    });

    test("markContributionSkippedInCache should return expected result should append details to skipped_by", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: `someUserId-someUserName` },
            { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: null }
        ];

        
        when(mockCache.getAsync).calledWith(`dataset_row_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        await cacheOperations.markContributionSkippedInCache(type, language, toLanguage, 1, userId, userName);

        mockResult[0].skipped_by = `someUserId-someUserName, ${userId}-${userName}`;
        
        expect(mockCache.setAsync).toBeCalledWith(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(mockResult), 600);
    });

    // test("setContributionDataForCaching should return expected result for parallel", async () => {
    //     const type = 'parallel'
    //     const mockResult = [
    //         { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: null },
    //         { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: null },
    //         { dataset_row_id: 3, media_data: "some text 3", source_info: null, skipped_by: null },
    //     ];

    //     when(spyDBany).calledWith(getParallelContributionDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

    //     await cacheOperations.setContributionDataForCaching(mockDB, type, language, toLanguage);

    //     expect(mockCache.setAsync).toBeCalledWith(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(mockResult), 600);
    // });

    test("setContributionDataForCaching should return expected result for parallel", async () => {
        const type = 'parallel'
        // const mockResult = [
        //     { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: null },
        //     { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: null },
        //     { dataset_row_id: 3, media_data: "some text 3", source_info: null, skipped_by: null },
        // ];

        // when(spyDBany).calledWith(getParallelContributionDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

        await cacheOperations.setContributionDataForCaching(mockDB, type, language, toLanguage);

        expect(mockCache.setWithLock).toBeCalledWith(`dataset_row_${type}_${language}_${toLanguage}`, mockDB, getParallelContributionDataForCaching, [type, language, toLanguage, limit]);
    });

    // test("setValidationDataForCaching should return expected result validation", async () => {
    //     const type = 'asr'
    //     const mockResult = [
    //         { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
    //         { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
    //         { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
    //     ];

    //     when(spyDBany).calledWith(getValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

    //     await cacheOperations.setValidationDataForCaching(mockDB, type, language, toLanguage);

    //     expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(mockResult), 600);
    // });
    test("setValidationDataForCaching should return expected result validation", async () => {
        const type = 'asr'

        await cacheOperations.setValidationDataForCaching(mockDB, type, language, toLanguage);

        expect(mockCache.setWithLock).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, mockDB, getValidationDataForCaching, [type, language, toLanguage, limit], expect.any(Function));
    });

    // test("setValidationDataForCaching should return expected result validation remove validation_count", async () => {
    //     const type = 'asr'
    //     const mockResult = [
    //         { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
    //         { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
    //         { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
    //         { dataset_row_id: 4, sentence: "some text 4", contribution: "some contribution 4", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 3 }
    //     ];

    //     const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);

    //     when(spyDBany).calledWith(getValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

    //     await cacheOperations.setValidationDataForCaching(mockDB, type, language, toLanguage);

    //     expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(lesserThanValidationCount), 600);
    // });
    // test("setValidationDataForCaching should return expected result validation sort by validation_count", async () => {
    //     const type = 'asr'
    //     const mockResult = [
    //         { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
    //         { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
    //         { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
    //         { dataset_row_id: 4, sentence: "some text 4", contribution: "some contribution 4", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 3 }
    //     ];

    //     const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
    //     lesserThanValidationCount
	// 	.sort(function (a, b) {
	// 		return a.validation_count - b.validation_count;
	// 	})
	// 	.reverse();

    //     when(spyDBany).calledWith(getValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

    //     await cacheOperations.setValidationDataForCaching(mockDB, type, language, toLanguage);

    //     expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(lesserThanValidationCount), 600);
    // });
    // test("setValidationDataForCaching should return expected result for parallel validation", async () => {
    //     const type = 'parallel'
    //     const mockResult = [
    //         { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
    //         { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
    //         { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33, source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
    //     ];

    //     when(spyDBany).calledWith(getParallelValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

    //     await cacheOperations.setValidationDataForCaching(mockDB, type, language, toLanguage);

    //     expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(mockResult), 600);
    // });
    test("setValidationDataForCaching should return expected result for parallel validation", async () => {
        const type = 'parallel'
     
        await cacheOperations.setValidationDataForCaching(mockDB, type, language, toLanguage);

        expect(mockCache.setWithLock).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, mockDB, getParallelValidationDataForCaching, [type, language, toLanguage, limit], expect.any(Function));
    });
    // test("setValidationDataForCaching should return expected result for parallel validation remove validation count", async () => {
    //     const type = 'parallel'
    //     const mockResult = [
    //         { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
    //         { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
    //         { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33, source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
    //         { dataset_row_id: 4, sentence: "some text 4", contribution: "some contribution 4", contribution_id: 44, source_info: null, contributed_by: null, skipped_by: null, validation_count: 3 },
    //     ];
    //     const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);

    //     when(spyDBany).calledWith(getParallelValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

    //     await cacheOperations.setValidationDataForCaching(mockDB, type, language, toLanguage);

    //     expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(lesserThanValidationCount), 600);
    // });
    // test("setValidationDataForCaching should return expected result for parallel validation sort validation count", async () => {
    //     const type = 'parallel'
    //     const mockResult = [
    //         { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
    //         { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
    //         { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33, source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
    //         { dataset_row_id: 4, sentence: "some text 4", contribution: "some contribution 4", contribution_id: 44, source_info: null, contributed_by: null, skipped_by: null, validation_count: 3 },
    //     ];
    //     const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
    //     lesserThanValidationCount
	// 	.sort(function (a, b) {
	// 		return a.validation_count - b.validation_count;
	// 	})
	// 	.reverse();

    //     when(spyDBany).calledWith(getParallelValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));

    //     await cacheOperations.setValidationDataForCaching(mockDB, type, language, toLanguage);

    //     expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(lesserThanValidationCount), 600);
    // });
    test("updateCacheAfterValidation should return expected result should add details to skipped_by", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
        ];

        
        when(mockCache.getAsync).calledWith(`contributions_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        await cacheOperations.updateCacheAfterValidation(11, type, language, toLanguage, 'skip', userId, userName);

        mockResult[0].skipped_by = `${userId}-${userName}`;
        const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
        lesserThanValidationCount
		.sort(function (a, b) {
			return a.validation_count - b.validation_count;
		})
		.reverse();
        
        expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(lesserThanValidationCount), 600);
    });
    test("updateCacheAfterValidation should return expected result should append details to skipped_by", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: 'someUserId-someUserName', validation_count: 2 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
        ];

        
        when(mockCache.getAsync).calledWith(`contributions_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        await cacheOperations.updateCacheAfterValidation(11, type, language, toLanguage, 'skip', userId, userName);

        mockResult[0].skipped_by = `someUserId-someUserName, ${userId}-${userName}`;
        const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
        lesserThanValidationCount
		.sort(function (a, b) {
			return a.validation_count - b.validation_count;
		})
		.reverse();
        
        expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(lesserThanValidationCount), 600);
    });

    test("updateCacheAfterValidation should return expected result should not update validation_count when skiping", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
        ];

        
        when(mockCache.getAsync).calledWith(`contributions_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        await cacheOperations.updateCacheAfterValidation(11, type, language, toLanguage, 'skip', userId, userName);

        mockResult[0].skipped_by = `${userId}-${userName}`;
        const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
        lesserThanValidationCount
		.sort(function (a, b) {
			return a.validation_count - b.validation_count;
		})
		.reverse();
        
        expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(lesserThanValidationCount), 600);
    });

    test("updateCacheAfterValidation should return expected result should update validation_count when not skiping", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
        ];

        
        when(mockCache.getAsync).calledWith(`contributions_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        await cacheOperations.updateCacheAfterValidation(11, type, language, toLanguage, 'accept', userId, userName);

        mockResult[0].validation_count = 2;
        mockResult[0].skipped_by = `${userId}-${userName}`;
        const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
        lesserThanValidationCount
		.sort(function (a, b) {
			return a.validation_count - b.validation_count;
		})
		.reverse();
        
        expect(mockCache.setAsync).toBeCalledWith(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(lesserThanValidationCount), 600);
    });

    test("getDataForValidation should return expected result", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
        ];
        
        when(mockCache.getAsync).calledWith(`contributions_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        const result = await cacheOperations.getDataForValidation(type, language, toLanguage, userId, userName,mockDB);
        
        const resultObj = mockResult.slice()
        resultObj.forEach(d => {
            delete d.skipped_by;
			delete d.contributed_by;
			delete d.validation_count;
        })

        expect(result).toEqual(resultObj);
    });

    test("getDataForValidation should call set data when data is null", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = null;
        const mockResult1 = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 111, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 212,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
        ];
        
        when(mockCache.getAsync).calledWith(`contributions_${type}_${language}_${toLanguage}`).mockReturnValueOnce(Promise.resolve(mockResult)).mockReturnValueOnce(Promise.resolve(JSON.stringify(mockResult1)));

        
        const result = await cacheOperations.getDataForValidation(type, language, toLanguage, userId, userName,mockDB);
        
        const resultObj = mockResult1.slice()
        resultObj.forEach(d => {
            delete d.skipped_by;
			delete d.contributed_by;
			delete d.validation_count;
        })


        expect(result).toEqual(resultObj);
    });

    test("getDataForValidation should return expected result should remove the one which has contributed_by", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: `${userId}-${userName}`, skipped_by: null, validation_count: 0 },
        ];
        
        when(mockCache.getAsync).calledWith(`contributions_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        const result = await cacheOperations.getDataForValidation(type, language, toLanguage, userId, userName,mockDB);
        
        const resultObj = mockResult.slice();
        resultObj.pop();
        resultObj.forEach(d => {
            delete d.skipped_by;
			delete d.contributed_by;
			delete d.validation_count;
        })

        expect(result).toEqual(resultObj);
    });
    test("getDataForValidation should return expected result should remove the one which has skipped_by", async () => {
        const type = 'asr'
        const userId = 'userId';
        const userName = 'userName';
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: `${userId}-${userName}`, validation_count: 0 },
        ];
        
        when(mockCache.getAsync).calledWith(`contributions_${type}_${language}_${toLanguage}`).mockReturnValue(Promise.resolve(JSON.stringify(mockResult)));
        
        const result = await cacheOperations.getDataForValidation(type, language, toLanguage, userId, userName,mockDB);
        
        const resultObj = mockResult.slice();
        resultObj.pop();
        resultObj.forEach(d => {
            delete d.skipped_by;
			delete d.contributed_by;
			delete d.validation_count;
        })

        expect(result).toEqual(resultObj);
    });

});