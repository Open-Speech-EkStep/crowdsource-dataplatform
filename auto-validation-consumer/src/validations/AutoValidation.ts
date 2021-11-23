import { BleuScore } from "./BleuScoreValidator";
import { Levenstein } from "./LevensteinValidator";
import { Wer } from "./WERValidator";
import { TruthyValidator } from "./TruthyValidator"

export default {
    'asr': new Wer().validate,
    'parallel': new BleuScore().validate,
    'ocr': new Levenstein().validate,
    'text': new TruthyValidator().validate
}