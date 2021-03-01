const AWS = require('aws-sdk');
const fs = require('fs')

const bucket = process.env.BUCKET_NAME

const s3 = new AWS.S3();

const awsDownloader = function (filename) {

    const downloadParams = { Bucket: bucket, Key: filename };

    return s3.getObject(downloadParams);
};

module.exports = { awsDownloader }

