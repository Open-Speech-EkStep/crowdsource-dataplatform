const {extractFromFiles, flatten, findDuplicated, findMissing, findUnused} = require('i18n-extract');

const enLocale =  require('./../en.json');

const enLocaleFlattened = flatten(enLocale);
console.log(enLocaleFlattened);

const keys = extractFromFiles([
  './crowdsource-api*.js',
], {
  marker: 'i18n',
});

console.log(keys);