const { toggleFooterPosition, setPageContentHeight, updateLocaleLanguagesDropdown } = require("./utils");
const fetch = require('./fetch')
function handleGoBack() {
  window.history.back();
}

function handleFeedbackSubmit() {
  const $feedbackFailureMsg = $("#feedback_failure_msg");
  const data = {
    feedback: $("#feedback_description").val(),
    subject: $("#feedback_subject").val(),
    language: localStorage.getItem("contributionLanguage"),
  };
  fetch("/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.statusCode === 200) {
        $feedbackFailureMsg.addClass("d-none");
        const $feedbackForm = $("#feedback_form");
        $feedbackForm.hide();
        const $feedbackThankYouScreen = $("#feedback_thank_you_screen");
        $feedbackThankYouScreen.removeClass("d-none");
      } else {
        $feedbackFailureMsg.removeClass("d-none");
      }
    });
}

const enableSubmit = function () {
  const $description = $("#feedback_description").val();
  const $subject = $("#feedback_subject").val();
  const $submitBtn = $("#submit_btn");
  if (
    $subject &&
    $subject.trim().length > 0 &&
    $description &&
    $description.trim().length > 0
  ) {
    $submitBtn.attr("disabled", false);
  } else {
    $submitBtn.attr("disabled", true);
  }
};

$(document).ready(function () {
  toggleFooterPosition();
  setPageContentHeight();
  const contributionLanguage = localStorage.getItem('contributionLanguage');
    if(contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }
  const text_max = 1000;
  $("#count_message").html("0 / " + text_max);
  $("#feedback_description").on("keyup", function () {
    let text_length = $("#feedback_description").val().length;
    $("#count_message").html(text_length + " / " + text_max);
    enableSubmit();
  });

  $("#submit_btn").on("click", handleFeedbackSubmit);
  $("#back_btn").on("click", handleGoBack);

  $("#feedback_subject").on("keyup", function () {
    enableSubmit();
  });

  const $submitBtn = $("#submit_btn");
  $submitBtn.attr("disabled", true);
});
