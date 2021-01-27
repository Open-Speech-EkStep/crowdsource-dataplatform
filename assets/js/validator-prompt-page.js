const showInstructions = ()=>{
    const $instructionModal = $('#validator-instructions-modal');
    $instructionModal.modal('show');
}

$(document).ready(()=>{
    $("#instructions").on('click',showInstructions);
    showInstructions()
});

module.exports = {showInstructions}

