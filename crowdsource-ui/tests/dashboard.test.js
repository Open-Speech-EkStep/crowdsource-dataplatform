const {readFileSync} = require('fs');
const fetchMock = require("fetch-mock");
const {stringToHTML, flushPromises} = require('./utils');
const {fetchDetail, getSpeakersData,isLanguageAvailable,updateLanguage} = require('../assets/js/dashboard');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../views/dashboard.ejs`, 'UTF-8')
);

const charts = require('../assets/js/draw-chart');

jest.mock('../assets/js/draw-chart', () => ({
  updateGraph: jest.fn().mockImplementation((a,b,)=>{}),
}))

describe("fetchDetail",()=>{
  test("should fetch aggregate-data-count?byLanguage=true when language is given as parameter",()=>{
    fetchMock.get(`/aggregate-data-count?byLanguage=${true}`, {
      data: [{ language: "Hindi", count: 5 }],
    });

    fetchDetail("Hindi").then((an)=>{
      expect(an).toEqual({data: [{ language: "Hindi", count: 5 }]});
      fetchMock.reset();
    });
  })

  test("should fetch aggregate-data-count when language is not given as parameter",()=>{
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
    fetchDetail("Hindi").then((an)=>{
      expect(an).toEqual({data: [
          {
            total_languages: "2",
            total_speakers: "80",
            total_contributions: "0.348",
            total_validations: "0.175",
          },
        ]})
    });
    fetchMock.reset();
  })
})

describe("getSpeakersData",()=> {
  test("should format speaker data with languages value equal to 0 for given data and languages ", () => {
    const data = [{language:"Hindi",total_speakers: "80",total_contributions: "0.348",total_validations: "0.175"},{language:"English",total_speakers: "90",total_contributions: "0.8",total_validations: "0.75"}];

    const speakerData = getSpeakersData(data, "Hindi");

    expect(speakerData).toEqual({languages: 0,speakers:80,contributions: 0.348,validations: 0.175});
  })

  test("should format speaker data with languages value not equal to 0 for given data only ", () => {
    const data = [{total_languages:"2",total_speakers:"5",total_contributions: "48",total_validations: "75"}];

    const speakerData = getSpeakersData(data);

    expect(speakerData).toEqual({languages: 2,speakers:5,contributions: 48,validations: 75});
  })
})

describe("isLanguageAvailable",()=> {
  test("should give true when languages is not given as parameter", () => {
    const data = [{language:"Hindi",total_speakers: "80",total_contributions: "0.348",total_validations: "0.175"},{language:"English",total_speakers: "90",total_contributions: "0.8",total_validations: "0.75"}];

    const isAvailable = isLanguageAvailable(data);

    expect(isAvailable).toEqual(true);
  })

  test("should give true when languages is given as parameter and data includes given languages in its list", () => {
    const data = [{language:"Hindi",total_speakers:"5",total_contributions: "48",total_validations: "75"}];

    const isAvailable = isLanguageAvailable(data,"Hindi");

    expect(isAvailable).toEqual(true);
  })

  test("should give false when languages is given as parameter but data does not includes given languages in its list", () => {
    const data = [{language:"English",total_speakers:"5",total_contributions: "48",total_validations: "75"}];

    const isAvailable = isLanguageAvailable(data,"Hindi");

    expect(isAvailable).toEqual(false);
  })

  test("should give false when languages is given as parameter but data list is empty", () => {
    const data = [];

    const isAvailable = isLanguageAvailable(data,"Hindi");

    expect(isAvailable).toEqual(false);
  })
})
