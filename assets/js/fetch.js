import origFetch from 'node-fetch';
const { api_url } = require('./env-api')

const fetch = (url, ...params) => {
  if (url.startsWith('/')) return origFetch(api_url + url, ...params)
  else return origFetch(url, ...params);
}

module.exports = fetch