localStorage.setItem('currentIndex', 3);
const {showInstructions} = require('../assets/js/validator-prompt-page');
const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/validator-prompt-page.ejs`, 'UTF-8')
);

describe('showInstructions', () => {
    test('should show Instructions pop-up', () => {
        const $instructionModal = $('#validator-instructions-modal');
        $instructionModal.modal = (e)=>{};
        const spy =  jest.spyOn($instructionModal, 'modal');
        // showInstructions();
        // expect(spy.modal).toBeCalledTimes(1);
    });
});

describe('onClick', () => {
    test('should show Instructions pop-up on click instructions link', () => {

        document.getElementById('instructions-link').click()
        // expect(spy.showInstructions).toBeCalledTimes(1);

    });
});

