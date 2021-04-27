const { gcpUploader } = require("./gcpUploader")
const { awsUploader } = require("./awsUploader")


const uploader = function (provider) {
    uploaders = { 'gcp': gcpUploader, 'aws': awsUploader }

    return uploaders[provider]
}

module.exports = { uploader }