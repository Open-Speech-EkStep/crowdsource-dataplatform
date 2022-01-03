import { when } from 'jest-when'
const cacheOperations = require('../src/cache/cacheOperations');
const cache = require('../src/cache/cache');
const { getContributionDataForCaching, getParallelContributionDataForCaching, getValidationDataForCaching, getParallelValidationDataForCaching } = require('../src/cache/cacheDbQueries');

const mockDB = {
    any: jest.fn(() => Promise.resolve()),
}

jest.mock('redlock');
jest.mock('ioredis');

jest.mock('config', () => ({
    "caching": "enabled",
    "validation_count": 3,
    "cache_timeout": 600,
    "cache_batch_size": 1000,
    "envName": "ut"
}));

const mockIoRedis = require('ioredis');
const mockRedlock = require('redlock');

describe("Running tests for cache", () => {
    const lockObj = {
        unlock: jest.fn(() => Promise.resolve())
    };
    const lockTimeOut = Math.floor(Number.MAX_SAFE_INTEGER / 10);
    const spyDBany = jest.spyOn(mockDB, 'any');

    const language = "Hindi", toLanguage = "Tamil", limit = 1000;

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("setContributionDataForCaching should return expected result", async () => {
        const type = 'asr'
        const mockResult = [
            { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: null },
            { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: null },
            { dataset_row_id: 3, media_data: "some text 3", source_info: null, skipped_by: null },
        ];
        const key = `dataset_row_${type}_${language}_${toLanguage}`;
        when(spyDBany).calledWith(getContributionDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));
        when(mockIoRedis.Cluster.prototype.get).calledWith(`${key}_status`).mockReturnValue(Promise.resolve(null));
        when(mockRedlock.prototype.acquire).calledWith(`lock:${key}`, lockTimeOut).mockReturnValue(Promise.resolve(lockObj));

        await cache.setWithLock(key, mockDB, getContributionDataForCaching, [type, language, toLanguage, limit]);


        expect(mockRedlock.prototype.acquire).toBeCalledWith(`lock:${key}`, lockTimeOut);
        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(1, "ut" + "_" + key + "_status", 'in progress', 'EX', 600);
        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(2, "ut" + "_" + key, JSON.stringify(mockResult), 'EX', 600);
        expect(lockObj.unlock).toHaveBeenCalled();
    });
    test("setContributionDataForCaching should return expected result for parallel", async () => {
        const type = 'parallel'
        const mockResult = [
            { dataset_row_id: 1, media_data: "some text", source_info: null, skipped_by: null },
            { dataset_row_id: 2, media_data: "some text 2", source_info: null, skipped_by: null },
            { dataset_row_id: 3, media_data: "some text 3", source_info: null, skipped_by: null },
        ];
        const key = `dataset_row_${type}_${language}_${toLanguage}`;
        when(spyDBany).calledWith(getParallelContributionDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));
        when(mockRedlock.prototype.acquire).calledWith(`lock:${key}`, lockTimeOut).mockReturnValue(Promise.resolve(lockObj));

        await cache.setWithLock(key, mockDB, getParallelContributionDataForCaching, [type, language, toLanguage, limit]);

        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(2, "ut" + "_" + key, JSON.stringify(mockResult), 'EX', 600);
        expect(lockObj.unlock).toHaveBeenCalled();
    });

    test("setValidationDataForCaching should return expected result validation", async () => {
        const type = 'asr'
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
        ];
        const key = `contributions_${type}_${language}_${toLanguage}`;
        when(spyDBany).calledWith(getValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));
        when(mockRedlock.prototype.acquire).calledWith(`lock:${key}`, lockTimeOut).mockReturnValue(Promise.resolve(lockObj));

        await cache.setWithLock(key, mockDB, getValidationDataForCaching, [type, language, toLanguage, limit]);

        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(2, "ut" + "_" + key, JSON.stringify(mockResult), 'EX', 600);
        expect(lockObj.unlock).toHaveBeenCalled();
    });
    test("setValidationDataForCaching should return expected result validation remove validation_count", async () => {
        const type = 'asr'
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
            { dataset_row_id: 4, sentence: "some text 4", contribution: "some contribution 4", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 3 }
        ];
        const key = `contributions_${type}_${language}_${toLanguage}`;
        const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);

        when(spyDBany).calledWith(getValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));
        when(mockRedlock.prototype.acquire).calledWith(`lock:${key}`, lockTimeOut).mockReturnValue(Promise.resolve(lockObj));

        await cache.setWithLock(key, mockDB, getValidationDataForCaching, [type, language, toLanguage, limit], cacheOperations.sortAndFilterValidationData);

        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(2, "ut" + "_" + key, JSON.stringify(lesserThanValidationCount), 'EX', 600);
        expect(lockObj.unlock).toHaveBeenCalled();
    });
    test("setValidationDataForCaching should return expected result validation sort by validation_count", async () => {
        const type = 'asr'
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22,source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
            { dataset_row_id: 4, sentence: "some text 4", contribution: "some contribution 4", contribution_id: 33,source_info: null, contributed_by: null, skipped_by: null, validation_count: 3 }
        ];
        const key = `contributions_${type}_${language}_${toLanguage}`;
        const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
        lesserThanValidationCount
		.sort(function (a, b) {
			return a.validation_count - b.validation_count;
		})
		.reverse();

        when(spyDBany).calledWith(getValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));
        when(mockRedlock.prototype.acquire).calledWith(`lock:${key}`, lockTimeOut).mockReturnValue(Promise.resolve(lockObj));

        await cache.setWithLock(key, mockDB, getValidationDataForCaching, [type, language, toLanguage, limit], cacheOperations.sortAndFilterValidationData);

        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(2, "ut" + "_" + key, JSON.stringify(lesserThanValidationCount), 'EX', 600);
        expect(lockObj.unlock).toHaveBeenCalled();
    });
    test("setValidationDataForCaching should return expected result for parallel validation", async () => {
        const type = 'parallel'
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33, source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
        ];
        const key = `contributions_${type}_${language}_${toLanguage}`;
        when(spyDBany).calledWith(getParallelValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));
        when(mockRedlock.prototype.acquire).calledWith(`lock:${key}`, lockTimeOut).mockReturnValue(Promise.resolve(lockObj));

        await cache.setWithLock(key, mockDB, getParallelValidationDataForCaching, [type, language, toLanguage, limit]);

        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(2, "ut" + "_" + key, JSON.stringify(mockResult), 'EX', 600);
        expect(lockObj.unlock).toHaveBeenCalled();
    });
    test("setValidationDataForCaching should return expected result for parallel validation remove validation count", async () => {
        const type = 'parallel'
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33, source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
            { dataset_row_id: 4, sentence: "some text 4", contribution: "some contribution 4", contribution_id: 44, source_info: null, contributed_by: null, skipped_by: null, validation_count: 3 },
        ];
        const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
        const key = `contributions_${type}_${language}_${toLanguage}`;

        when(spyDBany).calledWith(getParallelValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));
        when(mockRedlock.prototype.acquire).calledWith(`lock:${key}`, lockTimeOut).mockReturnValue(Promise.resolve(lockObj));

        await cache.setWithLock(key, mockDB, getParallelValidationDataForCaching, [type, language, toLanguage, limit], cacheOperations.sortAndFilterValidationData);

        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(2, "ut" + "_" + key, JSON.stringify(lesserThanValidationCount), 'EX', 600);
        expect(lockObj.unlock).toHaveBeenCalled();
    });
    test("setValidationDataForCaching should return expected result for parallel validation sort validation count", async () => {
        const type = 'parallel'
        const mockResult = [
            { dataset_row_id: 1, sentence: "some text 1", contribution: "some contribution 1", contribution_id: 11, source_info: null, contributed_by: null, skipped_by: null, validation_count: 2 },
            { dataset_row_id: 2, sentence: "some text 2", contribution: "some contribution 2", contribution_id: 22, source_info: null, contributed_by: null, skipped_by: null, validation_count: 1 },
            { dataset_row_id: 3, sentence: "some text 3", contribution: "some contribution 3", contribution_id: 33, source_info: null, contributed_by: null, skipped_by: null, validation_count: 0 },
            { dataset_row_id: 4, sentence: "some text 4", contribution: "some contribution 4", contribution_id: 44, source_info: null, contributed_by: null, skipped_by: null, validation_count: 3 },
        ];
        const lesserThanValidationCount = mockResult.filter(d => d.validation_count < 3);
        lesserThanValidationCount
		.sort(function (a, b) {
			return a.validation_count - b.validation_count;
		})
		.reverse();
        const key = `contributions_${type}_${language}_${toLanguage}`;

        when(spyDBany).calledWith(getParallelValidationDataForCaching, [type, language, toLanguage, limit]).mockReturnValue(Promise.resolve(mockResult));
        when(mockRedlock.prototype.acquire).calledWith(`lock:${key}`, lockTimeOut).mockReturnValue(Promise.resolve(lockObj));

        await cache.setWithLock(key, mockDB, getParallelValidationDataForCaching, [type, language, toLanguage, limit], cacheOperations.sortAndFilterValidationData);

        expect(mockIoRedis.Cluster.prototype.set).toHaveBeenNthCalledWith(2, "ut" + "_" + key, JSON.stringify(lesserThanValidationCount), 'EX', 600);
        expect(lockObj.unlock).toHaveBeenCalled();
    });
});