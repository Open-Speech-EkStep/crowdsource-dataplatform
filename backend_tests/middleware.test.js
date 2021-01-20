const middleware = require('../src/middleware/validateUserInputs')

describe('middleware test', function () {
    let res;
    let nextSpy;
    describe('validateUserInfo', function () {
        beforeEach(() => {
            nextSpy = jest.fn(),
                res = {
                    status: jest.fn(function () { return res; }),
                    send: jest.fn(),
                    sendStatus: jest.fn(),
                    reset: function () {
                        for (let method in this) {
                            if (method !== 'reset') {
                                this[method].reset();
                            }
                        }
                    }
                };
        })
        test('should call next() once if userName is less than 12 char and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "lessThan12" } }
            middleware.validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)

        });

        it('should fail and send bad request if userName is more than 12 char and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "moreThan12character" } }
            middleware.validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        it('should fail and send bad request if userName is more than 12 char and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "moreThan12character" } }
            middleware.validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        it('should fail if userName contain mobile number and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "9411239876" } }
            middleware.validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        it('should fail and send bad request if userName contain email address and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "testemail@123.com" } }
            middleware.validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        it('should fail and send bad request if age is not given format', function () {
            const req = { body: { age: "00 - 11", userName: "abccom" } }
            middleware.validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });
    });

});