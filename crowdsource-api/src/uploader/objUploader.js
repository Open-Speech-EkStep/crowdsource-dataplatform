const { gcpUploader } = require("./gcpUploader")
const { awsUploader } = require("./awsUploader")
const { azureUploader } = require("./azureUploader")

const uploader = function (provider) {
    uploaders = { 'gcp': gcpUploader, 'aws': awsUploader, 'azure': azureUploader }

    return uploaders[provider]
}

module.exports = { uploader }
