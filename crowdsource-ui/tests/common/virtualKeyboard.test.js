const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('../utils');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE, LIKHO_TO_LANGUAGE} = require('../../build/js/common/constants');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/virtualKeyboard.ejs`, 'UTF-8')
);

const {lngtype} = require('../../build/js/common/virtualKeyboard.js');

describe("lngtype", () => {
  const specialSymbols = ['!', '"', '#', '$', '%', '&',
    '\'',
    '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@',
    '[',
    '\\',
    ']',
    '^',
    '_',
    '`',
    '{',
    '|',
    '}',
    '~',
    '।',
    '~',
    '`',
    '॥',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  test("should give true any module when character is any special symbol for Assamese", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Assamese');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Bengali", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Bengali');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Gujarati", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Gujarati');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Hindi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Hindi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Kannada", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Kannada');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Malayalam", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Malayalam');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Marathi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Marathi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Odia", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Odia');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Punjabi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Punjabi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Tamil", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Tamil');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true any module when character is any special symbol for Telugu", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'suno');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Telugu');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Assamese", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Assamese');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Bengali", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Bengali');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Gujarati", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Gujarati');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Hindi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|

    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Hindi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Kannada", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|

    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Kannada');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Malayalam", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Malayalam');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Marathi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Marathi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Odia", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Odia');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Punjabi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Punjabi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Tamil", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Tamil');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for likho when character is any special symbol for Telugu", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'likho');
    localStorage.setItem(LIKHO_TO_LANGUAGE, 'Telugu');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for dekho when character is any special symbol for Telugu", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Telugu');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for any module when characters is related Assamese", () => {
    const characters = ['১','২','৩','৪', '৫', '৬', '৭', '৮', '৯', '০', '-', 'ৃ',
      'ৌ' ,'ৈ' ,'া','ী','ূ', 'ব', 'হ', 'গ', 'দ', 'জ', 'ড', '়' , '/',
      'ো', 'ে', '্' ,'ি', 'ু', 'প','ৰ', 'ক', 'ত', 'চ', 'ট',
      'ং', 'ম', 'ন', 'ৱ', 'ল', 'স',',', '.', 'য',
      '~', 'অ্যা', '্ৰ', 'ৰ্', 'জ্ঞ', 'ত্র', 'ক্ষ', 'শ্র' ,'ঃ', 'ঋ',
      'ঔ', 'ঐ', 'আ', 'ঈ', 'ঊ', 'ভ', 'ঙ', 'ঘ', 'ধ', 'ঝ', 'ঢ', 'ঞ' ,'?',
      'ও', 'এ', 'অ', 'ই', 'উ', 'ফ', 'খ', 'থ', 'ছ', 'ঠ','ঁ', 'ণ', 'শ', 'ষ', '।', 'য়'
    ]
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Assamese');
    characters.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give true for any module when characters is related English", () => {
    const characters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
      'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    ]
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'English');
    characters.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(true);
    })
    localStorage.clear();
  })

  test("should give false for any module when characters is not related to selected language", () => {
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'English');
    expect(lngtype('।')).toEqual(false);
    expect(lngtype('॥')).toEqual(false);
    localStorage.clear();
  })

  test("should give false for any module when characters is not related to chosen language", () => {
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, 'dekho');
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Tamil');
    expect(lngtype('त')).toEqual(false);
    localStorage.clear();
  })
})
