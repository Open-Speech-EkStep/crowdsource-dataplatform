const showInstructions = ($instructionModal = $('#validator-instructions-modal') )=>{
    $("#validator-page-content").addClass("d-none");
    $instructionModal.modal('show');
}

$('#validator-instructions-modal').on('hidden.bs.modal', function () {
    $("#validator-page-content").removeClass('d-none');
});

module.exports = {showInstructions}
