const { getContributionDataForCaching } = require('./cacheDbQueries');
const cache = require('./cache');

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
	while (response.length < itemLength && skipCount < (data.length - response.length)) {
		if (randomItems[i].skipped_by && randomItems[i].skipped_by.includes(`${userId}-${userName}`)) {
			skipCount++;
			randomItems[i] = getRandom(data, 1)[0];
		}
		else {
			delete randomItems[i]["skipped_by"];
			response.push(randomItems[i]);
			i++;
		}
	}
	return response;
}

module.exports = {
	setContributionDataForCaching : (db, type, language, toLanguage) => {
		db.any(getContributionDataForCaching, [type, language])
			.then(async (data) => {
				console.log("cacheLength", data.length)
				await cache.setAsync(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(data), 600);
			})
			.catch((err) => {
				console.log(err);
			});
	},
	getDataForContribution : async (type, language, toLanguage, userId, userName) => {
		const cacheResponse = await cache.getAsync(`dataset_row_${type}_${language}_${toLanguage}`);
		if (cacheResponse == null)
			return null;

		const cacheData = JSON.parse(cacheResponse);
        console.log("cacheLength", cacheData.length)
        return generateResponse(cacheData, 5, userId, userName);
	},
	removeItemFromCache : async (dataset_row_id, type, language, toLanguage) => {
		const cacheResponse = await cache.getAsync(`dataset_row_${type}_${language}_${toLanguage}`);
		const cacheData = JSON.parse(cacheResponse);
		let data = cacheData.filter(o => o.dataset_row_id != dataset_row_id);
		console.log("cacheLength", data.length)
		await cache.setAsync(`dataset_row_${type}_${language}_${toLanguage}`, JSON.stringify(data), 600);
	},
	markContributionSkippedInCache : async (type, fromLanguage, toLanguage, dataset_row_id, userId, userName) => {
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
			await cache.setAsync(`dataset_row_${type}_${fromLanguage}_${toLanguage}`, JSON.stringify(cacheData), 600);
		}
	}
}