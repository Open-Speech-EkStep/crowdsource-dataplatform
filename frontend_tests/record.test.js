const {getSkipCount, getCurrentIndex,getValue, setTotalSentenceIndex, setCurrentSentenceIndex} = require('../assets/js/record')
const {mockLocalStorage} = require('./utils');

const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/record.ejs`, 'UTF-8')
);

describe('Record test', () => {
    describe('Get Value', () => {
        test('should return number when it is b/w 0 and max value', () => {
            expect(getValue(5,10)).toBe(5);
        });
        test('should return zero when it is <= 0', () => {
            expect(getValue(-2,10)).toBe(0);
        });
        test('should return max value when number is > max value', () => {
            expect(getValue(13,10)).toBe(10);
        });
    });

    describe('Get  Current Index', () => {
        test('should return current index when it is b/w 0 and last index', () => {
            mockLocalStorage()
            localStorage.setItem('currentIndex','5');
            expect(getCurrentIndex(10)).toBe(5);
        });
    });

    describe('Get Skip Count', () => {
        test('should return skip count when it is b/w 0 and last index', () => {
            mockLocalStorage()
            localStorage.setItem('skipCount','5');
            expect(getSkipCount(10)).toBe(5);
        });
    });

    describe('Set Current Index', () => {
        test('should set current index', () => {
            setCurrentSentenceIndex(3)
            expect(document.getElementById('currentSentenceLbl').innerText).toEqual(
                3
            );
        });
    });

    describe('Set Total Sentence Index', () => {
        test('should set total sentence index', () => {
            setTotalSentenceIndex(3)
            expect(document.getElementById('totalSentencesLbl').innerText).toEqual(
                3
            );
        });
    });
});
