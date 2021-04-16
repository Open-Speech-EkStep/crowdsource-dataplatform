const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');
const {showInstructions} = require('../src/assets/js/validator-instructions')

document.body = stringToHTML(
    readFileSync(`${__dirname}/../src/views/modals/validator-instructions.ejs`, 'UTF-8')
);

describe('showInstructions', () => {
    test('should show Instructions pop-up and hide background content', () => {
        const $instructionModal = $('#validator-instructions-modal');
        $instructionModal.modal = (e) => {};
        jest.spyOn($instructionModal, 'modal');

        showInstructions($instructionModal);

        expect($instructionModal.modal).toHaveBeenCalledTimes(1);
        expect($instructionModal.modal).toHaveBeenCalledWith('show');
        jest.clearAllMocks();

    });

});
