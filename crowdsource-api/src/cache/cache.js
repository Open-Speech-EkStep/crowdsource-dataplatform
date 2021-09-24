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
    console.log(`waiting for lock ${key}`)
    const lockTimeOut = Math.floor(Number.MAX_SAFE_INTEGER / 10);
    let lock = await distributeRedisdLock.acquire(`lock:${key}`, lockTimeOut);
    console.log(`lock acquired ${key}`)
    try {
        console.log(`checking status ${key}`)
        const cacheStatus = await getAsync(`${key}_status`);
        console.log(cacheStatus);
        if (cacheStatus === 'done' || cacheStatus === 'in progress') {
            await lock.unlock();
            console.log(`returning ${key}`)
            return;
        }
        await setAsync(`${key}_status`, 'in progress', expiry);
        console.log(`status set ${key}`)
        let data = await db.any(query, params);

        console.log("cacheLength", data.length);
        if (callback)
            data = callback(data);
        await setAsync(`${key}`, JSON.stringify(data), expiry);
        await setAsync(`${key}_status`, 'done', expiry);
        console.log(`lock released ${key}`)
        await lock.unlock();
    }
    catch (err) {
        console.log(err);
        lock.unlock();
    }
}

const doOperationWithLock = async (key, operation, lockTimeOut) => {
    console.log(`waiting for lock ${key}`)
    let lock = await distributeRedisdLock.acquire(`lock:${key}`, lockTimeOut);
    console.log(`lock acquired ${key}`)
    try {
        await operation();
        await lock.unlock();
        console.log(`lock released ${key}`)
    }
    catch (err) {
        console.log(err);
        lock.unlock();
    }
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
    setWithLock,
    doOperationWithLock
}