const {managerAuthMiddleWare} = require("./../src/middleware/authMiddleware");

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

    test("Test Manager Auth Middlware Authorized",()=>{
        const req = { session: {passport:{user:{permissions:['manager:action']}}}};

        managerAuthMiddleWare(req, res, nextSpy);

        expect(nextSpy).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledTimes(0)
    })
})