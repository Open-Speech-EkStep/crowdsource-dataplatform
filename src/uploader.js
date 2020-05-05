const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

function uploadFile(filename) {
    return storage.bucket(process.env.BUCKET_NAME).upload(filename);
}
module.exports = {
    uploadFile
}