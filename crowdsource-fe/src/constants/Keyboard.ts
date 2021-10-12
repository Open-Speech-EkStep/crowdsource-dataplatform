export const KEYBOARD_ERROR = {
  language: { type: 'language' },
  symbol: { type: 'symbol' },
  noError: { type: '' },
} as const;

export const TEXT_INPUT_LENGTH = {
  LENGTH: 3,
};

export const LANGUAGE_UNICODE = {
  Assamese: /^[\u0980-\u09FF\u0030-\u0039]+$/,
  Bengali: /^[\u0980-\u09FF\u0030-\u0039]+$/,
  English: /^[\u0020-\u007F]+$/,
  Gujarati: /^[\u0A80-\u0AFF\u0030-\u0039]+$/,
  Hindi: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Kannada: /^[\u0C80-\u0CFF\u0030-\u0039]+$/,
  Malayalam: /^[\u0D00-\u0D7F\u0030-\u0039]+$/,
  Odia: /^[\u0B00-\u0B7F\u0030-\u0039]+$/,
  Marathi: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Punjabi: /^[\u0A00-\u0A7F\u0030-\u0039]+$/,
  Tamil: /^[\u0B80-\u0BFF\u0030-\u0039]+$/,
  Telugu: /^[\u0C00-\u0C7F\u0030-\u0039]+$/,
  Sanskrit: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Kashmiri: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Sindhi: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Konkani: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Bodo: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Manipuri: /^[\u0980-\u09FF\u0030-\u0039]+$/,
  Dogri: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Nepali: /^[\u0900-\u097F\u0030-\u0039]+$/,
  Santali: /^[\u0020-\u007F]+$/,
  Maithili: /^[\u0900-\u097F\u0030-\u0039]+$/,
};

export const KeyboardLanguageLayout: any = {
  English: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} q w e r t y u i o p [ ] \\',
      "{lock} a s d f g h j k l ; ' {enter}",
      '{shift} z x c v b n m , . / {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} Q W E R T Y U I O P { } |',
      '{lock} A S D F G H J K L : " {enter}',
      '{shift} Z X C V B N M < > ? {shift}',
      '.com @ {space}',
    ],
  },
  Hindi: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण    श ष । ? {shift}',
      '.com @ {space}',
    ],
  },
  Assamese: {
    default: [
      ' ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ ০ - ৃ {bksp}',
      '{tab} ৌ ৈ া ী ূ ব হ গ দ জ ড ় /',
      '{lock} ো ে ্ ি ু প ৰ ক ত চ ট {enter}',
      '{shift}   ং ম ন ৱ ল স , . য {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ অ্যা @ ্ৰ ৰ্ জ্ঞ ত্র ক্ষ শ্র ( ) ঃ ঋ {bksp}',
      '{tab} ঔ ঐ আ ঈ ঊ ভ ঙ ঘ ধ ঝ ঢ ঞ ?',
      '{lock} ও এ অ ই উ ফ  খ থ ছ ঠ {enter}',
      '{shift}  ঁ ণ    শ ষ । য় {shift}',
      '.com @ {space}',
    ],
  },
  Bengali: {
    default: [
      'ৎ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ ০ - = {bksp}',
      '{tab} র্ অ ে র ত য ু ি ো প [ ] \\',
      "{lock} া স দ ্ গ হ জ ক ল ; ' {enter}",
      '{shift} ঙ ষ চ ড় ব ন ম  , । / {shift}',
      '.com @ {space}',
    ],
    shift: [
      'ঽ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} র‍্ আ ৈ ৃ থ য় ূ ী ৌ ফ { } |',
      '{lock} া শ ধ ় ঘ ঃ ঝ খ  : " {enter}',
      '{shift} ঁ ক্ষ ছ ঢ় ভ ণ ং < > ? {shift}',
      '.com @ {space}',
    ],
  },

  Gujarati: {
    default: [
      ' ૧ ૨ ૩ ૪ ૫ ૬ ૭  ૮ ૯ ૦ - = {bksp}',
      '{tab} ૅ અ ે ર ત ય ુ િ ો પ   \\',
      "{lock} ા સ દ ્ ગ હ જ ક લ ; ' {enter}",
      '{shift} ઙ ષ ચ વ બ ન મ , . / {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} ૉ આ ૈ ૃ થ  ૂ ી ૌ ફ [ ] ',
      '{lock} ા શ ધ ઼ ઘ ઃ ઝ ખ ળ : " {enter}',
      '{shift} ઁ ક્ષ છ  ભ ણ ં < > ? {shift}',
      '.com @ {space}',
    ],
  },
  Kannada: {
    default: [
      'ೆ ೧ ೨ ೩ ೪ ೫ ೬ ೭ ೮ ೯ ೦ - = {bksp}',
      '{tab}  ಅ ೇ ರ ತ ಯ ು ಿ ೋ ಪ  ರ ೊ',
      "ಾ ಸ ದ ್ ಗ ಹ ಜ ಕ ಲ ; ' {enter}",
      '{shift} ಙ ಷ ಚ ವ ಬ ನ ಮ ,  / {shift}',
      '.com @ {space}',
    ],
    shift: [
      'ಎ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab}  ಆ ೈ ೃ ಥ  ೂ ೀ ೌ ಫ [ ] ಒ',
      'ಾ ಶ ಧ  ಘ ಃ ಝ ಖ ಳ : " {enter}',
      '{shift}  ಕ್ಷ ಛ  ಭ ಣ ಂ < > ? {shift}',
      '.com @ {space}',
    ],
  },

  Malayalam: {
    default: [
      'െ ൧ ൨ ൩ ൪ ൫ ൬ ൭ ൮ ൯ ൦ - = {bksp}',
      '{tab}  അ േ രരത യ ു ി ോ പ  ര ൊ',
      '{lock} ാ സ ദ ് ഗ ഹ ജ ക ല {enter}',
      '{shift} ങ ഷ ച വ ബ ന മ , . / {shift}',
      '.com @ {space}',
    ],
    shift: [
      'എ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab}  ആ ൈ ൃ ഥ  ൂ ീ ൗ ഫ [ ] ഒ',
      '{lock} ാ ശ ധ  ഘ ഃ ഝ ഖ ള : " {enter}',
      '{shift}  ക്ഷ ഛ  ഭ ണ ം < > ? {shift}',
      '.com @ {space}',
    ],
  },

  Marathi: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      ' ॲ ॅ ्र र् ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण   ळ श ष । ? {shift}',
      '.com @ {space}',
    ],
  },

  Odia: {
    default: [
      ' ୧ ୨ ୩ ୪ ୫ ୬ ୭ ୮ ୯ ୦ - = {bksp}',
      '{tab}  ଅ େ ର ତ ଯ ୁ ି ୋ ପ  ର  ',
      "{lock} ା ସ ଦ ୍୍ଗ ହ ଜ କ ଲ ; ' {enter}",
      '{shift} ଙ ଷ ଚ  ବ ନ ମ , । / {shift}',
      '.com @ {space}',
    ],
    shift: [
      ' ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab}  ଆ ୈ ୃ ଥ ୟ ୂ ୀ ୌ ଫ [ ]  ',
      '{lock} ା ଶ ଧ ଼ ଘ ଃ ଝ ଖ ଳ : " {enter}',
      '{shift} ଁ କ୍ଷ ଛ  ଭ ଣ ଂ < > ? {shift}',
      '.com @ {space}',
    ],
  },

  Punjabi: {
    default: [
      ' ੧ ੨ ੩ ੪ ੫ ੬ ੭ ੮ ੯ ੦ - = {bksp}',
      '{tab} ੌ ੈ ਾ ੀ ੂ ਬ ਹ ਗ ਦ ਜ ਡ ਼ \\',
      '{lock} ੋ ੇ ੍ ਿ ੁ ਪ ਰ ਕ ਤ ਚ ਟ {enter}',
      '{shift}  ੰ ਮ ਨ ਵ ਲ ਸ , . ਯ {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ! @ ੍ਰ ੱ % ^ & * ( ) ਃ + {bksp}',
      '{tab} ਔ ਐ ਆ ਈ ਊ ਭ ਙ ਘ ਧ ਝ ਢ ਞ |',
      '{lock} ਓ ਏ ਅ ਇ ਉ ਫ ੜ ਖ ਥ ਛ ਠ {enter}',
      '{shift}  ਂ ਣ   ਲ਼ ਸ਼ , । ? {shift}',
      '.com @ {space}',
    ],
  },

  Tamil: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} ஆ ஈ ஊ ஐ ஏ ள ற ன ட ண ச ஞ \\',
      '{lock} அ இ உ ் எ க ப ம த ந ய {enter}',
      '{shift} ஔ ஓ ஒ வ ங ல ர , .  {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} ஸ ஷ ஜ ஹ க்ஷ ஸ்ரீ ஶ ஈ [ ] { } |',
      '{lock} ௹ ௺ ௸ ஃ    " , : ; \' {enter}',
      '{shift} ௳ ௴ ௵ ௶ ௷  / < > ? {shift}',
      '.com @ {space}',
    ],
  },

  Telugu: {
    default: [
      'ె ౧ ౨ ౩ ౪ ౫ ౬ ౭ ౮ ౯ ౦ - = {bksp}',
      '{tab}  అ ే ర త య ు ి ో ప  ర ొ',
      "{lock} ా స ద ్్గ హ జ క ల ; ' {enter}",
      '{shift} ఙ ష చ వ బ న మ ,  / {shift}',
      '.com @ {space}',
    ],
    shift: [
      'ఎ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab}  ఆ ై ృ థ  ూ ీ ౌ ఫ [ ] ఒ',
      '{lock} ా శ ధ  ఘ ఝ ఖ ళ : " {enter}',
      '{shift} ఁ క్ష ఛ  భ ణ ం < > ? {shift}',
      '.com @ {space}',
    ],
  },
  Sanskrit: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण    श ष । ? {shift}',
      '.com @ {space}',
    ],
  },
  Sindhi: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण    श ष । ? {shift}',
      '.com @ {space}',
    ],
  },
  Konkani: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण    श ष । ? {shift}',
      '.com @ {space}',
    ],
  },
  Kashmiri: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण    श ष । ? {shift}',
      '.com @ {space}',
    ],
  },
  Manipuri: {
    default: [
      'ৎ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ ০ - = {bksp}',
      '{tab} র্ অ ে র ত য ু ি ো প [ ] \\',
      "{lock} া স দ ্ গ হ জ ক ল ; ' {enter}",
      '{shift} ঙ ষ চ ড় ব ন ম  , । / {shift}',
      '.com @ {space}',
    ],
    shift: [
      'ঽ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} র‍্ আ ৈ ৃ থ য় ূ ী ৌ ফ { } |',
      '{lock} া শ ধ ় ঘ ঃ ঝ খ  : " {enter}',
      '{shift} ঁ ক্ষ ছ ঢ় ভ ণ ং < > ? {shift}',
      '.com @ {space}',
    ],
  },
  Maithili: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण    श ष । ? {shift}',
      '.com @ {space}',
    ],
  },
  Bodo: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण    श ष । ? {shift}',
      '.com @ {space}',
    ],
  },
  Dogri: {
    default: [
      ' १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}',
      '{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ',
      '{lock} ो े ् ि ु प र क त च ट {enter}',
      '{shift}  ं म न व ल स , . य {shift}',
      '.com @ {space}',
    ],
    shift: [
      '~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}',
      '{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ',
      '{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}',
      '{shift}  ँ ण    श ष । ? {shift}',
      '.com @ {space}',
    ],
  },
} as const;
