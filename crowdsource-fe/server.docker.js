const chalk = require('chalk');
const express = require('express');
const next = require('next');

const app = express();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.disable('x-powered-by');

  app.use(express.static('target', { redirect: false }));

  app.all('*', (req, res) => handle(req, res));

  app.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`${chalk.green('ready')} - started server on 0.0.0.0:${port}, url: http://localhost:${port}`);
  });
});
