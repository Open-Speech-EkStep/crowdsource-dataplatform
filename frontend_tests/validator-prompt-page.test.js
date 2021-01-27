const {showInstructions} = require('../assets/js/validator-instructions');
const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');

jest.mock('../assets/js/validator-instructions', ()=>({
    showInstructions: jest.fn()
}))

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/validator-prompt-page.ejs`, 'UTF-8')
);

describe('showInstructions', () => {
    // test('should show Instructions pop-up', () => {
    //     const $instructionModal = $('#validator-instructions-modal');
    //     $instructionModal.modal = (e)=>{};
    //     jest.spyOn($instructionModal, 'modal');
    //
    //     showInstructions($instructionModal);
    //
    //     expect($instructionModal.modal).toBeCalledTimes(1);
    //     expect($instructionModal.modal).toBeCalledWith('show');
    //     jest.clearAllMocks();
    // });

    test('should show Instructions pop-up when link is clicked', () => {
        require('../assets/js/validator-prompt-page')
        document.getElementById('instructions-link').click()
        expect(showInstructions).toHaveBeenCalled()
    });
});
