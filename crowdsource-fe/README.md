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

# Local dev server will automatically starts on http://localhost:3000
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm start`

It will start the production server on [http://localhost:3000](http://localhost:3000). Please ensure you ran `npm run build` first before running this command.

### `npm run lint`

For running eslint on source code.

### `npm run lint:fix`

For fixing eslint errors.

### `npm run format`

For running prettier on the source code.

### `npm run test`

Launches the test runner in the interactive watch mode.

### `npm run test:coverage`

Launches the test runner with coverage.

### `npm run test:lh-ci`

For running [lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci). Please ensure you ran `npm run build` first before running this command.

### `npm run check`

For running lint and test with coverage.
