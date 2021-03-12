const { calculateTime, formatTime } = require("../assets/js/utils");

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

        test("should format hrs, min & sec as hrs and mins as hrs, min greater than 0", () => {
            expect(formatTime(162, 12)).toEqual("162 hrs 12 min");
        });
    });
})
