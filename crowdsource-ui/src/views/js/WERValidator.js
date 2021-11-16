"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wer = void 0;
const word_error_rate_1 = require("word-error-rate");
const constants_1 = require("./autoValidationConstants");
class Wer {
    validate(language, ref, hyp) {
        const wordCount = ref.split(" ").length;
        let wer = (0, word_error_rate_1.calculateEditDistance)(ref, hyp) / wordCount;
        return wer < (constants_1.LANGUAGE_CONFIG_ASR[language] || 2);
    }
}
exports.Wer = Wer;
