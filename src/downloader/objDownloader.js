const { gcpDownloader } = require("./gcpDownloader")
const { awsDownloader } = require("./awsDownloader")


const downloader = function (provider) {
    let downloaders = { 'gcp': gcpDownloader, 'aws': awsDownloader }

    return downloaders[provider]
}

module.exports = { downloader }