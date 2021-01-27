const showInstructions = ($instructionModal)=>{
    $instructionModal.modal('show');
}

$(document).ready(()=>{
    const $instructionModal = $('#validator-instructions-modal');
    $("#instructions-link").on('click',()=>showInstructions($instructionModal));
    showInstructions($instructionModal)
});

module.exports = {showInstructions}
