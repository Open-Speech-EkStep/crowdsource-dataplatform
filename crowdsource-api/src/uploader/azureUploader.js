const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');

const { AZURE_STORAGE_CONNECTION_STRING, BUCKET_NAME } = process.env;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

const azureUploader = function (filename, userName, userId, language) {
    const containerClient = blobServiceClient.getContainerClient(BUCKET_NAME);

    const content = fs.readFileSync(filename)
    const blobName = `raw/landing/${language}/audio/users/${userId}/${userName}/${filename}`

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    return blockBlobClient.upload(content, Buffer.byteLength(content));
};

module.exports = { azureUploader }
