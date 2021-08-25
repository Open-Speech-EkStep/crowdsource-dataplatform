const path = require('path');

process.env['NODE_CONFIG_DIR'] = path.resolve(__dirname, '../crowdsource-api/config');

require('config');
require('dotenv').config({
  path: path.resolve(__dirname, '../crowdsource-api/.env'),
});

const chalk = require('chalk');
const next = require('next');

const app = require('../crowdsource-api/src/app');

const port = parseInt(process.env.PORT, 10) || 443;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`${chalk.green('ready')} - started server on 0.0.0.0:${port}, url: http://localhost:${port}`);
  });
});
