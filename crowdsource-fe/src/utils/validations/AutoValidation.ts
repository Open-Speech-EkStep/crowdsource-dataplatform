// import { BleuScore } from "./BleuScoreValidator";
import { Levenstein } from './LevensteinValidator';
import { TruthyValidator } from './TruthyValidator';
import { Wer } from './WERValidator';

const AutoValidation = {
  asr: new Wer().validate,
  parallel: new TruthyValidator().validate,
  ocr: new Levenstein().validate,
  text: new TruthyValidator().validate,
};

export default AutoValidation;
