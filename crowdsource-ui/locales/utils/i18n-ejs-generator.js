const { MOTHER_TONGUE, ALL_LANGUAGES } = require('../../src/views/js/constants');

const fs = require('fs');
const ejs = require('ejs');
const { I18n } = require('i18n');
const LANGUAGES = ALL_LANGUAGES
console.log('LANGUAGES:', LANGUAGES)
async function ejs2html(path, information, i18n, targetPath, fileName, locale) {
  fs.readFile(path, 'utf8', async function (err, data) {
    if (err) {
      return false;
    }

    const info = Object.assign(information, {
      filename: path,
      compileDebug: false,
    });
    i18n.init(info);
    info.setLocale(locale);

    const html = ejs.render(data, info);

    fs.mkdirSync(targetPath, { recursive: true });
    fs.writeFile(targetPath + '/' + fileName, html, function (err2) {
      if (err2) {
        return false;
      }
      return true;
    });
  });
}

const generateLocalisedHtmlFromEjs = function (inputPath, outPath, moduleName) {
  const i18n = new I18n({
    locales: [
      'as',
      'bn',
      'en',
      'gu',
      'hi',
      'kn',
      'ml',
      'mr',
      'or',
      'pa',
      'ta',
      'te',
      'doi',
      'mai',
      'ur',
      'kr',
      'kd',
      'mnibn',
      'mnimm',
      'satol',
      'satdv',
      'sa',
    ],
    directory: 'locales',
  });

  i18n.getLocales().forEach(async locale => {
    let outputPath, ejsPath;
    if (moduleName) {
      outputPath = `${outPath}/${locale}/${moduleName}`;
      ejsPath = `${inputPath}/${moduleName}`;
    } else {
      outputPath = `${outPath}/${locale}`;
      ejsPath = `${inputPath}`;
    }
    fs.rmdirSync(outputPath, { recursive: true });

    await ejs2html(
      `${ejsPath}/about-us.ejs`,
      { MOTHER_TONGUE, LANGUAGES },
      i18n,
      outputPath,
      'about-us.html',
      locale
    );
    await ejs2html(`${ejsPath}/badge-info.ejs`, {}, i18n, outputPath, 'badges.html', locale);
    await ejs2html(`${ejsPath}/validatorBadgesInfo.ejs`, {}, i18n, outputPath, 'validator-badges.html', locale);
    await ejs2html(
      `${ejsPath}/dashboard.ejs`,
      { MOTHER_TONGUE, LANGUAGES, isCookiePresent: false },
      i18n,
      outputPath,
      'dashboard.html',
      locale
    );
    await ejs2html(`${ejsPath}/feedback.ejs`, {}, i18n, outputPath, 'feedback.html', locale);
    await ejs2html(
      `${ejsPath}/home.ejs`,
      { MOTHER_TONGUE, LANGUAGES, isCookiePresent: false, defaultLang: undefined },
      i18n,
      outputPath,
      'home.html',
      locale
    );
    await ejs2html(`${ejsPath}/not-found.ejs`, {}, i18n, outputPath, 'not-found.html', locale);
    await ejs2html(`${ejsPath}/record.ejs`, {}, i18n, outputPath, 'record.html', locale);
    await ejs2html(
      `${ejsPath}/terms-and-conditions.ejs`,
      {},
      i18n,
      outputPath,
      'terms-and-conditions.html',
      locale
    );
    await ejs2html(`${ejsPath}/thank-you.ejs`, {}, i18n, outputPath, 'thank-you.html', locale);
    await ejs2html(`${ejsPath}/validator-thank-you.ejs`, {}, i18n, outputPath, 'validator-thank-you.html', locale);

    await ejs2html(
      `${ejsPath}/validator-prompt-page.ejs`,
      {},
      i18n,
      outputPath,
      'validator-page.html',
      locale
    );

    await ejs2html(`${ejsPath}/profanity-boloindia.ejs`, {}, i18n, outputPath, 'profanity-boloindia.html', locale);
    await ejs2html(`${ejsPath}/profanity-home.ejs`, { LANGUAGES }, i18n, outputPath, 'profanity-home.html', locale);
    await ejs2html(`${ejsPath}/profanity.ejs`, {}, i18n, outputPath, 'profanity.html', locale);
  });
};

module.exports = generateLocalisedHtmlFromEjs;