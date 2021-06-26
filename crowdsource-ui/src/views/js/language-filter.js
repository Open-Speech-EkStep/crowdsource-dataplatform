const LANGUAGES = [
    { value: "Assamese", id: "as", text: "অসমীয়া", hasLocaleText: false, data: true },
    { value: "Bengali", id: "bn", text: "বাংলা", hasLocaleText: false, data: true },
    { value: "English", id: "en", text: "English", hasLocaleText: true, data: true },
    { value: "Gujarati", id: "gu", text: "ગુજરાતી", hasLocaleText: false, data: true },
    { value: "Hindi", id: "hi", text: "हिंदी", hasLocaleText: true, data: true },
    { value: "Kannada", id: "kn", text: "ಕನ್ನಡ", hasLocaleText: false, data: true },
    { value: "Malayalam", id: "ml", text: "മലയാളം", hasLocaleText: false, data: true },
    { value: "Marathi", id: "mr", text: "मराठी", hasLocaleText: false, data: true },
    { value: "Odia", id: "or", text: "ଓଡିଆ", hasLocaleText: false, data: true },
    { value: "Punjabi", id: "pa", text: "ਪੰਜਾਬੀ", hasLocaleText: false, data: true },
    { value: "Tamil", id: "ta", text: "தமிழ்", hasLocaleText: false, data: true },
    { value: "Telugu", id: "te", text: "తెలుగు", hasLocaleText: false, data: true },
    { value: "Kashmiri", id: "kas", text: "Kashmiri", hasLocaleText: false, data: true },
    { value: "Sindhi", id: "sd", text: "Sindhi", hasLocaleText: false, data: true },
    { value: "Konkani", id: "kok", text: "Konkani", hasLocaleText: false, data: true },
    { value: "Bodo", id: "bo", text: "Bodo", hasLocaleText: false, data: true },
    { value: "Manipuri", id: "mni", text: "Manipuri", hasLocaleText: false, data: true },
    { value: "Dogri", id: "doi", text: "Dogri", hasLocaleText: false, data: true },
    { value: "Nepali", id: "ne", text: "Nepali", hasLocaleText: false, data: true },
    { value: "Santali", id: "sat", text: "Santali", hasLocaleText: false, data: true },
    { value: "Sanskrit", id: "sa", text: "Sanskrit", hasLocaleText: false, data: true },
    { value: "Urdu", id: "ur", text: "Urdu", hasLocaleText: false, data: true },
    { value: "Maithili", id: "mai", text: "Maithili", hasLocaleText: false, data: true }
];

function getEnabledLanguages(enabled_languages) {
    return LANGUAGES.filter(l => enabled_languages.includes(l.id))
}

function getAllLanguages() {
    return LANGUAGES
}

module.exports = {
    getEnabledLanguages,
    getAllLanguages
}