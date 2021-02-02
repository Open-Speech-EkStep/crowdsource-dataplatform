const {showInstructions} = require('../assets/js/validator-instructions');
const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/validator-prompt-page.ejs`, 'UTF-8')
);


jest.mock('../assets/js/validator-instructions', () => ({
    showInstructions: jest.fn()
}))


const {decideToShowPopUp, setSentenceLabel, setAudioPlayer} = require('../assets/js/validator-prompt-page');

describe('onClick instructions-link', () => {
    test('should show Instructions pop-up when link is clicked', () => {

        require('../assets/js/validator-prompt-page')
        document.getElementById('instructions-link').click();

        expect(showInstructions).toHaveBeenCalled();
        jest.clearAllMocks();
    });
});

describe('onReady prompt-page', () => {

    describe('decideToShowPopUp', () => {
        mockLocalStorage();
        afterEach(() => {
            localStorage.clear();
            jest.clearAllMocks();
        });

        test('should show Instructions pop-up when validator visit to page first time', () => {

            localStorage.setItem('validatorDetails', JSON.stringify({}));
            localStorage.setItem('currentValidator', "abc");

            decideToShowPopUp();
            expect(showInstructions).toBeCalledTimes(1);
        });

        test('should not show Instructions pop-up when validator re-visit to page', () => {

            localStorage.setItem('validatorDetails', JSON.stringify({xyz: "xyz"}));
            localStorage.setItem('currentValidator', "xyz");

            decideToShowPopUp();
            expect(showInstructions).not.toBeCalled();
        });

        test('should show Instructions pop-up when validator visit to page first time and set validatorDetails if its null', () => {
            localStorage.setItem('currentValidator', "priyanshu");

            decideToShowPopUp();
            expect(localStorage.getItem('validatorDetails')).toEqual(JSON.stringify({priyanshu: "priyanshu"}));

            expect(showInstructions).toBeCalledTimes(1);
        });
    });

    describe("setAudioPlayer",()=>{
        test('should start playing audio when play button is clicked', () => {
            const myAudio = document.getElementById('my-audio');
            myAudio.play = ()=>{};
            const play = $('#play');
            const pause = $('#pause');

            setAudioPlayer();
            play.click();

            expect(play.hasClass("d-none")).toEqual(true);
            expect(pause.hasClass("d-none")).toEqual(false);
        });

        test('should pause audio when pause button is clicked', () => {
            const myAudio = document.getElementById('my-audio');
            myAudio.pause = ()=>{};
            const pause = $('#pause');
            const replay = $('#replay');

            setAudioPlayer();
            pause.click();

            expect(pause.hasClass("d-none")).toEqual(true);
            expect(replay.hasClass("d-none")).toEqual(false);
        });

        test('should replay audio when replay button is clicked', () => {
            const myAudio = document.getElementById('my-audio');
            myAudio.play = ()=>{};
            myAudio.load = ()=>{};
            const pause = $('#pause');
            const replay = $('#replay');

            setAudioPlayer();
            replay.click();

            expect(replay.hasClass("d-none")).toEqual(true);
            expect(pause.hasClass("d-none")).toEqual(false);
        });

    })

    describe('displaySentenceLabel', () => {
        test('should initially set text of sentence label', () => {
            setSentenceLabel(0);

            const actualText = document.getElementById('sentenceLabel').innerText

            expect(actualText).toBe('Sentence 1')
        })

        test('should update text of sentence label when skip clicked once', () => {
            $('#skip_button').click()

            const actualText = document.getElementById('sentenceLabel').innerText

            expect(actualText).toBe('Sentence 2')
        })

        test('should update text of sentence label when skip clicked N times', () => {
            const number = 2;
            for (let i = 0; i < number; ++i)
                $('#skip_button').click();

            const actualText = document.getElementById('sentenceLabel').innerText

            expect(actualText).toBe('Sentence 3')
        })
    })

});

