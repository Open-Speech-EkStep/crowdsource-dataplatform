const {readFileSync} = require("fs");
const {stringToHTML, flushPromises} = require("./utils");
const {addOnClickListener, showAmbientNoise, writeUTFBytes} = require('../src/assets/js/mic-speaker-testing')

document.body = stringToHTML(
  readFileSync(`${__dirname}/../src/views/modals/mic-speaker-testing.ejs`, "UTF-8") +
  readFileSync(`${__dirname}/../src/views/components/mic-speaker-test-btn.ejs`, "UTF-8")
);

describe("$testMicSpeakerBtn", () => {
  test("should display test mic and speaker pop up", () => {
    const $testMicSpeakerBtn = document.getElementById('test-mic-speakers-button');
    const $testMicDiv = $('#test-mic-speakers');
    const $testMicSpeakerDetails = $('#test-mic-speakers-details');
    addOnClickListener();

    $testMicSpeakerBtn.click();

      expect($testMicDiv.hasClass('d-none')).toEqual(true);
      expect($testMicSpeakerDetails.hasClass('d-none')).toEqual(false);
  });
});

describe("showAmbientNoise", () => {
  test("should display backGroundNoise detected when noise is present", () => {

    const $noise = $('#noise');
    const $mic_msg = $('#mic-msg');

    showAmbientNoise({ambient_noise: true});

    expect($noise.hasClass('d-none')).toEqual(false);
    expect($mic_msg.hasClass('d-none')).toEqual(true);
  });

  test("should display low/no background noise when noise is not present", () => {

    const $noNoise = $('#no-noise');
    const $mic_msg = $('#mic-msg');

    showAmbientNoise({ambient_noise: false});

    expect($noNoise.hasClass('d-none')).toEqual(false);
    expect($mic_msg.hasClass('d-none')).toEqual(true);
  });
});

describe("writeUTFBytes", () => {
  test("", () => {
    const views = {
      setUint8: (a, b) => {
      }
    };
    jest.spyOn(views, 'setUint8');
    writeUTFBytes(views, 3, "Hello");

    expect(views.setUint8).toHaveBeenCalledTimes(5);
    expect(views.setUint8).toHaveBeenCalledWith(3, 72);
    expect(views.setUint8).toHaveBeenCalledWith(4, 101);
    expect(views.setUint8).toHaveBeenCalledWith(5, 108);
    expect(views.setUint8).toHaveBeenCalledWith(6, 108);
    expect(views.setUint8).toHaveBeenCalledWith(7, 111);
  })
})




