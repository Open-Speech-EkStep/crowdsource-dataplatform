const fs = require('fs');

const glob = require('glob');

class ImageReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onTestResult(test, testResult) {
    if (
      testResult.numFailingTests &&
      (testResult.failureMessage.match(/different from snapshot/) ||
        testResult.failureMessage.match(/but was different/))
    ) {
      glob('src/**/__image_snapshots__/__diff_output__/*.*', function (err, files) {
        if (!err) {
          if (!fs.existsSync(`${__dirname}/__failed__vr__snapshots__`)) {
            fs.mkdirSync(`${__dirname}/__failed__vr__snapshots__/`);
          }

          files.forEach(file => {
            fs.copyFileSync(
              `${__dirname}/${file}`,
              `${__dirname}/__failed__vr__snapshots__/${file.split('/').slice(-1)}`
            );
          });
        }
      });
    }
  }
}

module.exports = ImageReporter;
