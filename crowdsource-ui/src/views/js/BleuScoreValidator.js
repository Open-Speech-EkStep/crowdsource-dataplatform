"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleuScore = void 0;
const constants_1 = require("./autoValidationConstants");
const ibleu_1 = require("./ibleu");
class BleuScore {
    validate(language, ref, hyp) {
        let bleuScore = (0, ibleu_1.scoreSegment)(hyp, ref);
        return bleuScore >= (constants_1.LANGUAGE_CONFIG_PARALLEL[language] || -1);
    }
}
exports.BleuScore = BleuScore;
