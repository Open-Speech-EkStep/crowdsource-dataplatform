const { validateUserInputAndFile,
    validateUserInfo,
    convertIntoMB,
    validateUserInputForFeedback,
    validateInputForSkip,
    validateRewardsInput,
    validateRewardsInfoQuery,
    validateContributedMediaInput,
    validateInputsForValidateEndpoint, validateGetContributionsInput } = require('../src/middleware/validateUserInputs')

describe('middleware test', function () {
    const cookie = { 'userId': '123' };
    const params = { 'type': 'text' };
    const validAgeGroup = "upto 10";
    const validUsername = "username";
    const gender = "female";
    const motherTongue = "Hindi";

    const res = {
        status: jest.fn(function () { return res; }),
        send: jest.fn(),
    };
    const nextSpy = jest.fn();

    describe('validateUserInfo', function () {
        const language = 'Hindi';

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() once if userName is less than 12 char and age is given format', function () {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, userName: validUsername, gender: gender, motherTongue: motherTongue, language: language } }
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if userName is more than 12 char and age is given format', function () {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, userName: "moreThan12character", gender: gender, motherTongue: motherTongue, language: language } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail if userName contain mobile number and age is given format', function () {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, userName: "9411239876", gender: gender, motherTongue: motherTongue, language: language } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if userName contain email address and age is given format', function () {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, userName: "testemail@123.com", gender: gender, motherTongue: motherTongue, language: language } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should fail and send bad request if age is not given format', function () {
            const req = { cookies: cookie, params: params, body: { age: "10-13", userName: validUsername, gender: gender, motherTongue: motherTongue, language: language } }
            validateUserInfo(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should call res.send() once if gender is not included in GENDER', function () {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, userName: validUsername, gender: "WrongGender", motherTongue: motherTongue, language: language } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if motherTongue is not included in MOTHERTONGUE', function () {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, gender: gender, motherTongue: "notMotherTongue", userName: "abcdeUsername", language: language } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should pass if type is valid', () => {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, userName: validUsername, gender: gender, motherTongue: motherTongue, language: language } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
        });

        test('should fail if type is invalid', () => {
            const req = { cookies: cookie, params: { 'type': 'test' }, body: { age: validAgeGroup, userName: validUsername, gender: gender, motherTongue: motherTongue, language: language } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('should fail if cookie is not present', () => {
            const req = { cookies: {}, params: params, body: { age: validAgeGroup, userName: validUsername, gender: gender, motherTongue: motherTongue, language: language } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('should fail if language is not present', () => {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, userName: validUsername, gender: gender, motherTongue: motherTongue } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('should fail if userName is falsy', () => {
            const req = { cookies: cookie, params: params, body: { age: validAgeGroup, userName: null, gender: gender, motherTongue: motherTongue, language: language } };
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
        const speakerDetail = { gender: gender, motherTongue: motherTongue, userName: validUsername };

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() once if all params in req are valid', function () {
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 1024000, mimetype: "audio/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should call res.send() once if fileSize is greater than 12MB', function () {
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 9 * 1024000, mimetype: "audio/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if fileMimeType is not valid', function () {
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 1024000, mimetype: "text/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if userName length is greater than 12', function () {
            const speakerDetail = { gender: gender, motherTongue: motherTongue, userName: "veryLongUsername" };
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 1024000, mimeType: "audio/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if userName is a mobile No', function () {
            const req = { cookies: cookie, params: params, body: { gender: gender, motherTongue: motherTongue, userName: "8989898989" } };
            validateUserInfo(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call res.send() once if userName is a email Id', function () {
            const speakerDetail = { gender: gender, motherTongue: motherTongue, userName: "abc@gmail.com" };
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) }, file: { size: 1024000, mimeType: "audio/wav" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call fail if file object not present', function () {
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail) } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should call next() if file object is not present but userInput is present', function () {
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail), userInput: "123456" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should call res.send() if file object is not present but userInput is less than 5', function () {
            const req = { body: { speakerDetails: JSON.stringify(speakerDetail), userInput: "1234" } };
            validateUserInputAndFile(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(0)
            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });

    describe('validateUserInputForFeedback', function () {
        const testFeedback = 'feedback';
        const testSubject = 'subject';
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
            const req = { body: { feedback: testFeedback, subject: testSubject, language: motherTongue } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if feedback is null', function () {
            const req = { body: { feedback: null, subject: testSubject, language: motherTongue } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if feedback is empty', function () {
            const req = { body: { feedback: "", subject: testSubject, language: motherTongue } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if subject is empty', function () {
            const req = { body: { feedback: testFeedback, subject: "", language: motherTongue } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if subject is null', function () {
            const req = { body: { feedback: testFeedback, subject: null, language: motherTongue } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if feedback is greater than 1000 char', function () {
            const req = { body: { feedback: longFeedback, subject: testSubject, language: motherTongue } };
            validateUserInputForFeedback(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });

    describe('Validate User input for skip', () => {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() once if username id and sentenceId are valid', () => {
            const req = { cookies: cookie, body: { sentenceId: 123, userName: validUsername } };
            validateInputForSkip(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if userId is not set', () => {
            const req = { cookies: {}, body: { sentenceId: 123, userName: validUsername } };
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
            const req = { cookies: {}, body: { userName: validUsername } };
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
            const req = { cookies: cookie, query: { language: "some language" } };
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
            const req = { cookies: cookie, query: {} };
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
            const req = { cookies: cookie, query: { language: "some language" } };
            validateRewardsInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if language is undefined', () => {
            const req = { cookies: cookie, query: {} };
            validateRewardsInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });

    describe('Validate Contributed media input', () => {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() if correct inputs are given in params', () => {
            const req = { params: { source: "contribute", entityId: 123 } };
            validateContributedMediaInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should call next() if correct inputs are given in params 2', () => {
            const req = { params: { source: "validate", entityId: 123 } };
            validateContributedMediaInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(0)
            expect(nextSpy).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if entityid is not passed', () => {
            const req = { params: { source: "contribute" } };
            validateContributedMediaInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if nothing is passed', () => {
            const req = {};
            validateContributedMediaInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if source is not valid', () => {
            const req = { params: { source: "contributed", entityId: 123 } };
            validateContributedMediaInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });
    });

    describe('Validate validate endpoint inputs', () => {

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() if correct inputs are given in params', () => {
            const req = { params: { action: "accept", contributionId: 123 }, body: { sentenceId: 456, state: 'TN', country: 'IN' }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if params are not passed', () => {
            const req = { body: { sentenceId: 456, state: 'TN', country: 'IN' }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if body are not passed', () => {
            const req = { params: { action: "accept", contributionId: 123 }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if cookies are not passed', () => {
            const req = { params: { action: "accept", contributionId: 123 }, body: { sentenceId: 456, state: 'TN', country: 'IN' } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should call next() if action is reject', () => {
            const req = { params: { action: "reject", contributionId: 123 }, body: { sentenceId: 456, state: 'TN', country: 'IN' }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(0)
            expect(nextSpy).toHaveBeenCalledTimes(1)
        });

        test('should call next() if action is skip', () => {
            const req = { params: { action: "skip", contributionId: 123 }, body: { sentenceId: 456, state: 'TN', country: 'IN' }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(0)
            expect(nextSpy).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if action is not valid', () => {
            const req = { params: { action: "accepted", contributionId: 123 }, body: { sentenceId: 456, state: 'TN', country: 'IN' }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if action is not sent', () => {
            const req = { params: { contributionId: 123 }, body: { sentenceId: 456, state: 'TN', country: 'IN' }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if contributionId is not sent', () => {
            const req = { params: { action: "skip" }, body: { sentenceId: 456, state: 'TN', country: 'IN' }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if sentenceId is not sent', () => {
            const req = { params: { action: "skip", contributionId: 123 }, body: { state: 'TN', country: 'IN' }, cookies: { userId: 7890 } };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if userId is not sent', () => {
            const req = { params: { action: "skip", contributionId: 123 }, body: { sentenceId: 456, state: 'TN', country: 'IN' }, cookies: {} };
            validateInputsForValidateEndpoint(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

    });

    describe('Validate Get Contributions Input', () => {
        const language = 'Hindi';
        const type = "text";

        afterEach(() => {
            jest.clearAllMocks();
        })

        test('should call next() if correct inputs are given in params', () => {
            const req = { params: { type: type }, query: { from: language }, cookies: { userId: 7890 } };
            validateGetContributionsInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
            expect(res.send).toHaveBeenCalledTimes(0)
        });

        test('should return next() if type is parallel and "to" param is present', () => {
            const req = { params: { type: 'parallel' }, query: { from: language, to: 'English' }, cookies: { userId: 7890 } };
            validateGetContributionsInput(req, res, nextSpy);

            expect(nextSpy).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if params not passed', () => {
            const req = { query: { from: language }, cookies: { userId: 7890 } };
            validateGetContributionsInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if cookies are not passed', () => {
            const req = { params: { type: 'text' }, query: { from: language } };
            validateGetContributionsInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
            expect(nextSpy).toHaveBeenCalledTimes(0)
        });

        test('should return 400 if query not passed', () => {
            const req = { params: { type: 'text' }, cookies: { userId: 7890 } };
            validateGetContributionsInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if type is not sent', () => {
            const req = { params: {}, query: { from: language }, cookies: { userId: 7890 } };
            validateGetContributionsInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if userId is not sent', () => {
            const req = { params: { type: 'text' }, query: { from: language }, cookies: {} };
            validateGetContributionsInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if from language is not sent', () => {
            const req = { params: { type: 'text' }, query: {}, cookies: { userId: 7890 } };
            validateGetContributionsInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });

        test('should return 400 if "type=parallel" and "to" query is undefined', () => {
            const req = { params: { type: 'parallel' }, query: { from: language }, cookies: { userId: 7890 } };
            validateGetContributionsInput(req, res, nextSpy);

            expect(res.send).toHaveBeenCalledTimes(1)
        });
    });
});