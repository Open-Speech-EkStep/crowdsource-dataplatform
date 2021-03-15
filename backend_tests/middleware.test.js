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
            const req = { body: { age: "upto 10", userName: "lessThan12", gender:"female", motherTongue:"Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if userName is more than 12 char and age is given format', function () {
            const req = { body: { age: "upto 10", userName: "moreThan12character", gender:"female", motherTongue:"Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail if userName contain mobile number and age is given format', function () {
            const req = { body: { age: "upto 10", userName: "9411239876", gender:"female", motherTongue:"Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if userName contain email address and age is given format', function () {
            const req = { body: { age: "upto 10", userName: "testemail@123.com", gender:"female", motherTongue:"Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if age is not given format', function () {
            const req = { body: { age: "00 - 11", userName: "abccom", gender:"female", motherTongue:"Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should call res.send() once if gender is not included in GENDER', function () {
            const req = { body: {age: "00 - 11", userName: "abccom", gender:"WrongGender", motherTongue:"Hindi"}};
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if motherTongue is not included in MOTHERTONGUE', function () {
            const req = { body: { gender:"female", motherTongue:"notMotherTongue", userName:"abcdeUsername"} };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
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
            nextSpy = jest.fn();
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

        test('should call next() once if all params in req are valid', function () {
            const speakerDetail = {userName:"abcd"};
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail )}, file:{size:1024000, mimetype:"audio/wav"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should call res.send() once if fileSize is greater than 12MB', function () {
            const speakerDetail = {userName:"abcd"};
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail )}, file:{size:9 * 1024000, mimetype:"audio/wav"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if fileMimeType is not valid', function () {
            const speakerDetail = {userName:"abcd"};
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail )}, file:{size:1024000, mimetype:"text/wav"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });



        test('should call res.send() once if userName length is greater than 12', function () {
            const speakerDetail = {gender:"female", motherTongue:"Hindi", userName:"veryLongUsername"};
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail )}, file:{size:1024000, mimeType:"audio/wav"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if userName is a mobile No', function () {
            const req = { body: { gender:"female", motherTongue:"Hindi", userName:"8989898989"} };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if userName is a email Id', function () {
            const speakerDetail = {gender:"female", motherTongue:"Hindi", userName:"abc@gmail.com"};
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail )}, file:{size:1024000, mimeType:"audio/wav"} };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });
});
