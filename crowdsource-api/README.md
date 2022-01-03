# crowdsource-api

> Backend for Crowdsourcing Platform.

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

npm start

# Local dev server will automatically starts on http://localhost:8080
```

## Available Scripts

In the project directory, you can run:

### `npm run start`

It will start the server on [http://localhost:8080](http://localhost:8080).

### `npm run watch`

Runs the server in the watch mode on [http://localhost:8080](http://localhost:8080).
The server will reload if you make edits.

### `npm run test`

Runs all unit tests.

### `npm run db-migrate:create`

It will create sql files for new migration. Please specify the migration filename as a parameter to the command. Eg- `npm run db-migrate:create -- (file-name)`.

### `npm run db-migrate:up`

It will run all pending migrations on dev environment.

### `npm run swagger-autogen`

This command will automatically generate files for swagger documentation.

### `npm run start-doc`

It will run the swagger ui on local.
