const { checkOriginHeader
} = require('../src/middleware/originMiddleware')

describe('origin middleware test', function () {
    const res = {
        status: jest.fn(function () { return res; }),
        send: jest.fn(),
    };
    const nextSpy = jest.fn();

    describe('checkOriginHeader', function () {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() once if all params in req are valid', function () {
            const req = { headers: { origin: 'xyz.vakyansh.in' } };
            checkOriginHeader(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });
        test('should call next() once if all params in req are valid', function () {
            const req = { headers: { origin: 'xyz.nplt.in' } };
            checkOriginHeader(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });
        test('should call next() once if all params in req are valid', function () {
            const req = { headers: { origin: 'xyz.gov.in' } };
            checkOriginHeader(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should call send() if audio duration is a string', function () {
            const req = { headers: { origin: 'xyz.vakyansh.in.google.com' } };
            checkOriginHeader(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });
});
