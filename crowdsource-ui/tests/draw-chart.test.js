const {
    getOrderedGenderData
} = require('../src/assets/js/draw-chart');

describe('Test Draw Charts', () => {

    describe('getOrderedGenderData', () => {
        test('should order gender data for given data', () => {
            const testData = [{gender: 'Not Specified'},{gender: 'Female'}, {gender: 'Others'}, {gender: 'Male'}];
            const actualData = getOrderedGenderData(testData);
            const expectedData = [{gender: 'Female'}, {gender: 'Male'}, {gender: 'Others'}, {gender: 'Not Specified'}];
            expect(actualData).toEqual(expectedData)
        });

        test('should order gender data for given data with duplicate entries', () => {
            const testData = [{gender: 'Not Specified',count:3},{gender: 'Female',count:4}, {gender: 'Others',count:1}, {gender: 'Male',count:2}, {gender: 'female', count:3}];
            const actualData = getOrderedGenderData(testData);
            const expectedData = [{gender: 'Female',count:7}, {gender: 'Male',count:2}, {gender: 'Others',count:1}, {gender: 'Not Specified',count:3}];
            expect(actualData).toEqual(expectedData)
        });
    });
});
