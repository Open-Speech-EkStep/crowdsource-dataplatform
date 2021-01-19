const {
    createColumn,
    createTableWithTwoColumns,
    createTableRows,
    createTableWithOneColumn,
    getOrderedGenderData,
    getFormattedData
} = require('../assets/js/draw-chart');

describe('Test Draw Charts', () => {
    describe('Create Row', () => {
        test('should create row with given data', () => {
            const row = createTableRows([{testKey: "testValue", count: 10}], 'testKey');
            const expectedRow = ['<tr><td>testValue</td><td>10</td></tr>']
            expect(row).toEqual(expectedRow);
        });
    });

    describe('Create Column', () => {
        test('should create column with given data and column size', () => {
            const column = createColumn(['<tr><td>testValue</td><td>10</td></tr>', '<tr><td>testValue2</td><td>5</td></tr>'], "col");
            const expectedColumn = '<div class="col"><table class="table table-sm table-borderless mb-0">' +
                '<tbody><tr><td>testValue</td><td>10</td></tr><tr><td>testValue2</td><td>5</td></tr></tbody>' +
                '</table></div>';
            expect(column).toEqual(expectedColumn);
        });
    });

    describe('Create table with one column', () => {
        test('should create a table with only one column', () => {
            const column = createTableWithOneColumn([{testKey: "testValue", count: 10}, {
                testKey: "testValue2",
                count: 5
            }], "testKey");
            const expectedColumn = '<div class="row"><div class="col">' +
                '<table class="table table-sm table-borderless mb-0"><tbody>' +
                '<tr><td>testValue</td><td>10</td></tr>' +
                '<tr><td>testValue2</td><td>5</td></tr>' +
                '</tbody></table></div></div>';
            expect(column).toEqual(expectedColumn);
        });
    });

    describe('Create table with two columns', () => {
        test('should create a table with two columns', () => {
            const column = createTableWithTwoColumns([{testKey: "testValue", count: 10}, {
                testKey: "testValue2",
                count: 5
            }], "testKey");
            const expectedColumn = '<div class="row"><div class="col-6">' +
                '<table class="table table-sm table-borderless mb-0">' +
                '<tbody><tr><td>testValue</td><td>10</td></tr></tbody></table></div>' +
                '<div class="col-6"><table class="table table-sm table-borderless mb-0">' +
                '<tbody><tr><td>testValue2</td><td>5</td></tr></tbody></table></div></div>';
            expect(column).toEqual(expectedColumn);
        });
    });

    describe('Get ordered gender data', () => {
        test('should order gender data for given data', () => {
            const testData = [{gender: 'Anonymous'},{gender: 'Female'}, {gender: 'Others'}, {gender: 'Male'}];
            const actualData = getOrderedGenderData(testData);
            const expectedData = [{gender: 'Female'}, {gender: 'Male'}, {gender: 'Others'}, {gender: 'Anonymous'}];
            expect(actualData).toEqual(expectedData)
        });
    });

    describe('getFormatedData', () => {
        test('should add key with "Anonymous" value when any element has not key', () => {
            const testData = [{'motherTongue': 'hindi', count: 5},{count: 10}, {'motherTongue': 'oriya', count: 2}];
            const actualData = getFormattedData(testData, 'motherTongue');
            const expectedData = [{'motherTongue': 'hindi', count: 5},{'motherTongue': 'Anonymous', count: 10}, {'motherTongue': 'oriya', count: 2}];
            expect(actualData).toEqual(expectedData)
        });
    });
});
