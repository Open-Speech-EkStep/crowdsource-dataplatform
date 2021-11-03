const MAX_SIZE = 8;
const VALID_FILE_TYPE = 'audio/wav';
const ONE_YEAR = 31536000000;
const ROLE_UAT = "ROLE_UAT"
const KIDS_AGE_GROUP = 'upto 10'; //should be change when we have data for kids
const KIDS = 'medium';
const ADULT = 'medium';
const MAX_LENGTH = 100;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
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
const LANGUAGES = [{ value: "Assamese", id: "as", text: "অসমীয়া" },
{ value: "Bengali", id: "bn", text: "বাংলা" },
{ value: "English", id: "en", text: "English" },
{ value: "Gujarati", id: "gu", text: "ગુજરાતી" },
{ value: "Hindi", id: "hi", text: "हिंदी" },
{ value: "Kannada", id: "kn", text: "ಕನ್ನಡ" },
{ value: "Malayalam", id: "ml", text: "മലയാളം" },
{ value: "Marathi", id: "mr", text: "मराठी" },
{ value: "Odia", id: "or", text: "ଓଡିଆ" },
{ value: "Punjabi", id: "pa", text: "ਪੰਜਾਬੀ" },
{ value: "Tamil", id: "ta", text: "தமிழ்" },
{ value: "Telugu", id: "te", text: "తెలుగు" }];

const BADGE_SEQUENCE = {
  '': '',
  'Bronze': '1st',
  'Silver': '2nd',
  'Gold': '3rd',
  'Platinum': '4th'
};

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
  BADGE_SEQUENCE,
  OPTIONAL_FIELD_MAX_LENGTH,
  FEEDBACK_RESPONSES
};
