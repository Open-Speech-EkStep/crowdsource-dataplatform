const {
    createColumn,
    createTableWithTwoColumns,
    createTableRows,
    createTableWithOneColumn
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
            const expectedColumn = `<div class="col">
        <table class="table table-sm table-borderless mb-0">
            <tbody><tr><td>testValue</td><td>10</td></tr><tr><td>testValue2</td><td>5</td></tr></tbody>
        </table>
    </div>`;
            expect(column).toEqual(expectedColumn);
        });
    });
});
