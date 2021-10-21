const {readFileSync} = require('fs');
const {stringToHTML, mockLocalStorage} = require('../utils');
const {CONTRIBUTION_LANGUAGE, CURRENT_MODULE, PARALLEL_TO_LANGUAGE, INITIATIVES} = require('../../build/js/common/constants');

const asrValidatorPage = readFileSync(`${__dirname}/../../build/views/asr/validator-prompt-page.ejs`, 'UTF-8');
const editAreaErrorPage = readFileSync(`${__dirname}/../../build/views/common/editAreaError.ejs`, 'UTF-8');
document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/virtualKeyboard.ejs`, 'UTF-8')
);

const {lngtype, showAndHideEditError} = require('../../build/js/common/virtualKeyboard.js');

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

  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  test("should give symbol error for asr initiative when given character is any special symbol for any language", () => {
    const symbols = ['!', '"', '#', '$', '%', '&',
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
    ];
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    symbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual({type:'symbol'});
    })
    localStorage.clear();
  })

  test("should give symbol error for asr initiative when given input text starts with any special symbol for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    expect(lngtype('!qwerty')).toEqual({type:'symbol'});
    localStorage.clear();
  })

  test("should give symbol error for asr initiative when given input text ends with any special symbol for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    expect(lngtype('qwerty;')).toEqual({type:'symbol'});
    localStorage.clear();
  })

  test("should give symbol error for asr initiative when given input text contain any special symbol for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    expect(lngtype('qwe*rty')).toEqual({type:'symbol'});
    localStorage.clear();
  })

  test("should give language error for for any module when given input text starts with any different character set for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Hindi');
    expect(lngtype('qहिन्दी')).toEqual({type:'language'});
    localStorage.clear();
  })

  test("should give language error for for any module when given input text ends with any different character set for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Bengali');
    expect(lngtype('কিন্তুu')).toEqual({type:'language'});
    localStorage.clear();
  })

  test("should give language error for any module when given input text contains any different character set for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Telugu');
    expect(lngtype('డ్డా ॐ యి')).toEqual({type:'language'});
    localStorage.clear();
  })

  test("should give error as null for asr when character is any English numeral for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Assamese');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give error as null for ocr initiative when character is any English numeral for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Bengali');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give error as null for parallel initiative when character is any English numeral for any language", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Gujarati');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give error as null any module when character is any number for Hindi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Hindi');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give error as null any module when character is any number for Kannada", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Kannada');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give error as null any module when character is any number for Malayalam", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Malayalam');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give error as null any module when character is any number for Marathi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Marathi');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give error as null any module when character is any number for Odia", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Odia');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give erros as null any module when character is any number for Punjabi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Punjabi');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give erros as null any module when character is any number for Tamil", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Tamil');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give error as null any module when character is any numbers for Telugu", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.asr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Telugu');
    numbers.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Assamese", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Assamese');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Bengali", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Bengali');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Gujarati", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Gujarati');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Hindi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|

    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Hindi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Kannada", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|

    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Kannada');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Malayalam", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Malayalam');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Marathi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Marathi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Odia", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Odia');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Punjabi", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Punjabi');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Tamil", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Tamil');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for parallel initiative when character is any special symbol for Telugu", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.parallel.value);
    localStorage.setItem(PARALLEL_TO_LANGUAGE, 'Telugu');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for ocr initiative when character is any special symbol for Telugu", () => {
    mockLocalStorage();
    // \=-.,@/<>?';:,"[]{}|+_)(*&^%$#@!~,.\=-`!/।|
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Telugu');
    specialSymbols.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
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
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Assamese');
    characters.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give true for any module when characters is related English", () => {
    const characters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
      'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    ]
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'English');
    characters.forEach(symbol => {
      expect(lngtype(symbol)).toEqual(null);
    })
    localStorage.clear();
  })

  test("should give false for any module when characters is not related to selected language", () => {
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'English');
    expect(lngtype('।')).toEqual({type:'language'});
    expect(lngtype('॥')).toEqual({type:'language'});
    localStorage.clear();
  })

  test("should give false for any module when characters is not related to chosen language", () => {
    mockLocalStorage();
    localStorage.setItem(CURRENT_MODULE, INITIATIVES.ocr.value);
    localStorage.setItem(CONTRIBUTION_LANGUAGE, 'Tamil');
    expect(lngtype('त')).toEqual({type:'language'});
    localStorage.clear();
  })
})


describe('showAndHideEditError',()=>{
  test('should show no error when user typed in selected language',()=>{
    document.body = stringToHTML(asrValidatorPage + editAreaErrorPage);
    showAndHideEditError(5, null,()=>{},()=>{});
    const $submitEditButton = document.getElementById("submit-edit-button");
    expect($submitEditButton.hasAttribute('disabled')).toEqual(false)
    expect($("#edit-error-row").hasClass('d-none')).toEqual(true);
  })

  test('should show no Text error msg when user typed empty space ',()=>{
    document.body = stringToHTML(asrValidatorPage + editAreaErrorPage);
    const inputText = '      ';
    showAndHideEditError(inputText.trim().length, {type:'noText'},()=>{},()=>{});
    const $submitEditButton = document.getElementById("submit-edit-button");
    expect($submitEditButton.hasAttribute('disabled')).toEqual(true)
    expect($("#edit-error-row").hasClass('d-none')).toEqual(false);
    expect($('#edit-noText-error').hasClass('d-none')).toEqual(false);
    expect($('#edit-language-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-number-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-symbol-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-text').hasClass('edit-error-area')).toEqual(true);
    expect($('#edit-text').hasClass('edit-text')).toEqual(false);
  })

  test('should show symbol error msg when error type is symbol',()=>{
    document.body = stringToHTML(asrValidatorPage + editAreaErrorPage);
    showAndHideEditError(2, {type:'symbol'},()=>{},()=>{});
    const $submitEditButton = document.getElementById("submit-edit-button");
    const $editText = $('#edit-text');
    expect($submitEditButton.hasAttribute('disabled')).toEqual(true)
    expect($("#edit-error-row").hasClass('d-none')).toEqual(false);
    expect($('#edit-noText-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-language-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-number-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-symbol-error').hasClass('d-none')).toEqual(false);
    expect($editText.hasClass('edit-error-area')).toEqual(true);
    expect($editText.hasClass('edit-text')).toEqual(false);
  })

  test('should show number error msg when error type is number',()=>{
    document.body = stringToHTML(asrValidatorPage + editAreaErrorPage);
    showAndHideEditError(2, {type:'number'},()=>{},()=>{});
    const $submitEditButton = document.getElementById("submit-edit-button");
    expect($submitEditButton.hasAttribute('disabled')).toEqual(true)
    expect($("#edit-error-row").hasClass('d-none')).toEqual(false);
    expect($('#edit-noText-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-language-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-number-error').hasClass('d-none')).toEqual(false);
    expect($('#edit-symbol-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-text').hasClass('edit-error-area')).toEqual(true);
    expect($('#edit-text').hasClass('edit-text')).toEqual(false);
  })

  test('should show language error msg when error type is language',()=>{
    document.body = stringToHTML(asrValidatorPage + editAreaErrorPage);
    showAndHideEditError(2, {type:'language'},()=>{},()=>{});
    const $submitEditButton = document.getElementById("submit-edit-button");
    expect($submitEditButton.hasAttribute('disabled')).toEqual(true)
    expect($("#edit-error-row").hasClass('d-none')).toEqual(false);
    expect($('#edit-noText-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-language-error').hasClass('d-none')).toEqual(false);
    expect($('#edit-number-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-symbol-error').hasClass('d-none')).toEqual(true);
    expect($('#edit-text').hasClass('edit-error-area')).toEqual(true);
    expect($('#edit-text').hasClass('edit-text')).toEqual(false);
  })
})
