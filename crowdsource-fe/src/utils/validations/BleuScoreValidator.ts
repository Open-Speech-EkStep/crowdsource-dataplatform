import { LANGUAGE_CONFIG_PARALLEL } from 'constants/languageConfigConstants';
import type { Validator } from 'types/Validator';

import { scoreSegment } from './ibleu';

export class BleuScore implements Validator {
  validate(language: string, ref: string, hyp: string): boolean {
    let bleuScore = scoreSegment(hyp, ref);
    const languageText = language as keyof typeof LANGUAGE_CONFIG_PARALLEL;
    return bleuScore >= (LANGUAGE_CONFIG_PARALLEL[languageText] || -1);
  }
}
