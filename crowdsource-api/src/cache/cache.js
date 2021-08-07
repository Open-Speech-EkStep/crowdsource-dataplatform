var redis = require("redis");
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client = redis.createClient(6380, process.env.REDISCACHEHOSTNAME,
    {auth_pass: process.env.REDISCACHEKEY, tls: {servername: process.env.REDISCACHEHOSTNAME}});

client.on("error", function (err) {
    console.log("RedisError " + err);
});   
client.on("end", function (err) {
    console.log("RedisEnd " + err);
});

module.exports = {
    setAsync: (key, value, expiry) => {
        return client.setAsync(key, value, 'EX', expiry);
    },
    getAsync: (key) => {
        return client.getAsync(key);
    }
}