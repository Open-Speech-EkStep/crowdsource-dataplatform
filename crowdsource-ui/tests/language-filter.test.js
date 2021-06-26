const {
    getEnabledLanguages
} = require('../src/assets/js/language-filter');

describe('Test language filter', () => {
    describe('getEnabledLanguages', () => {
        test('should filter languages', () => {
            const enabled_languages = [
                "as",
                "bn",
                "hi"
            ]
            const expected = [
                { value: "Assamese", id: "as", text: "অসমীয়া", hasLocaleText: true, data: true },
                { value: "Bengali", id: "bn", text: "বাংলা", hasLocaleText: true, data: true },
                { value: "Hindi", id: "hi", text: "हिंदी", hasLocaleText: true, data: true }]
            const languages = getEnabledLanguages(enabled_languages)
            expect(languages).toEqual(expected)
        });

        // test('should order gender data for given data with duplicate entries', () => {
        //     const testData = [{ gender: 'Anonymous', count: 3 }, { gender: 'Female', count: 4 }, { gender: 'Others', count: 1 }, { gender: 'Male', count: 2 }, { gender: 'female', count: 3 }];
        //     const actualData = getOrderedGenderData(testData);
        //     const expectedData = [{ gender: 'Female', count: 7 }, { gender: 'Male', count: 2 }, { gender: 'Others', count: 1 }, { gender: 'Anonymous', count: 3 }];
        //     expect(actualData).toEqual(expectedData)
        // });
    });
});
