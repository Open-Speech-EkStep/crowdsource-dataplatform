const config = require('config');
const Redlock = require('redlock');
const Redis = require("ioredis");
Redis.Promise = require("bluebird");

const expiry = config.cache_timeout || Number(config.cache_timeout) || 1800;
const prefix = config["envName"];
const cachingEnabled = config.caching ? config.caching == "enabled" : false;

Redis.Promise.onPossiblyUnhandledRejection(function (error) {
    console.log("ioredis error:", error);
});

const client = cachingEnabled ? new Redis.Cluster(
    [{ "host": process.env.REDISCACHEHOSTNAME, port: 6380 }]
    , {
        scaleReads: 'all',
        slotsRefreshTimeout: 2000,
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
            password: process.env.REDISCACHEKEY,
            tls: {
                checkServerIdentity: (servername, cert) => {
                    return undefined;
                },
            }
        }
    }) : {};

const distributeRedisdLock = new Redlock(
    [client],
    {
        driftFactor: 0.01, // time in ms
        retryCount: -1,
        retryDelay: 200 // time in ms
    }
);

distributeRedisdLock.on('clientError', function (err) {
    console.log('A redlock error has occurred:', JSON.stringify(err));
});

const setWithLock = async (key, db, query, params, callback) => {
    let lock = await distributeRedisdLock.acquire(`lock:${key}`, 20000);
    const cacheStatus = await getAsync(`${key}_status`);
    if (cacheStatus === 'done' || cacheStatus === 'in progress') {
        await lock.unlock();
        return;
    }
    await setAsync(`${key}_status`, 'in progress', expiry);

    db.any(query, params)
        .then(async (data) => {
            console.log("cacheLength", data.length);
            if (callback)
                data = callback(data);
            await setAsync(`${key}`, JSON.stringify(data), expiry);
            await setAsync(`${key}_status`, 'done', 1);
            await lock.unlock();
        })
        .catch((err) => {
            console.log(err);
            lock.unlock();
        });

}
const setAsync = (key, value, expiryTime) => {
    return client.set(prefix + "_" + key, value, 'EX', expiryTime);
}
const getAsync = (key) => {
    return client.get(prefix + "_" + key);
}

module.exports = {
    setAsync,
    getAsync,
    setWithLock
}