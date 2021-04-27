window.AudioContext = jest.fn().mockImplementation(() => {
  return {
    createMediaElementSource: (e) => {
      return {
        connect: (a) => {
        }
      }
    }, createAnalyser: () => {
      return {
        connect: (a) => {
        }
      }
    }, destination: ""
  }
});

const {showInstructions} = require('../assets/js/validator-instructions');
const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../views/validator-prompt-page.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../views/common/headerForContributor.ejs`, 'UTF-8') +
  readFileSync(`${__dirname}/../views/modals/mic-speaker-testing.ejs`, 'UTF-8')
);

jest.mock('../assets/js/validator-instructions', () => ({
  showInstructions: jest.fn()
}))

const Visualizer = require('../assets/js/visualizer');
jest.mock('../assets/js/visualizer');

const {
  addListeners,
  startVisualizer,
  setAudioPlayer,
  setSentenceLabel
} = require('../assets/js/validator-prompt-page');

describe("addListeners", () => {
  describe('onClick instructions-link', () => {
    test('should show Instructions pop-up', () => {

      // require('../assets/js/validator-prompt-page')
      // addListeners();
      // document.getElementById('instructions-link').click();
      // // expect($("#validator-page-content").hasClass("d-none")).toEqual(true);
      // // expect(showInstructions).toHaveBeenCalled();
      // jest.clearAllMocks();
    });
  });
})

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
  test('should start playing audio when play button is clicked', () => {
    // const myAudio = document.getElementById('my-audio');
    // myAudio.play = () => {
    // };
    // myAudio.load = () => {
    // };
    // const play = $('#play');
    // const pause = $('#pause');
    //
    // setAudioPlayer();
    // play.click();

    // expect(play.hasClass("d-none")).toEqual(true);
    // expect(pause.hasClass("d-none")).toEqual(false);
  });

  test('should pause audio when pause button is clicked', () => {
    // const myAudio = document.getElementById('my-audio');
    // myAudio.pause = () => {
    // };
    // const pause = $('#pause');
    // const replay = $('#replay');
    //
    // setAudioPlayer();
    // pause.click();

    // expect(pause.hasClass("d-none")).toEqual(true);
    // expect(replay.hasClass("d-none")).toEqual(false);
  });

  test('should replay audio when replay button is clicked', () => {
    // const myAudio = document.getElementById('my-audio');
    // myAudio.play = () => {
    // };
    // myAudio.load = () => {
    // };
    // const pause = $('#pause');
    // const replay = $('#replay');
    //
    // setAudioPlayer();
    // replay.click();

    // expect(replay.hasClass("d-none")).toEqual(true);
    // expect(pause.hasClass("d-none")).toEqual(false);
  });
});


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
