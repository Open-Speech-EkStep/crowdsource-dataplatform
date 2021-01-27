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
        jest.spyOn($instructionModal, 'modal');

        showInstructions($instructionModal);

        expect($instructionModal.modal).toBeCalledTimes(1);
        expect($instructionModal.modal).toBeCalledWith('show');
        jest.clearAllMocks();
    });
});

// describe('onClick', () => {
//     test('should show Instructions pop-up on click instructions link', () => {
//         const $instructionModal = $('#validator-instructions-modal');
//         $instructionModal.modal = (e)=>{};
//         jest.spyOn($instructionModal, 'modal');
//
//         // document.getElementById('instructions-link').click();
//
//         // expect($instructionModal.modal).toBeCalledTimes(1);
//         // expect($instructionModal.modal).toBeCalledWith('show');
//
//     });
// });

