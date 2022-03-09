const { baseURL,api_test_url } = require('./config/config')
const {feedback, userID, location, contributions, user_rewards, reward_info, media, report, rewards, skip, store, validate} = require('./constant/apiPath')
const feedbackResponseWithCookie = async (reqBody, cookie=834983984392) => {  
        return await baseURL.post(feedback)
                .send(reqBody)
                .set('Content-type', 'application/json')
                .set('Cookie', `userId=${cookie}`)
                .set('Origin', api_test_url)
}
const userIdResponse = async () => {
        return await baseURL.get(userID)
                .set('Origin', api_test_url)
}
const locationInfoResponse = async (reqQueryParams) => {
        return await baseURL.get(location)
                .query(reqQueryParams)
                .set('Origin', api_test_url)
}
const contributionsResponseWithCookie = async (reqQueryParams, type, cookie=834983984392) => {
        return await baseURL.get(`${contributions}/${type}`)
                .query(reqQueryParams)
                .set('Content-type', 'application/json')
                .set('Cookie', `userId=${cookie}`)
                .set('Origin', api_test_url)
}
const contributionsResponseWithoutCookie = async (reqQueryParams, type) => {
        return await baseURL.get(`${contributions}/${type}`)
                .query(reqQueryParams)
                .set('Content-type', 'application/json')
                .set('Origin', api_test_url)
}
const userRewardResponseWithCookie = async (username, cookie=834983984392) => {
        return await baseURL.get(`${user_rewards}/${username}`)
                .set('Origin', api_test_url)    
                .set('Cookie', `userId=${cookie}`)
}
const userRewardResponseWithoutCookie = async (username) => {
        return await baseURL.get(`${user_rewards}/${username}`)
                .set('Origin', api_test_url)    
}
const rewardInfoResponse = async (reqQueryParams) => {
        return await baseURL.get(reward_info)
                .query(reqQueryParams)
                .set('Origin', api_test_url)
}
const mediaResponseWithCookie = async (reqBody, type, cookie=834983984392) => {
        return await baseURL.post(`${media}/${type}`)
                .type('form')
                .send(reqBody)
                .set('Content-type', 'application/json')
                .set('Cookie', `userId=${cookie}`)
                .set('Origin', api_test_url)
}
const mediaResponseWithoutCookie = async (reqBody, type) => {
        return await baseURL.post(`${media}/${type}`)
                .type('form')
                .send(reqBody)
                .set('Content-type', 'application/json')
                .set('Origin', api_test_url)     
}
const reportResponseWithCookie = async (reqBody, cookie=834983984392) => {
        return await baseURL.post(report)
                .send(reqBody)
                .set('Origin', api_test_url)
                .set('Cookie', `userId=${cookie}`)
                .set('Content-type', 'application/json');
}
const reportResponseWithoutCookie = async (reqBody) => {
                return await baseURL.post(report)
                .send(reqBody)
                .set('Origin', api_test_url)
                .set('Content-type', 'application/json');     
}
const rewardResponseWithCookie = async (reqQueryParams, cookie=834983984392) => {
        return await baseURL.get(rewards)
                .query(reqQueryParams)
                .set('Origin', api_test_url)    
                .set('Cookie', `userId=${cookie}`)
}
const rewardResponseWithoutCookie = async (reqQueryParams) => {   
        return await baseURL.get(rewards)
                .query(reqQueryParams)
                .set('Origin', api_test_url)    
}
const skipResponseWithCookie = async (reqBody,cookie=834983984392) => {   
        return await baseURL.post(skip)
                .send(reqBody)
                .set('Origin', api_test_url)
                .set('Cookie', `userId=${cookie}`)   
                .set('Content-type', 'application/json'); 
}
const skipResponseWithoutCookie = async (reqBody) => {   
        return await baseURL.post(skip)
                .send(reqBody)
                .set('Origin', api_test_url)  
                .set('Content-type', 'application/json'); 
}
const storeResponseWithCookie = async (reqBody,cookie="a1b2c3d4".concat(Math.floor((Math.random() * 1000)))) => {   
        return await baseURL.post(store)
                .send(reqBody)
                .set('Origin', api_test_url)
                .set('Cookie', `userId=${cookie}`)   
                .set('Content-type', 'application/json'); 
}
const storeResponseWithoutCookie = async (reqBody) => {   
        return await baseURL.post(store)
                .send(reqBody)
                .set('Origin', api_test_url)
                .set('Content-type', 'application/json'); 
}
const validateResponseWithCookie = async (reqBody, contributionId, action, cookie="a1b2c3d4".concat(Math.floor((Math.random() * 1000)))) => {   
        return await baseURL.post(`${validate}/${contributionId}/${action}`)
                .send(reqBody)
                .set('Origin', api_test_url)
                .set('Cookie', `userId=${cookie}`)   
                .set('Content-type', 'application/json'); 
}
const validateResponseWithoutCookie = async (reqBody, contributionId, action) => {   
        return await baseURL.post(`${validate}/${contributionId}/${action}`)
                .send(reqBody)
                .set('Origin', api_test_url)
                .set('Content-type', 'application/json'); 
}
module.exports = { feedbackResponseWithCookie, contributionsResponseWithCookie, userIdResponse, locationInfoResponse, 
                contributionsResponseWithoutCookie,userRewardResponseWithCookie, userRewardResponseWithoutCookie,
                rewardInfoResponse, mediaResponseWithCookie, mediaResponseWithoutCookie, reportResponseWithCookie, 
                reportResponseWithoutCookie, rewardResponseWithCookie, rewardResponseWithoutCookie,
                skipResponseWithCookie,storeResponseWithCookie, validateResponseWithCookie, skipResponseWithoutCookie,
                validateResponseWithoutCookie, storeResponseWithoutCookie }

