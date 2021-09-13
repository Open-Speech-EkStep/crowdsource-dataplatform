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

### `npm run test:vr:setup`

DO NOT RUN THIS SCRIPT. THIS IS ONLY FOR VR SETUP.

### `npm run test:vr`

For running VR tests.

### `npm run test:vr:update`

For update VR test snapshots.

### `npm run node-talisman`

For running talisman on the source code.

### `npm run check`

For running lint, stylelint, typecheck, test with coverage and talisman.

### `npm run build`

Builds the app for production to the `.next` folder.

### `npm start`

It will start the production server on [http://localhost:8080](http://localhost:8080). Please ensure you ran `npm run build` first before running this command.
