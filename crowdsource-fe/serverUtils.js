// TODO: Remove all keys except style-guide once we remove all the page toggles.
const url = require('url');

const config = require('config');

const getParsedUrl = req => url.parse(req.url, true);

const togglePagesMapping = [
  // NOTE: Add '/{sunoIndia|likhoIndia|dekhoIndia|boloIndia}/home' before '/home' path because of
  // priority issue while matching last path of `pathname` variable.
  {
    key: 'sunoIndiaHome',
    pathname: '/sunoIndia/home',
  },
  {
    key: 'boloIndiaHome',
    pathname: '/boloIndia/home',
  },
  {
    key: 'styleGuide',
    pathname: '/style-guide',
  },
  {
    key: 'home',
    pathname: '/home',
  },
];

const togglePages = (req, res, handlerCallback) => {
  const parsedUrl = getParsedUrl(req);
  const enabledPages = config.get('fe.enabledPages');

  const { pathname } = parsedUrl;

  togglePagesMapping.forEach(togglePageValue => {
    if (!enabledPages[togglePageValue.key] && pathname.endsWith(togglePageValue.pathname)) {
      return res.redirect(`${pathname}.html`);
    }
  });

  return handlerCallback();
};

module.exports = {
  togglePages,
};
