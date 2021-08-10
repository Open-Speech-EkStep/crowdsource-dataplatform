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
	const itemLength = randomItems.length;
	let i = 0;
	let skipCount = 0;
	let includedIds = [];
	while (response.length < itemLength && skipCount < (data.length - response.length)) {
		if (randomItems[i].skipped_by && randomItems[i].skipped_by.includes(`${userId}-${userName}`)) {
			skipCount++;
			 let obj = getRandom(data, 1)[0];
			 if (includedIds.includes(obj.dataset_row_id)) {
				randomItems.splice(i, 1);
			 }
			 else {
				randomItems[i] = obj;
			 }
		}
		else {
			delete randomItems[i]["skipped_by"];
			response.push(randomItems[i]);
			includedIds.push(randomItems[i].dataset_row_id)
			i++;
		}
	}
	return response;
}

const sortAndFilterValidationData = (data) => {
	data = data.filter(d => d.validation_count && d.validation_count < validation_count);
	data
		.sort(function (a, b) {
			return a.validation_count - b.validation_count;
		})
		.reverse();
	return data;
}
const generateValidationResponse = (data, desiredCount, userId, userName) => {
	let response = [];
	let randomItems = data.slice(0, desiredCount);
	const itemLength = randomItems.length;
	let i = 0;
	let skipCount = 0;
	while (response.length < itemLength && skipCount < (data.length - response.length)) {
		if ((randomItems[i].skipped_by && randomItems[i].skipped_by.includes(`${userId}-${userName}`))
			|| (randomItems[i].contributed_by && randomItems[i].contributed_by == `${userId}-${userName}`)) {
				if (itemLength + skipCount < data.length) {
					randomItems[i] = data[itemLength + skipCount]
				}
				else {
					randomItems.splice(i, 1);
				}
				skipCount++;
		}
		else {
			delete randomItems[i]["skipped_by"];
			delete randomItems[i]["contributed_by"];
			delete randomItems[i]["validation_count"];
			response.push(randomItems[i]);
			i++;
		}
	}
	return response;
}

module.exports = {
	setContributionDataForCaching: (db, type, language, toLanguage) => {
		if (!cachingEnabled) {
			return;
		}
		try {
			db.any(type == 'parallel' ? getParallelContributionDataForCaching : getContributionDataForCaching, [type, language, toLanguage])
				.then(async (data) => {
					console.log("cacheLength", data.length)
					await cache.setAsync(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(data), expiry);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (err) {
			console.log("CACHING ERROR: " + err)
		}
	},
	getDataForContribution: async (type, language, toLanguage, userId, userName) => {
		if (!cachingEnabled) {
			return null;
		}
		try {
			const cacheResponse = await cache.getAsync(`dataset_row_${type}_${language}_${toLanguage}`);
			if (cacheResponse == null)
				return null;

			const cacheData = JSON.parse(cacheResponse);
			console.log("cacheLength", cacheData.length)
			return generateResponse(cacheData, 5, userId, userName);
		} catch (err) {
			console.log("CACHING ERROR: " + err)
		}
	},
	removeItemFromCache: async (dataset_row_id, type, language, toLanguage) => {
		if (!cachingEnabled) {
			return;
		}
		try {
			const cacheResponse = await cache.getAsync(`dataset_row_${type}_${language}_${toLanguage}`);
			const cacheData = JSON.parse(cacheResponse);
			let data = cacheData.filter(o => o.dataset_row_id != dataset_row_id);
			console.log("cacheLength", data.length)
			await cache.setAsync(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(data), expiry);
		} catch (err) {
			console.log("CACHING ERROR: " + err)
		}
	},
	markContributionSkippedInCache: async (type, fromLanguage, toLanguage, dataset_row_id, userId, userName) => {
		if (!cachingEnabled) {
			return;
		}
		try {
			const cacheResponse = await cache.getAsync(`dataset_row_${type}_${fromLanguage}_${toLanguage}`);
			if (cacheResponse) {
				const cacheData = JSON.parse(cacheResponse);
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
				await cache.setAsync(`dataset_row_${type}_${fromLanguage}_${toLanguage}`, JSON.stringify(cacheData), expiry);
			}
		} catch (err) {
			console.log("CACHING ERROR: " + err)
		}
	},
	setValidationDataForCaching: (db, type, language, toLanguage) => {
		if (!cachingEnabled) {
			return;
		}
		try {
			db.any(type == 'parallel' ? getParallelValidationDataForCaching : getValidationDataForCaching, [type, language, toLanguage])
				.then(async (data) => {
					console.log("cacheLength", data.length)
					data = sortAndFilterValidationData(data);
					await cache.setAsync(`contributions_${type}_${language}_${toLanguage}`, JSON.stringify(data), expiry);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (err) {
			console.log("CACHING ERROR: " + err)
		}
	},
	getDataForValidation: async (type, language, toLanguage, userId, userName) => {
		if (!cachingEnabled) {
			return null;
		}
		try {
			const cacheResponse = await cache.getAsync(`contributions_${type}_${language}_${toLanguage}`);
			if (cacheResponse == null)
				return null;

			const cacheData = JSON.parse(cacheResponse);
			console.log("cacheLength", cacheData.length)
			return generateValidationResponse(cacheData, 5, userId, userName);
		} catch (err) {
			console.log("CACHING ERROR: " + err)
		}
	},
	updateCacheAfterValidation: async (contribution_id, type, fromLanguage, toLanguage, action, userId, userName) => {
		if (!cachingEnabled) {
			return;
		}
		try {
			const cacheResponse = await cache.getAsync(`contributions_${type}_${fromLanguage}_${toLanguage}`);
			if (cacheResponse) {
				let cacheData = JSON.parse(cacheResponse);
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
				cacheData = sortAndFilterValidationData(cacheData);
				await cache.setAsync(`contributions_${type}_${fromLanguage}_${toLanguage}`, JSON.stringify(cacheData), expiry);
			}
		} catch (err) {
			console.log("CACHING ERROR: " + err)
		}
	}
}