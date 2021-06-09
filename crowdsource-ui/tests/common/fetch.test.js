const {mockLocalStorage} = require('../utils');
jest.mock('node-fetch');

const fetch = require('../../build/js/common/fetch');

describe("fetch", ()=> {
  test("should fetch data with api_url when given url starts with /",  () => {
    const origFetch = require('node-fetch');
    origFetch.mockImplementation(cb => {
      const res = {};
      res.ok = true;
      return Promise.resolve(res);
    });
    mockLocalStorage();
    fetch('/get-locale-strings/en', {
      credentials: 'include',
      mode: 'cors'
    }).then(data=>{
      expect(data.ok).toEqual(true)
    })
  })

  test("should fetch data without api_url when given url do not starts with /",  () => {
    const origFetch = require('node-fetch');
    origFetch.mockImplementation(cb => {
      const res = {};
      res.ok = true;
      return Promise.resolve(res);
    });
    mockLocalStorage();
    fetch('get-locale-strings/en', {
      credentials: 'include',
      mode: 'cors'
    }).then(data => {
      expect(data.ok).toEqual(true)
    })
  })

  test("should give error if mocked function produce error",  () => {
    const origFetch = require('node-fetch');
    origFetch.mockImplementation(cb => {
      const res = {};
      res.ok = false;
      return Promise.reject(res);
    });
    mockLocalStorage();
    fetch('get-locale-strings/en', {
      credentials: 'include',
      mode: 'cors'
    }).catch(data=>{
      expect(data.ok).toEqual(false)
    })
  })
})
