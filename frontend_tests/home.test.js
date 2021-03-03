const fetchMock = require('fetch-mock')
const {
    //updateLanguageInButton,
    //updateLanguage,
    calculateTime,
    getStatistics,
    performAPIRequest,
    //fetchDetail,
} = require('../assets/js/home');
const {readFileSync} = require('fs');
const {stringToHTML, flushPromises} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/home.ejs`, 'UTF-8')
);
//describe('updateLanguageInButton', () => {
//     test('should update innerText of start record btn for given language', () => {
//         updateLanguageInButton('hindi');
//         expect(document.getElementById('start-record').innerText).toEqual(
//             'START RECORDING IN HINDI'
//         );
//     });
// });

describe('getStatistics', () => {
    test('should get speakers count and num of hours recorded on home page', (done) => {
        fetchMock.get('/aggregate-data-count', {"data":[{"total_languages":"2","total_speakers":"80","total_contributions":"0.348","total_validations":"0.175"}]}, {overwriteRoutes: true});

        const speakerValue = document.getElementById('speaker-value');
        const languagesValue = document.getElementById('languages-value');

        getStatistics();
        flushPromises().then(() => {
            expect(speakerValue.innerHTML).toEqual('80');
            expect(languagesValue.innerHTML).toEqual('2');
            fetchMock.reset();
            done();
        });
    });
});

describe('performAPIRequest', () => {
    test('should give details for given language if server responds ok', () => {
        fetchMock.get('/aggregate-data-count', {"data":[{"total_languages":"2","total_speakers":"80","total_contributions":"0.348","total_validations":"0.175"}]});
        performAPIRequest('/aggregate-data-count').then((data) => {
            expect(data).toEqual({"data":[{"total_languages":"2","total_speakers":"80","total_contributions":"0.348","total_validations":"0.175"}]});
            fetchMock.reset();
        });
    });


    test('should give details for all language if server responds ok', () => {
        fetchMock.get(`/aggregate-data-count?byLanguage=${true}`, [{language:"Hindi",count: 5}]);
        performAPIRequest(`/aggregate-data-count?byLanguage=${true}`).then((data) => {
            expect(data).toEqual([{language:"Hindi",count: 5}]);
            fetchMock.reset();
        });
    });

    test('should give list for top-5 languages based on no. of contributions if server responds ok', () => {
        const response = [{language:"Hindi",contributions: 5},{language:"Odia",contributions:4}];
        fetchMock.get('/top-languages-by-hours', response);
        performAPIRequest('/top-languages-by-hours').then((data) => {
            expect(data).toEqual(response);
            fetchMock.reset();
        });
    });
});

describe('calculateTime', () => {
    test('should calculate time in hours,min and sec for given sentence count', () => {
        expect(calculateTime(162)).toEqual({hours: 0, minutes: 2, seconds: 42});
    });
});
