const AWS = require('aws-sdk');
const fs = require('fs')

const bucket = process.env.BUCKET_NAME

const config = {
    AWS_SECRET_ACCESS_KEY:process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID:process.env.AWS_ACCESS_KEY_ID
}

const s3 = new AWS.S3(config);

const awsDownloader = async function (filename) {

    const downloadParams = { Bucket: bucket, Key: filename };
    
    const exists = await s3
            .headObject({
                Bucket: bucket,
                Key: filename,
            })
            .promise()
            .then(
                () => true,
                err => {
                if (err.code === 'NotFound') {
                    return false;
                }
                throw err;
                }
            );
    if (exists) {
        return s3.getObject(downloadParams);
    }
    else {
        return null;
    }
};

module.exports = { awsDownloader }

