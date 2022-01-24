const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

function gcpUploader(filename, userName, userId, language) {
    if (!userName) {
        userName = "unknown";
    }
    const fullPath = `raw/landing/${language}/audio/users/${userId}/${userName}/${filename}`;
    return storage.bucket(process.env.BUCKET_NAME).upload(filename, { destination: fullPath });
}

module.exports = { gcpUploader }
