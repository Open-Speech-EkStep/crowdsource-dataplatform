const addOnClickListener = function () {
  const $testMicDiv = $('#test-mic-speakers');
  const $testMicSpeakerBtn = $('#test-mic-speakers-button');
  const $testMicSpeakerDetails = $('#test-mic-speakers-details');

  $testMicSpeakerBtn.on('click', () => {
    $testMicDiv.addClass('d-none');
    $testMicSpeakerDetails.removeClass('d-none');
  });
}

addOnClickListener();