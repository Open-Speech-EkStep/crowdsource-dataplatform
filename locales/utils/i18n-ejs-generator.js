const { ONE_YEAR, MOTHER_TONGUE, LANGUAGES } = require('../../src/constants');
const fs = require('fs');
const ejs = require("ejs");
const { I18n } = require('i18n');
const mkdirp = require('mkdirp');


async function ejs2html(path, information, i18n, targetPath, fileName, locale) {
    fs.readFile(path, 'utf8', async function (err, data) {
        if (err) { return false; }
        
        var info = Object.assign(information, {
            filename: path,
            compileDebug: false
        });
        i18n.init(info);
        info.setLocale(locale);
        
        var html = ejs.render(data, info);
        
        await mkdirp(targetPath);
        fs.writeFile(targetPath + "/" + fileName, html, function (err2) {
            if (err2) { return false }
            return true;
        });
    });
}

const generateLocalisedHtmlFromEjs = function (ejsPath, outPath) {
    const i18n = new I18n({
        locales: ['as', 'bn', 'en', 'gu', 'hi', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'doi', 'mai', 'ur', 'kr', 'kd', 'mnibn', 'mnimm', 'satol', 'satdv', 'sa'],
        directory: 'locales'
    });
    
    i18n.getLocales().forEach(async locale => {
        fs.rmdirSync(`${outPath}/${locale}`, { recursive: true });

        await ejs2html(`${ejsPath}/about-us.ejs`, { MOTHER_TONGUE, LANGUAGES }, i18n, `${outPath}/${locale}`, 'about-us.html', locale);
        await ejs2html(`${ejsPath}/badge-info.ejs`, {}, i18n, `${outPath}/${locale}`, 'badges.html', locale);
        await ejs2html(`${ejsPath}/dashboard.ejs`, { MOTHER_TONGUE, LANGUAGES, isCookiePresent: false }, i18n, `${outPath}/${locale}`, 'dashboard.html', locale);
        await ejs2html(`${ejsPath}/feedback.ejs`, {}, i18n, `${outPath}/${locale}`, 'feedback.html', locale);
        await ejs2html(`${ejsPath}/home.ejs`, { MOTHER_TONGUE, LANGUAGES, isCookiePresent: false, defaultLang: undefined }, i18n, `${outPath}/${locale}`, 'home.html', locale);
        await ejs2html(`${ejsPath}/not-found.ejs`, {}, i18n, `${outPath}/${locale}`, 'not-found.html', locale);
        await ejs2html(`${ejsPath}/record.ejs`, {}, i18n, `${outPath}/${locale}`, 'record.html', locale);
        await ejs2html(`${ejsPath}/terms-and-conditions.ejs`, {}, i18n, `${outPath}/${locale}`, 'terms-and-conditions.html', locale);
        await ejs2html(`${ejsPath}/thank-you.ejs`, {}, i18n, `${outPath}/${locale}`, 'thank-you.html', locale);
        await ejs2html(`${ejsPath}/validator-prompt-page.ejs`, {}, i18n, `${outPath}/${locale}`, 'validator-page.html', locale);
    })
}

module.exports = 
    generateLocalisedHtmlFromEjs
