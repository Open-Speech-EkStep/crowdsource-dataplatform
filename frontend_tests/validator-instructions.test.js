
const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/validator-instructions.ejs`, 'UTF-8')
);

describe('showInstructions', () => {
    test('should show Instructions pop-up', () => {
        // const $instructionModal = $('#validator-instructions-modal');
        // $instructionModal.modal = (e) => {
        // };
        // jest.spyOn($instructionModal, 'modal');
        // let {showInstructions} = require('../assets/js/validator-instructions');
        // showInstructions = jest.fn();
        // showInstructions();
        //
        // expect($instructionModal.modal).toBeCalledTimes(1);
        // expect($instructionModal.modal).toBeCalledWith('show');
        // jest.clearAllMocks();
    });
});
