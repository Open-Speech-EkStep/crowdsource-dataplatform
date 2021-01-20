const {validateUserInputAndFile, validateUserInfo, convertIntoMB} = require('../src/middleware/validateUserInputs')

describe('middleware test', function () {
    describe('validateUserInfo', function () {
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
        })
        test('should call next() once if userName is less than 12 char and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "lessThan12" } }
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)

        });

        test('should fail and send bad request if userName is more than 12 char and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "moreThan12character" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if userName is more than 12 char and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "moreThan12character" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail if userName contain mobile number and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "9411239876" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if userName contain email address and age is given format', function () {
            const req = { body: { age: "00 - 13", userName: "testemail@123.com" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if age is not given format', function () {
            const req = { body: { age: "00 - 11", userName: "abccom" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });
    });

    describe('convertIntoMB', function () {
        test('should give round off fileSize in MB for given size in Byte', function () {
            expect(convertIntoMB(2048000)).toEqual(2);
        });
    });

    describe('validateUserInputAndFile', function () {
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
        })
        test('should call next() once if fileSize is not greater than 8MB', function () {
            const req = { body: { speakerDetails: JSON.stringify({}) }, file:{size:1024000} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)

        });

        test('should call next() once if fileMimeType is not valid', function () {
            const req = { body: { speakerDetails: JSON.stringify({}) }, file:{size:8192000, mimeType:"text/html"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)

        });

        test('should call next() once if gender is not includes in GENDER', function () {
            const speakerDetail = {gender:"NotGender"};
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail )}, file:{size:8192000, mimeType:"audio/wav"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)

        });

        test('should call next() once if mothertongue is not includes in MOTHERTONGUE', function () {
            const speakerDetail = {gender:"NotGender", motherTongue:"notMotherTongue"};
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail )}, file:{size:8192000, mimeType:"audio/wav"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)

        });

        test('should call next() once if userName length is smaller than 12', function () {
            const speakerDetail = {gender:"NotGender", motherTongue:"hindi", userName:"abc"};
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail )}, file:{size:8192000, mimeType:"audio/wav"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)

        });

    });

});