const MAX_SIZE = 8;
const VALID_FILE_TYPE = 'audio/wav';
const ONE_YEAR = 31536000000;
const ROLE_UAT = "ROLE_UAT"
const KIDS_AGE_GROUP = 'upto 10'; //should be change when we have data for kids
const KIDS = 'medium';
const ADULT = 'medium';
const MAX_LENGTH = 12;
const MOBILE_REGEX = /^[0-9]\d{9}$/;
const EMAIL_REGEX = /^\S+@\S+[\.][0-9a-zA-Z]+$/;
const MOTHER_TONGUE = [
  'Assamese',
  'Bengali',
  'Bodo',
  'Dogri',
  'Gujarati',
  'Hindi',
  'Kannada',
  'Kashmiri',
  'Konkani',
  'Maithili',
  'Malayalam',
  'Manipuri',
  'Marathi',
  'Nepali',
  'Odia',
  'Punjabi',
  'Sanskrit',
  'Santali',
  'Sindhi',
  'Tamil',
  'Telugu',
  'Urdu',
];

const LANGUAGES = [
  'Assamese',
  'Bengali',
  'English',
  'Gujarati',
  'Hindi',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Odia',
  'Punjabi',
  'Tamil',
  'Telugu',
]

const AGE_GROUP = [
  '',
  'upto 10',
  '10 - 30',
  '30 - 60',
  '60+',
];

const GENDER = ['', 'male', 'female', 'others', 'Transgender - He', 'Transgender - She', 'Rather Not Say'];

const WADASNR_BIN_PATH = '/opt/binaries/WadaSNR/Exe'
const MIN_SNR_LEVEL = 25

const CATEGORY_MAX_LENGTH = 15

const FEEDBACK_MAX_LENGTH = 1000

const OPTIONAL_FIELD_MAX_LENGTH = 50

const VALIDATION_ACTIONS = ["accept", "reject", "skip"];

const SOURCES = ["contribute", "validate"];
const REPORT_SOURCES = ["contribution", "validation"];

const MEDIA_TYPES = ['parallel', 'ocr', 'text', 'asr'];

const FEEDBACK_RESPONSES = ['yes', 'no', 'maybe'];

const VALID_ORIGINS = [/vakyansh\.in$/, /nplt\.in$/, /gov\.in$/]

module.exports = {
  MAX_SIZE,
  VALID_FILE_TYPE,
  ONE_YEAR,
  KIDS_AGE_GROUP,
  KIDS,
  ADULT,
  MOBILE_REGEX,
  EMAIL_REGEX,
  MOTHER_TONGUE,
  LANGUAGES,
  MAX_LENGTH,
  AGE_GROUP,
  GENDER,
  WADASNR_BIN_PATH,
  MIN_SNR_LEVEL,
  CATEGORY_MAX_LENGTH,
  FEEDBACK_MAX_LENGTH,
  VALIDATION_ACTIONS,
  SOURCES,
  REPORT_SOURCES,
  MEDIA_TYPES,
  ROLE_UAT,
  OPTIONAL_FIELD_MAX_LENGTH,
  FEEDBACK_RESPONSES,
  VALID_ORIGINS
};
