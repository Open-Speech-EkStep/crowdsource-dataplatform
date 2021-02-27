const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

const bucketName = process.env.BUCKET_NAME;

function getFile(fileName) {
    return storage.bucket(bucketName).file(fileName);
}

module.exports = {getFile}
