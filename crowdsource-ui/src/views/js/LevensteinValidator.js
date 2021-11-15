"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Levenstein = void 0;
const js_levenshtein_1 = __importDefault(require("js-levenshtein"));
const constants_1 = require("./autoValidationConstants");
class Levenstein {
    validate(language, ref, hyp) {
        let ref_ocr = ref.split(' ').join('');
        let hyp_ocr = hyp.split(' ').join('');
        let mismatch_count = (0, js_levenshtein_1.default)(hyp_ocr, ref_ocr);
        let score = 1 - (mismatch_count / hyp_ocr.length);
        return score > (constants_1.LANGUAGE_CONFIG_OCR[language] || -1);
    }
}
exports.Levenstein = Levenstein;
