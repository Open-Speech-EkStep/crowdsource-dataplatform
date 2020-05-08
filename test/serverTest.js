expect = require("chai").expect;
const app = require('../src/server');
const request = require('supertest');

describe("API test example: get /", () => {
  it('responds to /contact-us', async () => {
    await request(app)
      .get('/contact-us')
      .expect(200)
      .expect('Content-Type', "text/html; charset=utf-8")
  });
});