const AWS = require('aws-sdk');
const fs = require('fs')

const bucket = process.env.BUCKET_NAME

const s3 = new AWS.S3();



const awsUploader = function (filename, userName, userId, language) {
    
    const fileContent = fs.readFileSync(filename)

    const fullPath = `raw/landing/${language}/audio/users/${userId}/${userName}/${filename}`

    const uploadParams = { Bucket: bucket, Key: fullPath, Body: fileContent };

    return s3.upload(uploadParams).promise()
};

module.exports = { awsUploader }

