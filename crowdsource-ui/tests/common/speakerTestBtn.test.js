const {readFileSync} = require('fs');
const {stringToHTML} = require('../utils');
const {addOnClickListener} = require('../../build/js/common/speakerTestBtn');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/speakerTestBtn.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../build/views/common/speakerTesting.ejs`, 'UTF-8')
);

describe('addOnClickListener',()=>{
  test("should open speaker modal for testing speaker of device",()=>{
    const $testMicDiv = $('#test-mic-speakers');
    const $testMicSpeakerBtn = $('#test-mic-speakers-button');
    const $testMicSpeakerDetails = $('#test-mic-speakers-details');
    addOnClickListener();
    $testMicSpeakerBtn.click();
    expect($testMicDiv.hasClass('d-none')).toEqual(true);
    expect($testMicSpeakerDetails.hasClass('d-none')).toEqual(false);
  })
})
