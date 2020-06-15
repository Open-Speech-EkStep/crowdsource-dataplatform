const expect = require('chai').expect;
const sinon = require('sinon');
const middleware = require('../src/middleware/validateUserInputs')

describe('middleware test', function () {
  let res;
  let nextSpy;
  const req = { body: { age: "00 - 13", userName: "lessThan12" } }
  describe('validateUserInfo', function () {
    beforeEach(() => {
      nextSpy = sinon.spy(),
        res = {
          status: sinon.spy(function () { return res; }),
          send: sinon.spy(),
          sendStatus: sinon.spy(),
          reset: function () {
            for (let method in this) {
              if (method !== 'reset') {
                this[method].reset();
              }
            }
          }
        };
    })
    it('should call next() once if userName is less than 12 char and age is given format', function () {
      const req = { body: { age: "00 - 13", userName: "lessThan12" } }
      const mw = middleware.validateUserInfo(req, res, nextSpy);

      expect(nextSpy.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.false;

    });

    it('should fail and send bad request if userName is more than 12 char and age is given format', function () {
      const req = { body: { age: "00 - 13", userName: "moreThan12character" } }
      const mw = middleware.validateUserInfo(req, res, nextSpy);

      expect(res.send.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.false;
    });

    it('should fail and send bad request if userName is more than 12 char and age is given format', function () {
      const req = { body: { age: "00 - 13", userName: "moreThan12character" } }
      const mw = middleware.validateUserInfo(req, res, nextSpy);

      expect(res.send.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.false;
    });
    it('should fail if userName contain mobile number and age is given format', function () {
      const req = { body: { age: "00 - 13", userName: "9411239876" } }
      const mw = middleware.validateUserInfo(req, res, nextSpy);

      expect(res.send.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.false;
    });
    it('should fail and send bad request if userName contain email address and age is given format', function () {
      const req = { body: { age: "00 - 13", userName: "testemail@123.com" } }
      const mw = middleware.validateUserInfo(req, res, nextSpy);

      expect(res.send.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.false;
    });
    it('should fail and send bad request if age is not given format', function () {
      const req = { body: { age: "00 - 11", userName: "abccom" } }
      const mw = middleware.validateUserInfo(req, res, nextSpy);

      expect(res.send.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.false;
    });
  });

});