"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LevensteinValidator_1 = require("./LevensteinValidator");
const WERValidator_1 = require("./WERValidator");
const TruthyValidator_1 = require("./TruthyValidator");
const BleuScoreValidator_1 = require("./BleuScoreValidator");
exports.default = {
    'asr': new WERValidator_1.Wer().validate,
    'parallel': new BleuScoreValidator_1.BleuScore().validate,
    'ocr': new LevensteinValidator_1.Levenstein().validate,
    'text': new TruthyValidator_1.TruthyValidator().validate
};
