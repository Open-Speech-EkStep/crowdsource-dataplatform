const { calculateTime, formatTime,updateLocaleLanguagesDropdown, showElement,hideElement,performAPIRequest, formatTimeForLegends} = require("../src/assets/js/utils");
const { stringToHTML, mockLocalStorage} = require("./utils");
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
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({"hour(s)":"hour(s)", "second(s)": "second(s)", "minute(s)":"minute(s)"}))
            expect(formatTime(162)).toEqual("162 hour(s)");
            localStorage.clear();
        });

        test("should format h and min for given h and m", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({"hour(s)":"hour(s)", "second(s)": "second(s)", "minute(s)":"minute(s)"}))
            expect(formatTime(162, 12)).toEqual("162 hour(s) 12 minute(s)");
            localStorage.clear()
        });

        test("should format in s when hours and minutes are 0", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({"hour(s)":"hour(s)", "second(s)": "second(s)", "minute(s)":"minute(s)"}))
            expect(formatTime(0, 0, 2)).toEqual("2 second(s)");
            localStorage.clear();
        });

        test("should show 0s when hours, minutes and seconds are 0", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({"hour(s)":"hour(s)", "second(s)": "second(s)", "minute(s)":"minute(s)"}))
            expect(formatTime(0, 0, 0)).toEqual("0 second(s)");
            localStorage.clear();
        });

    });

    describe("formatTimeForLegends", () => {
        test("should formats hours only for given hours when labels are allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(162, 0, 0, true)).toEqual("162 hours");
            localStorage.clear()
        });

        test("should formats hours only for given hours when labels are not allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(162, 0, 0, false)).toEqual("162");
            localStorage.clear();
        });

        test("should format hours for given hours and minutes when labels are allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(162, 12 , 0, true)).toEqual("162.12 hours");
            localStorage.clear();
        });

        test("should format hours for given hours and minutes when labels are not allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(162, 12 , 0, false)).toEqual("162.12");
            localStorage.clear();
        });

        test("should format in s when hours and minutes are 0 when labels are allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(0, 0, 2, true)).toEqual("2 seconds");
            localStorage.clear();
        });

        test("should format in s when hours and minutes are 0 when labels are not allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(0, 0, 2, false)).toEqual("2");
            localStorage.clear();
        });

        test("should format in minutes  when hours, minutes and seconds are 0  when labels are allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(0, 20, 0, true)).toEqual("20 minutes");
            localStorage.clear();
        });

        test("should format in minutes  when hours, minutes and seconds are 0  when labels are allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(0, 20, 0, false)).toEqual("20");
            localStorage.clear();
        });


        test("should show 0s when hours, minutes and seconds are 0  when labels are allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(0, 0, 0, true)).toEqual("0 seconds");
            localStorage.clear();
        });

        test("should show 0s when hours, minutes and seconds are 0  when labels are not allowed", () => {
            mockLocalStorage();
            localStorage.setItem('localeString', JSON.stringify({hours:"hours", seconds: "seconds", minutes:"minutes"}))
            expect(formatTimeForLegends(0, 0, 0, false)).toEqual("0");
            localStorage.clear();
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
