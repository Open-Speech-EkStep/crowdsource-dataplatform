const showInstructions = ()=>{
    const $instructionModal = $('#validator-instructions-modal');
    $instructionModal.modal('show');
}

$(document).ready(showInstructions);

module.exports = {showInstructions}

