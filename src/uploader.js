const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

function uploadFile(filename) {
    const currentDate = new Date().toISOString().slice(0, 10)
    return storage.bucket(process.env.BUCKET_NAME).upload(filename, { destination: `${currentDate}/${filename}` });
}
module.exports = {
    uploadFile
}