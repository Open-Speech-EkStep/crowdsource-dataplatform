var Redis = require("ioredis");
Redis.Promise = require("bluebird");
   
const config = require('config');
//var redis = require("redis");
// var bluebird = require("bluebird");

// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

const prefix = config["envName"];
const cachingEnabled = config.caching ? config.caching == "enabled" : false;

const client = cachingEnabled ? new Redis.Cluster(
    [{ "host": process.env.REDISCACHEHOSTNAME, port: 6379 }]
    , {
        scaleReads: 'all',
        slotsRefreshTimeout: 2000,
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
            password: process.env.REDISCACHEKEY
        }
    }) : {};

// var client = cachingEnabled ? redis.createClient(6380, process.env.REDISCACHEHOSTNAME,
    // { auth_pass: process.env.REDISCACHEKEY, tls: { servername: process.env.REDISCACHEHOSTNAME } }) : {};

// if (cachingEnabled) {
//     client.on("error", function (err) {
//         setTimeout(connect, 15000);
//         console.log("RedisError " + err);
//     });
//     client.on("end", function (err) {
//         setTimeout(connect, 15000);
//         console.log("RedisEnd " + err);
//     });
// }

const connect = function () {
    // client = redis.createClient(6380, process.env.REDISCACHEHOSTNAME,
    //     { auth_pass: process.env.REDISCACHEKEY, tls: { servername: process.env.REDISCACHEHOSTNAME } });
}

module.exports = {
    setAsync: (key, value, expiry) => {
        return client.set(prefix + "_" + key, value, 'EX', expiry);
    },
    getAsync: (key) => {
        return client.get(prefix + "_" + key);
    }
}