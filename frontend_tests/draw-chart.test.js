const {
    Table,
    getOrderedGenderData,
    getFormattedData
} = require('../assets/js/draw-chart');

describe('Test Draw Charts', () => {
    describe('Create Row', () => {
        test('should create row with given data', () => {
            const row = new Table().createTableRows([{testKey: "testValue", count: 10}], 'testKey');
            const expectedRow = ['<tr><td>testValue</td><td>10</td></tr>']
            expect(row).toEqual(expectedRow);
        });
    });

    describe('Create Column', () => {
        test('should create column with given data and column size', () => {
            const column = new Table().createColumn(['<tr><td>testValue</td><td>10</td></tr>', '<tr><td>testValue2</td><td>5</td></tr>'], "col");
            const expectedColumn = '<div class="col"><table class="table table-sm table-borderless mb-0">' +
                '<tbody><tr><td>testValue</td><td>10</td></tr><tr><td>testValue2</td><td>5</td></tr></tbody>' +
                '</table></div>';
            expect(column).toEqual(expectedColumn);
        });
    });

    describe('Create table with one column', () => {
        test('should create a table with only one column', () => {
            const table = new Table()
            jest.spyOn(table,'createTableRows').mockImplementation();
            jest.spyOn(table,'createColumn').mockImplementation();
            table.createColumn.mockReturnValue('testColumnData')
            table.createTableRows.mockReturnValue('testRowData')
            const column = table.createTableWithOneColumn('testTableData', "testKey");
            const expectedColumn = '<div class="row">testColumnData</div>';

            expect(table.createTableRows).toHaveBeenCalledTimes(1)
            expect(table.createColumn).toHaveBeenCalledTimes(1)
            expect(table.createColumn).toBeCalledWith('testRowData','col')
            expect(column).toEqual(expectedColumn);
        });
    });

    describe('Create table with two columns', () => {
        test('should create a table with two columns', () => {
            const table = new Table()
            jest.spyOn(table,'createTableRows').mockImplementation();
            jest.spyOn(table,'createColumn').mockImplementation();
            table.createTableRows.mockReturnValueOnce('testRowData1').mockReturnValueOnce('testRowData2')
            table.createColumn.mockReturnValue('testColumnData')
            const column = table.createTableWithTwoColumns(['testTableData1','testTableData2'], "testKey");
            const expectedColumn = '<div class="row">testColumnDatatestColumnData</div>';

            expect(column).toEqual(expectedColumn);
            expect(table.createColumn).toHaveBeenCalledTimes(2)
            expect(table.createTableRows).toHaveBeenCalledTimes(2)
            expect(table.createTableRows).toBeCalledWith(['testTableData1'],'testKey')
            expect(table.createTableRows).toBeCalledWith(['testTableData2'],'testKey')
            expect(table.createColumn).toBeCalledWith('testRowData1','col-6')
            expect(table.createColumn).toBeCalledWith('testRowData2','col-6')
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
