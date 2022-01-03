import { calculateEditDistance } from 'word-error-rate';

import { LANGUAGE_CONFIG_ASR } from 'constants/languageConfigConstants';
import type { Validator } from 'types/Validator';

export class Wer implements Validator {
  validate(language: string, ref: string, hyp: string): boolean {
    const wordCount = ref.split(' ').length;

    let wer = calculateEditDistance(ref, hyp) / wordCount;
    const languageText = language as keyof typeof LANGUAGE_CONFIG_ASR;
    return wer <= (LANGUAGE_CONFIG_ASR[languageText] || 2);
  }
}
