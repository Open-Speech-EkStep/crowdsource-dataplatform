const { getEnabledLanguages } = require('../../src/views/js/language-filter');

const fs = require('fs');
const ejs = require('ejs');
const { I18n } = require('i18n');

async function ejs2html(path, information, i18n, targetPath, fileName, locale, contextRoot,brand) {
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

    let html = ejs.render(data, info);

    html = html.replace(/"\/img\//g, `"${contextRoot}/img/${brand}/`);
    html = html.replace(/"\/js\//g, `"${contextRoot}/js/`);
    html = html.replace(/"\/css\//g, `"${contextRoot}/css/`);

    fs.mkdirSync(targetPath, { recursive: true });
    fs.writeFile(targetPath + '/' + fileName, html, function (err2) {
      if (err2) {
        return false;
      }
      return true;
    });
  });
}

const generateLocalisedHtmlFromEjs = function (inputPath, outPath, moduleName, enabledLanguage, contextRoot, brand) {
  const config = require(`../../brand/${brand}.json`)
  
  const LANGUAGES = getEnabledLanguages(enabledLanguage);
  const MOTHER_TONGUE = [
    { value: 'Assamese', text: 'অসমীয়া' },
    { value: 'Bengali', text: 'বাংলা' },
    { value: 'Bodo', text: 'Bodo' },
    { value: 'Dogri', text: 'Dogri' },
    { value: 'Gujarati', text: 'ગુજરાતી' },
    { value: 'Hindi', text: 'हिंदी' },
    { value: 'Kannada', text: 'ಕನ್ನಡ' },
    { value: 'Kashmiri', text: 'Kashmiri' },
    { value: 'Konkani', text: 'Konkani' },
    { value: 'Maithili', text: 'Maithili' },
    { value: 'Malayalam', text: 'മലയാളം' },
    { value: 'Manipuri', text: 'Manipuri' },
    { value: 'Marathi', text: 'मराठी' },
    { value: 'Nepali', text: 'Nepali' },
    { value: 'Odia', text: 'ଓଡିଆ' },
    { value: 'Punjabi', text: 'ਪੰਜਾਬੀ' },
    { value: 'Santali', text: 'Santali' },
    { value: 'Sanskrit', text: 'Sanskrit' },
    { value: 'Sindhi', text: 'Sindhi' },
    { value: 'Tamil', text: 'தமிழ்' },
    { value: 'Telugu', text: 'తెలుగు' },
    { value: 'Urdu', text: 'Urdu' },
  ];

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
      `${ejsPath}/badges.ejs`,
      { MOTHER_TONGUE, LANGUAGES ,config},
      i18n,
      outputPath,
      'badges.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/my-badges.ejs`,
      { MOTHER_TONGUE, LANGUAGES,config },
      i18n,
      outputPath,
      'my-badges.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/validatorBadgesInfo.ejs`,
      { MOTHER_TONGUE, LANGUAGES,config },
      i18n,
      outputPath,
      'validator-badges.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/dashboard.ejs`,
      { MOTHER_TONGUE, LANGUAGES, isCookiePresent: false ,config},
      i18n,
      outputPath,
      'dashboard.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/home.ejs`,
      { MOTHER_TONGUE, LANGUAGES, isCookiePresent: false, defaultLang: undefined, config },
      i18n,
      outputPath,
      'home.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/not-found.ejs`,
      { MOTHER_TONGUE, LANGUAGES,config },
      i18n,
      outputPath,
      'not-found.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/record.ejs`,
      { MOTHER_TONGUE, LANGUAGES ,config},
      i18n,
      outputPath,
      'record.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/terms-and-conditions.ejs`,
      { MOTHER_TONGUE, LANGUAGES,config },
      i18n,
      outputPath,
      'terms-and-conditions.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/thank-you.ejs`,
      { MOTHER_TONGUE, LANGUAGES,config },
      i18n,
      outputPath,
      'thank-you.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(
      `${ejsPath}/validator-thank-you.ejs`,
      { MOTHER_TONGUE, LANGUAGES,config },
      i18n,
      outputPath,
      'validator-thank-you.html',
      locale,
      contextRoot,brand
    );

    await ejs2html(
      `${ejsPath}/validator-prompt-page.ejs`,
      { MOTHER_TONGUE, LANGUAGES ,config},
      i18n,
      outputPath,
      'validator-page.html',
      locale,
      contextRoot,brand
    );

    // await ejs2html(
    //   `${ejsPath}/profanity.ejs`,
    //   { LANGUAGES,config },
    //   i18n,
    //   outputPath,
    //   'profanity.html',
    //   locale,
    //   contextRoot,brand
    // );
    // await ejs2html(
    //   `${ejsPath}/profanity-home.ejs`,
    //   { LANGUAGES ,config},
    //   i18n,
    //   outputPath,
    //   'profanity-home.html',
    //   locale,
    //   contextRoot,brand
    // );
    await ejs2html(
      `${ejsPath}/profanity.ejs`,
      { LANGUAGES,config },
      i18n,
      outputPath,
      'profanity.html',
      locale,
      contextRoot,brand
    );
    await ejs2html(`${ejsPath}/key_gen.ejs`, {config}, i18n, outputPath, 'key_gen.html', locale, contextRoot,brand);
  });
};

module.exports = generateLocalisedHtmlFromEjs;
