const AWS = require('aws-sdk');
const fs = require('fs')

const bucket = process.env.BUCKET_NAME

const config = {
    AWS_SECRET_ACCESS_KEY=process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID=process.env.AWS_ACCESS_KEY_ID
}

const s3 = new AWS.S3(config);

const awsDownloader = function (filename) {

    const downloadParams = { Bucket: bucket, Key: filename };

    return s3.getObject(downloadParams);
};

module.exports = { awsDownloader }

