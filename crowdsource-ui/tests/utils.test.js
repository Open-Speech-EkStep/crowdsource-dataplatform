const { calculateTime, formatTime,updateLocaleLanguagesDropdown, showElement,hideElement,performAPIRequest} = require("../src/assets/js/utils");
const { stringToHTML} = require("./utils");
const fetchMock = require("fetch-mock");
const { readFileSync } = require("fs");

document.body = stringToHTML(
    readFileSync(`${__dirname}/../build/views/common/headerWithoutNavBar.ejs`, "UTF-8")
);

describe('test utils', () => {
    describe("performAPIRequest", () => {
        test("should give details for given language if server responds ok", () => {
            fetchMock.get("/aggregate-data-count", {
                data: [
                    {
                        total_languages: "2",
                        total_speakers: "80",
                        total_contributions: "0.348",
                        total_validations: "0.175",
                    },
                ],
            });
            performAPIRequest("/aggregate-data-count").then((data) => {
                expect(data).toEqual({
                    data: [
                        {
                            total_languages: "2",
                            total_speakers: "80",
                            total_contributions: "0.348",
                            total_validations: "0.175",
                        },
                    ],
                });
                fetchMock.reset();
            });
        });

        test("should give details for all language if server responds ok", () => {
            fetchMock.get(`/aggregate-data-count?byLanguage=${true}`, {
                data: [{ language: "Hindi", count: 5 }],
            });
            performAPIRequest(`/aggregate-data-count?byLanguage=${true}`).then(
                (data) => {
                    expect(data).toEqual({ data: [{ language: "Hindi", count: 5 }] });
                    fetchMock.reset();
                }
            );
        });

        test("should give list for top-5 languages based on no. of contributions if server responds ok", () => {
            const response = [
                { language: "Hindi", contributions: 5 },
                { language: "Odia", contributions: 4 },
            ];
            fetchMock.get("/top-languages-by-hours", response);
            performAPIRequest("/top-languages-by-hours").then((data) => {
                expect(data).toEqual(response);
                fetchMock.reset();
            });
        });
    });


    describe("calculateTime", () => {
        test("should calculate time in hours,min and sec for given sentence count", () => {
            expect(calculateTime(162)).toEqual({ hours: 0, minutes: 2, seconds: 42 });
        });

        test("should calculate time in hours and min for given sentence count", () => {
            expect(calculateTime(162, false)).toEqual({ hours: 0, minutes: 2 });
        });
    });

    describe("formatTime", () => {
        test("should formats h only for given h", () => {
            expect(formatTime(162)).toEqual("162h");
        });

        test("should format h and min for given h and m", () => {
            expect(formatTime(162, 12)).toEqual("162h 12m");
        });

        test("should format in s when hours and minutes are 0", () => {
            expect(formatTime(0, 0, 2)).toEqual("2s");
        });

        test("should show 0s when hours, minutes and seconds are 0", () => {
            expect(formatTime(0, 0, 0)).toEqual("0s");
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
