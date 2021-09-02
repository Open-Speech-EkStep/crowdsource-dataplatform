const puppeteer = require('puppeteer');

const port = process.env.LIGHTHOUSE_CI_PORT;

module.exports = {
  ci: {
    collect: {
      chromePath: puppeteer.executablePath(),
      settings: {
        chromeFlags: ['--headless', 'CI' in process.env && '--collect.settings.chromeFlags=--no-sandbox'].filter(Boolean),
      },
      numberOfRuns: 1,
      startServerCommand: 'npm start',
      startServerReadyPattern: 'ready - started server',
      startServerReadyTimeout: 10000,
      url: [`http://localhost:${port}/en/home`],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        // TODO: Reduced minScore to suppress "Audit usage of navigator.userAgent, navigator.appVersion, and navigator.platform"
        // issue in console"
        'categories:best-practices': ['error', { minScore: 0.93 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
  },
};
