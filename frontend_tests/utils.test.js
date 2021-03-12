const { calculateTime, formatTime,updateLocaleLanguagesDropdown, showElement,hideElement} = require("../assets/js/utils");
const { stringToHTML} = require("./utils");
const fetchMock = require("fetch-mock");
const { readFileSync } = require("fs");

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/common/headerForContributor.ejs`, "UTF-8")
);


describe('test utils', () => {
    describe("calculateTime", () => {
        test("should calculate time in hours,min and sec for given sentence count", () => {
            expect(calculateTime(162)).toEqual({ hours: 0, minutes: 2, seconds: 42 });
        });

        test("should calculate time in hours and min for given sentence count", () => {
            expect(calculateTime(162, false)).toEqual({ hours: 0, minutes: 2 });
        });
    });

    describe("formatTime", () => {
        test("should formats hrs only for given hrs", () => {
            expect(formatTime(162)).toEqual("162 hrs");
        });

        test("should format hrs and min for given hrs and min", () => {
            expect(formatTime(162, 12)).toEqual("162 hrs 12 min");
        });

        test("should format in sec when hours and minutes are 0", () => {
            expect(formatTime(0, 0, 2)).toEqual("2 sec");
        });
    });

    describe("updateLocaleLanguagesDropdown", () => {
        test("should insert 'english' and given language in dropdown menu when given language is not english", () => {
            const dropDown = $('#localisation_dropdown');
            updateLocaleLanguagesDropdown("Hindi");
            const children = dropDown.children();
            expect(children[0].getAttribute('id')).toEqual('english');
            expect(children[1].getAttribute('id')).toEqual('Hindi');
            expect(children[2]).toEqual(undefined);
        });

        test("should insert 'english' in dropdown menu when given language is english", () => {
            const dropDown = $('#localisation_dropdown');
            updateLocaleLanguagesDropdown("English");
            const children = dropDown.children();
            expect(children[0].getAttribute('id')).toEqual('english');
            expect(children[1]).toEqual(undefined);
        });
    });

    describe("showElement", () => {
        test("should remove class d-none from given element", () => {
            const element = $("#navbarSupportedContent");
            showElement(element)
            expect(element.hasClass('d-none')).toEqual(false);
        });
    });

    describe("hideElement", () => {
        test("should add class d-none from given element", () => {
            const element = $("#navbarSupportedContent");
            hideElement(element)
            expect(element.hasClass('d-none')).toEqual(true);
        });
    });

})
