const fetchMock = require('fetch-mock')
const {
    updateLanguageInButton,
    updateLanguage,
    calculateTime,
    fetchDetail,
} = require('../assets/js/home');
const {readFileSync} = require('fs');
const {stringToHTML, flushPromises} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/home.ejs`, 'UTF-8')
);
describe('updateLanguageInButton', () => {
    test('should update innerText of start record btn for given language', () => {
        updateLanguageInButton('hindi');
        expect(document.getElementById('start-record').innerText).toEqual(
            'START RECORDING IN HINDI'
        );
    });
});

describe('updateLanguage', () => {
    test('should update speakers count and num of hours recorded on home page', (done) => {
        const language = 'Hindi';
        fetchMock.get(`getDetails/${language}`, [
            {count: 7, index: 0},
            {count: 5, index: 1},
        ], {overwriteRoutes: true});

        const speakerValue = document.getElementById('speaker-value');

        updateLanguage(language);
        flushPromises().then(() => {
            expect(speakerValue.innerHTML).toEqual('7');
            fetchMock.reset();
            done();
        });
    });
});

describe('fetchDetails', () => {
    test('should give details for given language if server responds ok', () => {
        const language = 'Hindi';
        fetchMock.get(`getDetails/${language}`, {count: 5});
        fetchDetail(`getDetails/${language}`).then((data) => {
            expect(data).toEqual({count: 5});
            fetchMock.reset();
        });
    });


    test('should give details for all language if server responds ok', () => {
        fetchMock.get(`/aggregate-data-count?byLanguage=${true}`, [{language:"Hindi",count: 5}]);
        fetchDetail(`/aggregate-data-count?byLanguage=${true}`).then((data) => {
            expect(data).toEqual([{language:"Hindi",count: 5}]);
            fetchMock.reset();
        });
    });

    test('should give list for top-5 languages based on no. of contributions if server responds ok', () => {
        const response = [{language:"Hindi",contributions: 5},{language:"Odia",contributions:4}];
        fetchMock.get('/top-languages-by-hours', response);
        fetchDetail('/top-languages-by-hours').then((data) => {
            expect(data).toEqual(response);
            fetchMock.reset();
        });
    });
});

describe('calculateTime', () => {
    test('should calculate time in hours,min and sec for given sentence count', () => {
        expect(calculateTime(27)).toEqual({hours: 0, minutes: 2, seconds: 42});
    });
});
