window.AudioContext = jest.fn().mockImplementation(() => {
  return {
    createMediaElementSource: () => {
      return {
        connect: () => {
        }
      }
    }, createAnalyser: () => {
      return {
        connect: () => {
        }
      }
    }, destination: ""
  }
});

const { readFileSync } = require('fs');
const { stringToHTML } = require('./utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/text/validator-prompt-page.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../build/views/common/headerWithoutNavBar.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../src/views/common/bolo-mic-speaker-testing.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../src/views/common/validation-report-modal.ejs`, 'UTF-8')

);


// const Visualizer = require('../src/assets/js/visualizer');
jest.mock('../src/assets/js/visualizer');

const {
  setAudioPlayer,
} = require('../src/assets/js/validator-prompt-page');



// describe("startVisualizer",()=>{
//   test("should start visualiser",()=>{
//         const mockVisualizerInstance = Visualizer.mock.instances[0];
//         const mockVisualize = mockVisualizerInstance.visualize;
//         const audio = document.getElementById('my-audio');
//         startVisualizer();
//         expect(mockVisualize).toHaveBeenCalledTimes(1);
//     })
// })


describe("setAudioPlayer", () => {
  const play = $('#play');
  const pause = $('#pause');
  const resume = $('#resume');
  const replay = $('#replay');
  const textPlay = $('#audioplayer-text_play');
  const textReplay = $('#audioplayer-text_replay');
  const textPause = $('#audioplayer-text_pause');
  const textResume = $('#audioplayer-text_resume');

  test('should start playing audio when play button is clicked', () => {
    const myAudio = document.getElementById('my-audio');
    myAudio.play = () => {
    };
    myAudio.load = () => {
    };

    setAudioPlayer();
    play.click();

    expect(pause.hasClass("d-none")).toEqual(false);
    expect(play.hasClass("d-none")).toEqual(true);
    expect(resume.hasClass("d-none")).toEqual(true);
    expect(replay.hasClass("d-none")).toEqual(true);

    expect(textPause.hasClass("d-none")).toEqual(false);
    expect(textPlay.hasClass("d-none")).toEqual(true);
    expect(textResume.hasClass("d-none")).toEqual(true);
    expect(textReplay.hasClass("d-none")).toEqual(true);
  });

  test('should pause audio when pause button is clicked', () => {
    const myAudio = document.getElementById('my-audio');
    myAudio.pause = () => {
    };

    setAudioPlayer();
    pause.click();

    expect(resume.hasClass("d-none")).toEqual(false);
    expect(pause.hasClass("d-none")).toEqual(true);
    expect(replay.hasClass("d-none")).toEqual(true);
    expect(play.hasClass("d-none")).toEqual(true);

    expect(textResume.hasClass("d-none")).toEqual(false);
    expect(textPause.hasClass("d-none")).toEqual(true);
    expect(textPlay.hasClass("d-none")).toEqual(true);
    expect(textReplay.hasClass("d-none")).toEqual(true);
  });


  test('should resume audio when resume button is clicked', () => {
    const myAudio = document.getElementById('my-audio');
    myAudio.play = () => {
    };

    setAudioPlayer();
    resume.click();

    expect(resume.hasClass("d-none")).toEqual(true);
    expect(pause.hasClass("d-none")).toEqual(false);
    expect(replay.hasClass("d-none")).toEqual(true);
    expect(play.hasClass("d-none")).toEqual(true);

    expect(textResume.hasClass("d-none")).toEqual(true);
    expect(textPause.hasClass("d-none")).toEqual(false);
    expect(textPlay.hasClass("d-none")).toEqual(true);
    expect(textReplay.hasClass("d-none")).toEqual(true);
  });


  test('should replay audio when replay button is clicked', () => {
    const myAudio = document.getElementById('my-audio');
    myAudio.play = () => {
    };
    myAudio.load = () => {
    };

    setAudioPlayer();
    replay.click();

    expect(resume.hasClass("d-none")).toEqual(true);
    expect(pause.hasClass("d-none")).toEqual(false);
    expect(replay.hasClass("d-none")).toEqual(true);
    expect(play.hasClass("d-none")).toEqual(true);

    expect(textResume.hasClass("d-none")).toEqual(true);
    expect(textPause.hasClass("d-none")).toEqual(false);
    expect(textPlay.hasClass("d-none")).toEqual(true);
    expect(textReplay.hasClass("d-none")).toEqual(true);
  });
});

describe('check if report modal is present or not', () => {
  test("should give true when report modal is present",()=>{
    const reportModal = $('#report_recording_modal');
    if(!reportModal.html()){
      throw Error("NO REPORT MODAL PRESENT");
    }
  })
})


// describe('onReady prompt-page', () => {

// describe('displaySentenceLabel', () => {
//     test('should initially set text of sentence label', () => {
//         setSentenceLabel(0);
//
//         const actualText = document.getElementById('sentenceLabel').innerText;
//         const sentence1 = 'लटक कर पैरों को मुक्त करने की एक नई कसरत बालकों के हाथ लग गई';
//
//         expect(actualText).toBe(sentence1);
//     })
//
// test('should update text of sentence label when skip clicked once', () => {
//     $('#skip_button').click()
//
//     const actualText = document.getElementById('sentenceLabel').innerText
//     const sentence2 = 'जल्द ही पोलैंड में कोर्चार्क के रेडियो प्रोग्राम बहुत';
//
//     expect(actualText).toBe(sentence2);
// })
//
// test('should update text of sentence label when skip clicked N times', () => {
//     const number = 2;
//     for (let i = 0; i < number; ++i)
//         $('#skip_button').click();
//
//     const actualText = document.getElementById('sentenceLabel').innerText
//     const sentence3 = 'उसने कहा क्योंकि उसमें दिल नहीं होगा जो सारे शरीर में खून भेजता';
//
//     expect(actualText).toBe(sentence3);
// })
// })
// });
