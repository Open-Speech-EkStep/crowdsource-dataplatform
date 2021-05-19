const $reportModal = $("#report_sentence_modal");

$("#report_btn").on("click", function () {
  $reportModal && $reportModal.modal("show");
});
