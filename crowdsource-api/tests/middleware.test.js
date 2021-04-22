const { validateUserInputAndFile, validateUserInfo, convertIntoMB, validateUserInputForFeedback, validateInputForSkip, validateRewardsInput, validateRewardsInfoQuery } = require('../src/middleware/validateUserInputs')

describe('middleware test', function () {
    const cookie = { 'userId': '123' };
    const res = {
        status: jest.fn(function () { return res; }),
        send: jest.fn(),
    };;
    const nextSpy = jest.fn();

    describe('validateUserInfo', function () {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() once if userName is less than 12 char and age is given format', function () {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { age: "upto 10", userName: "lessThan12", gender: "female", motherTongue: "Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if userName is more than 12 char and age is given format', function () {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { age: "upto 10", userName: "moreThan12character", gender: "female", motherTongue: "Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail if userName contain mobile number and age is given format', function () {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { age: "upto 10", userName: "9411239876", gender: "female", motherTongue: "Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if userName contain email address and age is given format', function () {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { age: "upto 10", userName: "testemail@123.com", gender: "female", motherTongue: "Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if age is not given format', function () {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { age: "10-13", userName: "abccom", gender: "female", motherTongue: "Hindi" } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should call res.send() once if gender is not included in GENDER', function () {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { age: "upto 10", userName: "abccom", gender: "WrongGender", motherTongue: "Hindi" } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if motherTongue is not included in MOTHERTONGUE', function () {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { gender: "female", motherTongue: "notMotherTongue", userName: "abcdeUsername" } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should pass if type is valid', () => {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { age: "upto 10", userName: "abccom", gender: "female", motherTongue: "Hindi" } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
        });

        test('should fail if type is invalid', () => {
            const req = { cookies: cookie, params: { 'type': 'test' }, body: { age: "upto 10", userName: "abccom", gender: "female", motherTongue: "Hindi" } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('should fail if cookie is not present', () => {
            const req = { cookies: {}, params: { 'type': 'ocr' }, body: { age: "upto 10", userName: "abccom", gender: "female", motherTongue: "Hindi" } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('should fail if userName is falsy', () => {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { age: "upto 10", userName: null, gender: "female", motherTongue: "Hindi" } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
    });

    describe('convertIntoMB', function () {
        test('should give round off fileSize in MB for given size in Byte', function () {
            expect(convertIntoMB(2048000)).toEqual(2);
        });
    });

    describe('validateUserInputAndFile', function () {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() once if all params in req are valid', function () {
            const speakerDetail = { userName: "abcd" };
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 1024000, mimetype: "audio/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should call res.send() once if fileSize is greater than 12MB', function () {
            const speakerDetail = { userName: "abcd" };
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 9 * 1024000, mimetype: "audio/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if fileMimeType is not valid', function () {
            const speakerDetail = { userName: "abcd" };
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 1024000, mimetype: "text/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if userName length is greater than 12', function () {
            const speakerDetail = { gender: "female", motherTongue: "Hindi", userName: "veryLongUsername" };
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 1024000, mimeType: "audio/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if userName is a mobile No', function () {
            const req = { cookies: cookie, params: { 'type': 'ocr' }, body: { gender: "female", motherTongue: "Hindi", userName: "8989898989" } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if userName is a email Id', function () {
            const speakerDetail = { gender: "female", motherTongue: "Hindi", userName: "abc@gmail.com" };
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 1024000, mimeType: "audio/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });

    describe('validateUserInputForFeedback', function () {
        const longFeedback = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquam ultrices laoreet. Morbi at dui libero. Ut sodales maximus ante vitae tempus. Curabitur 
        scelerisque odio ut suscipit mattis. Vestibulum ultricies, libero laoreet scelerisque efficitur, diam justo posuere eros, in blandit mauris elit in massa. 
        Proin sed pharetra justo, a consequat lacus. Fusce gravida ornare nibh, vel accumsan metus pharetra a. Sed dignissim semper aliquet. Donec non leo posuere, euismod massa eu, 
        dapibus odio. Ut vitae fermentum diam.  
        Etiam nec aliquet ex, id molestie nisl. Mauris erat est, ornare at tristique sodales, mollis vitae quam. Donec aliquet dui ligula, pharetra finibus felis sagittis et.
         Aliquam tempor auctor felis quis dapibus. Donec at lacus ullamcorper, tincidunt nibh non, commodo elit. Ut cursus lorem at nibh hendrerit bibendum. Nam feugiat mauris at 
         eros varius auctor. Vivamus blandit turpis et dignissim tincidunt. Morbi bibendum dignissim sapien, sit amet blandit massa rhoncus a quam   .
        `

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() once if all params in req are valid', function () {
            const req = { body: { feedback: "Dummy feedback", subject: "some subject", language: "Hindi" } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if feedback is null', function () {
            const req = { body: { feedback: "", subject: "", language: "Hindi" } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if subject is empty', function () {
            const req = { body: { feedback: "some           ", subject: "", language: "Hindi" } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if feedback is greater than 1000 char', function () {
            const req = { body: { feedback: longFeedback, subject: "some subject", language: "Hindi" } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });

    describe('Validate User input for skip', () => {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() once if username id and sentenceId are valid', () => {
            const req = { cookies: { userId: 456 }, body: { sentenceId: 123, userName: "test_user" } };
            validateInputForSkip(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if userId is not set', () => {
            const req = { cookies: {}, body: { sentenceId: 123, userName: "test_user" } };
            validateInputForSkip(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if username is undefined', () => {
            const req = { cookies: {}, body: { sentenceId: 123 } };
            validateInputForSkip(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if sentenceId is falsy', () => {
            const req = { cookies: {}, body: { userName: "test_user" } };
            validateInputForSkip(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });

    describe('Validate Rewards input', () => {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() if language is inputs are valid', () => {
            const req = { cookies: { userId: 456 }, query: { language: "some language" } };
            validateRewardsInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if userId is not set', () => {
            const req = { cookies: {}, query: { language: "abcd" } };
            validateRewardsInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if language is undefined', () => {
            const req = { cookies: { userId: 456 }, query: {} };
            validateRewardsInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });

    describe('Validate Rewards info input', () => {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() if language is given in query', () => {
            const req = { cookies: { userId: 456 }, query: { language: "some language" } };
            validateRewardsInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if language is undefined', () => {
            const req = { cookies: { userId: 456 }, query: {} };
            validateRewardsInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });
});