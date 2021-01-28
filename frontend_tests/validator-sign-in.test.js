const {validateText, landOnValidatingPromptPage} = require('../assets/js/validator-sign-in');
const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/validator-prompt-page.ejs`, 'UTF-8')
);

describe('validateText', () => {
    test("should disabled let's go btn when validator-username is absent", () => {
        const username = $("#validator-username");
        username.value = "";
        const signInBtn = $("#validator-SignIn");
        jest.spyOn(signInBtn, 'attr');

        validateText(username, signInBtn);

        expect(signInBtn.attr).toBeCalledTimes(1);
        expect(signInBtn.attr).toBeCalledWith('disabled', 'disabled');
        jest.clearAllMocks();
    });

    test("should enable let's go btn when validator-username is present", () => {
        const username = $("#validator-username");
        username.value = "priyanshu";
        const signInBtn = $("#validator-SignIn");
        jest.spyOn(signInBtn, 'removeAttr');

        validateText(username, signInBtn);

        expect(signInBtn.removeAttr).toBeCalledTimes(1);
        expect(signInBtn.removeAttr).toBeCalledWith('disabled');
        jest.clearAllMocks();
    });
});

