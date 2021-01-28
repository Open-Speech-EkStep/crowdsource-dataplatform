const {showInstructions} = require('../assets/js/validator-instructions');
const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');

jest.mock('../assets/js/validator-instructions', ()=>({
    showInstructions: jest.fn()
}))

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/validator-prompt-page.ejs`, 'UTF-8')
);

describe('onClick instructions-link', () => {
    test('should show Instructions pop-up when link is clicked', () => {

        require('../assets/js/validator-prompt-page')
        document.getElementById('instructions-link').click();

        expect(showInstructions).toHaveBeenCalled();
        jest.clearAllMocks();
    });
});

describe('onReady prompt-page', () => {
    const {decideToShowPopUp} = require('../assets/js/validator-prompt-page')

    test('should show Instructions pop-up when validator visit to page first time', () => {
        mockLocalStorage();
        localStorage.setItem('validatorDetails', JSON.stringify({}));
        localStorage.setItem('currentValidator', "abc");

        decideToShowPopUp();
        expect(showInstructions).toBeCalledTimes(1);
        jest.clearAllMocks();
    });

    test('should not show Instructions pop-up when validator re-visit to page', () => {
        mockLocalStorage();
        localStorage.setItem('validatorDetails', JSON.stringify({xyz:"xyz"}));
        localStorage.setItem('currentValidator', "xyz");

        decideToShowPopUp();
        expect(showInstructions).not.toBeCalled();
        jest.clearAllMocks();
    });
});
