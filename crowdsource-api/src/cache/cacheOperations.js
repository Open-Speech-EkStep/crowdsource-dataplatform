const {
	getContributionDataForCaching,
	getParallelContributionDataForCaching,
	getValidationDataForCaching,
	getParallelValidationDataForCaching
} = require('./cacheDbQueries');
const cache = require('./cache');
const config = require('config');

const cachingEnabled = config.caching ? config.caching == "enabled" : false;
const validation_count = config.validation_count ? Number(config.validation_count) : 5; 
const expiry = config.cache_timeout || Number(config.cache_timeout) || 1800;
const batchSize = config.cache_batch_size || 5000; 

const getRandom = (arr, n) => {
	var len = arr.length;
	if (n > len)
		n = len;
	var result = new Array(n),
		taken = new Array(len);
	while (n--) {
		var x = Math.floor(Math.random() * len);
		result[n] = arr[x in taken ? taken[x] : x];
		taken[x] = --len in taken ? taken[len] : len;
	}
	return result;
}

const generateResponse = (data, desiredCount, userId, userName) => {
	let response = [];
	let randomItems = getRandom(data, desiredCount);
	const randomItemsDataSetRowIds = randomItems.map(i => i.dataset_row_id);
	data = data.filter(d => !randomItemsDataSetRowIds.includes(d.dataset_row_id));
	const itemLength = randomItems.length;
	let i = 0;
	let skipCount = 0;
	let includedIds = [];
	while (response.length + skipCount < itemLength) {
		if (randomItems[i].skipped_by && randomItems[i].skipped_by.includes(`${userId}-${userName}`)) {
			skipCount++;
			let obj = getRandom(data, 1)[0];
			if (!obj || includedIds.includes(obj.dataset_row_id)) {
				randomItems.splice(i, 1);
			}
			else {
				randomItems[i] = obj;
			}
		}
		else {
			response.push(deleteProperties(randomItems[i], ["skipped_by"]));
			includedIds.push(randomItems[i].dataset_row_id)
			i++;
		}
	}
	return response;
}

const sortAndFilterValidationData = (data) => {
	data = data.filter(d => d.validation_count != undefined && d.validation_count < validation_count);
	data.sort(function (a, b) {
			return a.validation_count - b.validation_count;
		})
		.reverse();
	return data;
}

const userIncludedIn = (property, userInfo) => {
	return property && property.includes(`${userInfo}`);
}

const isRowSkippedByOrContributedByUser = (row, userId, userName) => {
	return userIncludedIn(row.skipped_by, `${userId}-${userName}`) || userIncludedIn(row.contributed_by, `${userId}-${userName}`)
}

const deleteProperties = (obj, properties) => {
	properties.forEach(property => {
		delete obj[property]
	});
	return obj;
}

const generateValidationResponse = (data, desiredCount, userId, userName) => {
	let response = [];
	let randomItems = data.slice(0, desiredCount);
	const itemLength = randomItems.length;
	let i = 0;
	let skipCount = 0;
	while (response.length < itemLength && skipCount < (data.length - response.length)) {
		if (isRowSkippedByOrContributedByUser(randomItems[i], userId, userName)) {
			if (itemLength + skipCount < data.length) {
				randomItems[i] = data[itemLength + skipCount]
			}
			else {
				randomItems.splice(i, 1);
			}
			skipCount++;
		}
		else {
			response.push(deleteProperties(randomItems[i], ["skipped_by", "contributed_by", "validation_count"]));
			i++;
		}
	}
	return response;
}

const setContributionDataForCaching = async (db, type, language, toLanguage) => {
	if (!cachingEnabled) {
		return;
	}
	try {
		const query = type == 'parallel' ? getParallelContributionDataForCaching : getContributionDataForCaching;
		await cache.setWithLock(
			`dataset_row_${type}_${language}_${toLanguage}`,
			db,
			query,
			[type, language, toLanguage, batchSize]);

	} catch (err) {
		console.log("CACHING ERROR: " + err)
	}
}

const getDataForContribution = async (type, language, toLanguage, userId, userName) => {
	if (!cachingEnabled) {
		return null;
	}
	try {
		const cacheResponse = await cache.getAsync(`dataset_row_${type}_${language}_${toLanguage}`);
		if (cacheResponse == null)
			return null;

		const cacheData = JSON.parse(cacheResponse);
		
		return generateResponse(cacheData, 5, userId, userName);
	} catch (err) {
		console.log("CACHING ERROR: " + err)
	}
}

const removeItemFromCache = async (dataset_row_id, type, language, toLanguage) => {
	if (!cachingEnabled) {
		return;
	}
	try {
		const cacheResponse = await cache.getAsync(`dataset_row_${type}_${language}_${toLanguage}`);
		
		const cacheData = JSON.parse(cacheResponse);
		
		let data = cacheData.filter(dataset => dataset.dataset_row_id != dataset_row_id);
		
		await cache.setAsync(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(data), expiry);
	} catch (err) {
		console.log("CACHING ERROR: " + err)
	}
}

const updateSkippedByForItem = (cacheData, dataset_row_id, userId, userName) => {
	const index = cacheData.findIndex(o => o.dataset_row_id == dataset_row_id);
	if (index != -1) {
		let objAtIndex = cacheData[index];
		if (objAtIndex.skipped_by) {
			objAtIndex.skipped_by += `, ${userId}-${userName}`;
		}
		else {
			objAtIndex.skipped_by = `${userId}-${userName}`;
		}
	}
	return cacheData;
}

const markContributionSkippedInCache = async (type, fromLanguage, toLanguage, dataset_row_id, userId, userName) => {
	if (!cachingEnabled) {
		return;
	}
	try {
		const cacheResponse = await cache.getAsync(`dataset_row_${type}_${fromLanguage}_${toLanguage}`);
		if (cacheResponse) {
			let cacheData = JSON.parse(cacheResponse);
			cacheData = updateSkippedByForItem(cacheData, dataset_row_id, userId, userName);
			await cache.setAsync(`dataset_row_${type}_${fromLanguage}_${toLanguage}`, JSON.stringify(cacheData), expiry);
		}
	} catch (err) {
		console.log("CACHING ERROR: " + err)
	}
}

const setValidationDataForCaching = async (db, type, language, toLanguage) => {
	if (!cachingEnabled) {
		return;
	}
	try {
		const query = type == 'parallel' ? getParallelValidationDataForCaching : getValidationDataForCaching
		await cache.setWithLock(
			`contributions_${type}_${language}_${toLanguage}`,
			db,
			query,
			[type, language, toLanguage, batchSize],
			(data) => {
				sortAndFilterValidationData(data)
			});

	} catch (err) {
		console.log("CACHING ERROR: " + err)
	}
}

const getDataForValidation = async (type, language, toLanguage, userId, userName) => {
	if (!cachingEnabled) {
		return null;
	}
	try {
		const cacheResponse = await cache.getAsync(`contributions_${type}_${language}_${toLanguage}`);
		if (cacheResponse == null)
			return null;

		const cacheData = JSON.parse(cacheResponse);
		
		return generateValidationResponse(cacheData, 5, userId, userName);
	} catch (err) {
		console.log("CACHING ERROR: " + err)
	}
}

const updateValidationCountForItem = (cacheData, contribution_id, userId, userName, action) => {
	const index = cacheData.findIndex(o => o.contribution_id == contribution_id);
	if (index != -1) {
		let objAtIndex = cacheData[index];
		if (objAtIndex.skipped_by) {
			objAtIndex.skipped_by += `, ${userId}-${userName}`;
		}
		else {
			objAtIndex.skipped_by = `${userId}-${userName}`;
		}
		if (action != 'skip') {
			objAtIndex.validation_count = Number(objAtIndex.validation_count) + 1;
		}
	}
	return cacheData;
}

const updateCacheAfterValidation = async (contribution_id, type, fromLanguage, toLanguage, action, userId, userName) => {
	if (!cachingEnabled) {
		return;
	}
	try {
		const cacheResponse = await cache.getAsync(`contributions_${type}_${fromLanguage}_${toLanguage}`);
		if (cacheResponse) {
			let cacheData = JSON.parse(cacheResponse);
			cacheData = updateValidationCountForItem(cacheData, contribution_id, userId, userName, action);
			cacheData = sortAndFilterValidationData(cacheData);
			await cache.setAsync(`contributions_${type}_${fromLanguage}_${toLanguage}`, JSON.stringify(cacheData), expiry);
		}
	} catch (err) {
		console.log("CACHING ERROR: " + err)
	}
}

module.exports = {
	setContributionDataForCaching,
	getDataForContribution,
	removeItemFromCache,
	markContributionSkippedInCache,
	setValidationDataForCaching,
	getDataForValidation,
	updateCacheAfterValidation,
	sortAndFilterValidationData
}