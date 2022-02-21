# crowdsource-fe

> Frontend for Crowdsourcing Platform.

## Features

- Supports [these](https://nextjs.org/docs/basic-features/supported-browsers-features) browsers and features.

## Development

- Make sure your following requirements for npm and node are met:

| Package | Version |
| ------- | ------- |
| npm     | 6.14.14 |
| node    | 14.17.5 |

If you are using [nvm](https://github.com/nvm-sh/nvm), you can run `nvm use` in the root directory to install the correct version of node.

- Open your favorite Terminal and run these commands:

```bash
npm install

npm run dev

# Local dev server will automatically starts on http://localhost:8080
```

## Available Scripts

In the project directory, you can run:

### `npm run clean`

Clean up cached or build folders.

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.

### `npm run dev:axe`

Similar to `npm run dev` but also runs [@axe-core/react](https://github.com/dequelabs/axe-core-npm).

### `npm run lint`

For running eslint on source code.

### `npm run lint:fix`

For fixing eslint errors.

### `npm run stylelint`

For running stylelint on source code.

### `npm run stylelint:fix`

For fixing stylelint errors.

### `npm run format`

For running prettier on the source code.

### `npm run typecheck`

For running typescript typecheck.

### `npm run test`

Launches the test runner in the interactive watch mode.

### `npm run test:coverage`

Launches the test runner with coverage.

### `npm run test:lh-ci`

For running [lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci). Please ensure you ran `npm run build` first before running this command.

### `npm run node-talisman`

For running talisman on the source code.

### `npm run check`

For running lint, stylelint, typecheck, test with coverage and talisman.

### `npm run build`

Builds the app for production to the `.next` folder.

### `npm run build:docker`

Same as `npm run build` but for docker.

### `npm start`

It will start the production server on [http://localhost:8080](http://localhost:8080). Please ensure you ran `npm run build` first before running this command.

### `npm run start:docker`

It will start the production server on [http://localhost:3000](http://localhost:3000) for docker. Please ensure you ran `npm run build:docker` first before running this command.

## App Setup Configurations

- To setup a new application, create/add the [brand](brand/<brand-name>.json) configuration file.

```
{
  "brand": {
    "initiativeBaseRoute": {
      "tts": <tts-initiative-pathname>,
      "asr": <asr-initiative-pathname>,
      "translation": <translation-initiative-pathname>,
      "ocr": <ocr-initiative-pathname>
    }
  }
}
```

\*url should start with '/' e.g for tts: "/tts-initiative"
Rename initiative pages [here](src/pages/<initiative-name>)
e.g <asr-initiative>
<tts-initiative>
<translation-initiative>
<ocr-initiative>
Initiative folder name should be same as initiative url name
e.g if for tts url is "/tts-initiative", then its page name should be "tts-initiative"

- To enable your brand specific changes first update config/<env>.json file
  e.g. "brand": "<website-name>"
  "contextRoot": "<context-root>",

- Update [sitemap](public/sitemap.xml).

- Custom brand images can be added inside a <brand> folder with filename format and structure similar to [this folder](public/images/vakyansh).
  also change $image-context-root: <context-root> for background images path to [this folder](src/styles/mixins)

- To enable languages for contributions
  Add language code in config/<env>.json "enabled_languages" to enable languages for contributions
  e.g. "enabled_languages": ["as", "bn", "en", "gu", "hi", "kn", "ml", "mr", "or", "pa", "ta", "te"];

- To enable languages for localisation/translations
  Add language code in config/<env>.json "enabled_locales" to enable languages for localisation/translations
  e.g. "enabled_locales": ["as", "bn", "en", "gu", "hi", "kn", "ml", "mr", "or", "pa", "ta", "te"],
  create common.json folder to [this folder](public/locales/<locale>);
  e.g to enable "marathi" language , create public/locales/mr/common.json;
  Copy all the keys from public/locales/en/common.json and paste to your folder i.e public/locales/mr/common.json;
  Run translation script to get translations in your language.

- Brand specific english content (text shown on UI) can be customised [here](public/locales/en/common.json).
  e.g "tts": "<tts-initiative-name>",
  "asr": "<asr-initiative-name>",
  "translation": "<translation-initiative-name>",
  "ocr": "<ocr-initiative-name>",
  "logoTitlePrefix": "<website-name>",
  "logoTitleSuffix": "<website-name-suffix>" , // update this key only if website name contains two parts
  "initiativeTextSuffix": "<initiative-name-suffix>", // update this key only if <initiative-pathname> contains any suffix. e.g 'tts initiative' , here 'tts' is 'initiative name' and 'initiative' is its 'suffix'
  "recommendQuestionText": "Would you recommend <website-name> to your friends & family?",
  "revisitQuestionText": "Would you revisit <website-name>?",
  "asrContributionStatsHeader": "Contributions made to <asr-initiative-name> <initiative-name-suffix>",
  "ttsContributionStatsHeader": "Contributions made to <tts-initiative-name> <initiative-name-suffix>",
  "ocrContributionStatsHeader": "Contributions made to <ocr-initiative-name> <initiative-name-suffix>",
  "translationContributionStatsHeader": "Contributions made to <translation-initiative-name> <initiative-name-suffix>",
  "metaDescription": "<website-name>: An initiative for Indian languages that will be as Indian, as you and I. We invite you to contribute data to develop Speech Recognition, Text-to-Speech, Machine Translation and Optical Character Recognition for Indian languages.",
  "metaOGTitle": "<website-name> : An initiative for Indian languages"

        similarly update <initiative-name> used in other keys.

- Update [T&C](crowdsource-fe/components/TermsAndConditions)
- Update add <context-root> in url (if required) to [lighthouserc](crowdsource-fe/.lighthouserc.js)

## Steps to onboard new language

- To onboard languages for contributions

  1. Add language code in config/<env>.json "enabled_languages" to enable languages for contributions.

     e.g. "enabled_languages": ["as", "bn", "en", "gu", "hi", "kn", "ml", "mr", "or", "pa", "ta", "te"];

  2. Add language code and language in LOCALES_MAPPING, RAW_LANGUAGES AND DISPLAY_LANGUAGES constants to [this file](src/constants/localesConstant.ts).
  3. Add language in LANGUAGE_UNICODE,OTHER_LANGUAGE_UNICODE constant and language specific keyboard pattern in KeyboardLanguageLayout constant to [this file](src/constants/Keyboard.ts).

     Refer Link for Unicode: https://jrgraphix.net/r/Unicode/0E00-0E7F

     Refer Link for keyboard layout: https://github.com/simple-keyboard/simple-keyboard-layouts/tree/master/build/layouts

  4. Add validation score for corresponding language to [this file](src/constants/langaugeConfigConstant.ts).
  5. Add language code in config/<env>.json "hasLanguage_image" to enable images and badges.

     e.g. "hasLanguage_image": ["as", "bn", "en", "gu", "hi", "kn", "ml", "mr", "or", "pa", "ta", "te"];

  6. Add badges and logos for corresponding language in images folder

     e.g. to enable "marathi" language logo , create public/images/[brand]/mr/logos and put all logos;
     to enable "marathi" language badges, create public/images/[brand]/mr/badges and put all badges;

     ```
     NOTE: If language code and language already added in above steps you can skip that point.
     ```

- To onboard languages for localisation/translations

  1. Add language code in config/<env>.json "enabled_locales" to enable languages for localisation/translations.

     e.g. "enabled_locales": ["as", "bn", "en", "gu", "hi", "kn", "ml", "mr", "or", "pa", "ta", "te"],

  2. create common.json folder to [this folder](public/locales/<locale>).

     e.g to enable "marathi" language , create public/locales/mr/common.json;

  3. Copy all the keys from public/locales/en/common.json and paste to your folder i.e public/locales/mr/common.json;

     Run translation script to get translations in your language.

     **NOTE: If you don't copy all the files from en.json and don't run the translation script then by default translations would be in english.**

  4. Add language prefix in RAW_LANGUAGES,LOCALES_LANGUAGE_MAPPING AND LOCALE_LANGUAGES constants inside [this file](src/constants/localesConstant.ts).

  5. Add language code in config/<env>.json "hasLanguage_image" to enable logos.

     e.g. "hasLanguage_image": ["as", "bn", "en", "gu", "hi", "kn", "ml", "mr", "or", "pa", "ta", "te"];

  6. Add logos for corresponding language in public/images folder.

     e.g. to enable "marathi" language , create public/images/[brand]/mr/logos and add logos;

     ```
     NOTE: If language code and language already added in above steps you can skip that point.
     ```
