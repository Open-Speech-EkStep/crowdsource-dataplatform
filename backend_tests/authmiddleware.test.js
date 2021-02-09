const { managerAuthMiddleWare, validatorAuthMiddleware, sessionMiddleware } = require("./../src/middleware/authMiddleware");

describe("Auth Middleware test", () => {
    let res;
    let nextSpy;
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
    });

    test("Test Manager Auth Middlware Authorized", () => {
        const req = { session: { passport: { user: { permissions: ['manager:action'] } } } };

        managerAuthMiddleWare(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(1)
        expect(res.sendStatus).toHaveBeenCalledTimes(0)
    })
    test("Test Manager Auth Middlware UnAuthorized", () => {
        const req = { session: { passport: { user: { permissions: ['validator:action'] } } } };

        managerAuthMiddleWare(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(0)
        expect(res.sendStatus).toHaveBeenCalledTimes(1)
    })
    test("Test Validator Auth Middlware Authorized", () => {
        const req = { session: { passport: { user: { permissions: ['validator:action'] } } } };

        validatorAuthMiddleware(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(1)
        expect(res.sendStatus).toHaveBeenCalledTimes(0)
    })
    test("Test Validator Auth Middlware UnAuthorized", () => {
        const req = { session: { passport: { user: { permissions: ['manager:action'] } } } };

        validatorAuthMiddleware(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(0)
        expect(res.sendStatus).toHaveBeenCalledTimes(1)
    })

    test("Test Session Middlware Authorized", () => {
        const req = { session: { passport: { user: { permissions: ['manager:action'] } } } };

        sessionMiddleware(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(1)
        expect(res.sendStatus).toHaveBeenCalledTimes(0)
    })
    test("Test Session Middlware Unauthorized with session not present", () => {
        const req = {};

        sessionMiddleware(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(0)
        expect(res.sendStatus).toHaveBeenCalledTimes(1)
    })
    test("Test Session Middlware Unauthorized with session not having passport object", () => {
        const req = { session: {} };

        sessionMiddleware(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(0)
        expect(res.sendStatus).toHaveBeenCalledTimes(1)
    })
    test("Test Session Middlware Unauthorized with no users", () => {
        const req = { session: { passport: {} } };

        sessionMiddleware(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(0)
        expect(res.sendStatus).toHaveBeenCalledTimes(1)
    })
    test("Test Session Middlware Unauthorized with users having no permission", () => {
        const req = { session: { passport: { user: { permissions: [] } } } };

        sessionMiddleware(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(0)
        expect(res.sendStatus).toHaveBeenCalledTimes(1)
    })
})