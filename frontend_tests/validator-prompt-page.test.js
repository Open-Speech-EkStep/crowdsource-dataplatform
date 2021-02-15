const {showInstructions} = require('../assets/js/validator-instructions');
const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/validator-prompt-page.ejs`, 'UTF-8') + readFileSync(`${__dirname}/../views/common/header.ejs`, 'UTF-8')
);

jest.mock('../assets/js/validator-instructions', () => ({
    showInstructions: jest.fn()
}))

const {
    addListeners,
    decideToShowPopUp,
    setSentenceLabel,
    setAudioPlayer,
} = require('../assets/js/validator-prompt-page');

describe("addListeners",()=>{
    describe('onClick instructions-link', () => {
        test('should show Instructions pop-up', () => {

            require('../assets/js/validator-prompt-page')
            addListeners();
            document.getElementById('instructions-link').click();
            expect($("#validator-page-content").hasClass("d-none")).toEqual(true);

            expect(showInstructions).toHaveBeenCalled();
            jest.clearAllMocks();
        });
    });
})

describe('onReady prompt-page', () => {

    describe('decideToShowPopUp', () => {
        beforeAll(()=>{
            localStorage.clear();
        })

        mockLocalStorage();
        afterEach(() => {
            localStorage.clear();
            jest.clearAllMocks();
        });

        test('should show Instructions pop-up when first validator visit to page and initialize validatorDetails list', () => {
            document.getElementById('nav-username').innerText='testValidator'

            expect(localStorage.getItem('validatorDetails')).toEqual(JSON.stringify( undefined));

            decideToShowPopUp();

            expect(localStorage.getItem('validatorDetails')).toEqual(JSON.stringify( ["testValidator"]));
            expect($("#validator-page-content").hasClass("d-none")).toEqual(true);
            expect(showInstructions).toBeCalledTimes(1);
        });

        test('should show Instructions pop-up when validator visit to page first time and add it to validatorDetails list', () => {
            localStorage.setItem('validatorDetails', JSON.stringify( ["testValidator"]));

            document.getElementById('nav-username').innerText='abc'

            decideToShowPopUp();

            expect(showInstructions).toBeCalledTimes(1);
            expect($("#validator-page-content").hasClass("d-none")).toEqual(true);
            expect(localStorage.getItem('validatorDetails')).toEqual(JSON.stringify( ["testValidator","abc"]));
        });

        test('should not show Instructions pop-up when validator re-visit to page', () => {

            localStorage.setItem('validatorDetails', JSON.stringify( ["xyz"]));
            document.getElementById('nav-username').innerText='xyz'

            decideToShowPopUp();
            expect(showInstructions).not.toBeCalled();
        });


    });

    // describe("setAudioPlayer", () => {
    //     test('should start playing audio when play button is clicked', () => {
    //         const myAudio = document.getElementById('my-audio');
    //         myAudio.play = () => {
    //         };
    //         myAudio.load = () => {
    //         };
    //         const play = $('#play');
    //         const pause = $('#pause');
    //
    //         setAudioPlayer();
    //         play.click();
    //
    //         expect(play.hasClass("d-none")).toEqual(true);
    //         expect(pause.hasClass("d-none")).toEqual(false);
    //     });
    //
    //     test('should pause audio when pause button is clicked', () => {
    //         const myAudio = document.getElementById('my-audio');
    //         myAudio.pause = () => {
    //         };
    //         const pause = $('#pause');
    //         const replay = $('#replay');
    //
    //         setAudioPlayer();
    //         pause.click();
    //
    //         expect(pause.hasClass("d-none")).toEqual(true);
    //         expect(replay.hasClass("d-none")).toEqual(false);
    //     });
    //
    //     test('should replay audio when replay button is clicked', () => {
    //         const myAudio = document.getElementById('my-audio');
    //         myAudio.play = () => {
    //         };
    //         myAudio.load = () => {
    //         };
    //         const pause = $('#pause');
    //         const replay = $('#replay');
    //
    //         setAudioPlayer();
    //         replay.click();
    //
    //         expect(replay.hasClass("d-none")).toEqual(true);
    //         expect(pause.hasClass("d-none")).toEqual(false);
    //     });
    // });

    describe('displaySentenceLabel', () => {
        test('should initially set text of sentence label', () => {
            setSentenceLabel(0);

            const actualText = document.getElementById('sentenceLabel').innerText;
            const sentence1 = 'लटक कर पैरों को मुक्त करने की एक नई कसरत बालकों के हाथ लग गई';

            expect(actualText).toBe(sentence1);
        })

        test('should update text of sentence label when skip clicked once', () => {
            $('#skip_button').click()

            const actualText = document.getElementById('sentenceLabel').innerText
            const sentence2 = 'जल्द ही पोलैंड में कोर्चार्क के रेडियो प्रोग्राम बहुत';

            expect(actualText).toBe(sentence2);
        })

        test('should update text of sentence label when skip clicked N times', () => {
            const number = 2;
            for (let i = 0; i < number; ++i)
                $('#skip_button').click();

            const actualText = document.getElementById('sentenceLabel').innerText
            const sentence3 = 'उसने कहा क्योंकि उसमें दिल नहीं होगा जो सारे शरीर में खून भेजता';

            expect(actualText).toBe(sentence3);
        })
    })
});
