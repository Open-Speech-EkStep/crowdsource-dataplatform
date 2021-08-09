var redis = require("redis");
const config = require('config');
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const prefix = config["envName"]

var client = redis.createClient(6380, process.env.REDISCACHEHOSTNAME,
    { auth_pass: process.env.REDISCACHEKEY, tls: { servername: process.env.REDISCACHEHOSTNAME } });

client.on("error", function (err) {
    setTimeout(connect, 15000);
    console.log("RedisError " + err);
});
client.on("end", function (err) {
    setTimeout(connect, 15000);
    console.log("RedisEnd " + err);
});

connect = function () {
    client = redis.createClient(6380, process.env.REDISCACHEHOSTNAME,
        { auth_pass: process.env.REDISCACHEKEY, tls: { servername: process.env.REDISCACHEHOSTNAME } });
}

module.exports = {
    setAsync: (key, value, expiry) => {
        return client.setAsync(prefix + "_" + key, value, 'EX', expiry);
    },
    getAsync: (key) => {
        return client.getAsync(prefix + "_" + key);
    }
}