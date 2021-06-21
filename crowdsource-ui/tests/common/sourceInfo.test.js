const {readFileSync} = require('fs');
const {stringToHTML} = require('../utils');
const {setDataSource} = require('../../build/js/common/sourceInfo.js');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/sourceInfo.ejs`, 'UTF-8')
);

describe('dataSourceInfoTests', () => {

  describe("setDataSourceTest", () => {
    test("should set tooltip text to Copy to clipboard on calling that method", () => {
        const tooltipDiv = $('#myDataSourceTooltip');

        tooltipDiv.text("some other text");

        setDataSource(null);

        expect(tooltipDiv.text() == "Copy to clipboard").toEqual(true);
    });
    test("should hide data source button, when source_info is null", () => {
        setDataSource(null);

        const dataSourceButton = $('#show_source_button');

        expect(dataSourceButton.hasClass('d-none')).toEqual(true);
    });
    test("should hide data source button, when source_info is empty string", () => {
        setDataSource("");

        const dataSourceButton = $('#show_source_button');

        expect(dataSourceButton.hasClass('d-none')).toEqual(true);
    });

    test("should hide data source button, when source_info is '[]'", () => {
        setDataSource('[]');

        const dataSourceButton = $('#show_source_button');

        expect(dataSourceButton.hasClass('d-none')).toEqual(true);
    });


    test("should hide data source button, when source_info is '[]'", () => {
        const data = [];
        setDataSource(JSON.stringify(data));

        const dataSourceButton = $('#show_source_button');

        expect(dataSourceButton.hasClass('d-none')).toEqual(true);
    });

    test("should show data source button, when source_info is present", () => {
        const data = ["source", "url"];
        setDataSource(JSON.stringify(data));

        const dataSourceButton = $('#show_source_button');

        expect(dataSourceButton.hasClass('d-none')).toEqual(false);
    });


    test("should show data source button and source info, when source_info array has 1 element", () => {
        const data = ["source"];
        setDataSource(JSON.stringify(data));

        const dataSourceButton = $('#show_source_button');
        const sourceInfoField = $('#div-ds-source-name');
        const sourceInfoFieldSpan = $('#div-ds-source-name a.spn-source-info');
        expect(dataSourceButton.hasClass('d-none')).toEqual(false);
        expect(sourceInfoField.hasClass('d-none')).toEqual(false);
        expect(sourceInfoFieldSpan.text() == data[0]).toEqual(true);
        expect(sourceInfoFieldSpan.is('[href]')).toEqual(false);
        expect(sourceInfoFieldSpan.is('[target]')).toEqual(false);
    });


    test("should hide data source button and source info, when source_info array has 1 element but is empty", () => {
        const data = [""];
        setDataSource(JSON.stringify(data));

        const dataSourceButton = $('#show_source_button');
        const sourceInfoField = $('#div-ds-source-name');
        const sourceInfoFieldSpan = $('#div-ds-source-name a.spn-source-info');
        expect(dataSourceButton.hasClass('d-none')).toEqual(false);
        expect(sourceInfoField.hasClass('d-none')).toEqual(true);
        expect(sourceInfoFieldSpan.text() == '').toEqual(true);
    });


    test("should show data source button and source should have href, when source_info array has 2 elements", () => {
        const data = ["source", "url"];
        setDataSource(JSON.stringify(data));

        const dataSourceButton = $('#show_source_button');
        const sourceUrlFieldSpan = $('#div-ds-source-name a.spn-source-info');
        expect(dataSourceButton.hasClass('d-none')).toEqual(false);
        expect(sourceUrlFieldSpan.attr('href') == data[1]).toEqual(true);
        expect(sourceUrlFieldSpan.attr('target') == 'blank').toEqual(true);
    });


    test("should hide data source button and source url, when source_info array has 2 elements but second one is empty", () => {
        const data = ["source", ""];
        setDataSource(JSON.stringify(data));

        const dataSourceButton = $('#show_source_button');
        const sourceUrlFieldSpan = $('#div-ds-source-name a.spn-source-info');
        expect(dataSourceButton.hasClass('d-none')).toEqual(false);
        expect(sourceUrlFieldSpan.is('[href]')).toEqual(false);
        expect(sourceUrlFieldSpan.is('[target]')).toEqual(false);
    });
  })
})


