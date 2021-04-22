const AWS = require('aws-sdk');
const fs = require('fs')

const bucket = process.env.BUCKET_NAME

const config = {
    AWS_SECRET_ACCESS_KEY:process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID:process.env.AWS_ACCESS_KEY_ID
}

const s3 = new AWS.S3(config);



const awsUploader = function (filename, userName, userId, language) {

    const fileContent = fs.readFileSync(filename)

    const fullPath = `raw/landing/${language}/audio/users/${userId}/${userName}/${filename}`

    const uploadParams = { Bucket: bucket, Key: fullPath, Body: fileContent };

    return s3.upload(uploadParams).promise()
};

module.exports = { awsUploader }

