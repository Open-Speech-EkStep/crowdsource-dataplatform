import levenshtein from 'js-levenshtein';

import { LANGUAGE_CONFIG_OCR } from 'constants/languageConfigConstants';
import type { Validator } from 'types/Validator';

export class Levenstein implements Validator {
  validate(language: string, ref: string, hyp: string): boolean {
    let ref_ocr = ref.split(' ').join('');
    let hyp_ocr = hyp.split(' ').join('');
    let mismatch_count = levenshtein(hyp_ocr, ref_ocr);
    let score = 1 - mismatch_count / hyp_ocr.length;
    const languageText = language as keyof typeof LANGUAGE_CONFIG_OCR;
    return score >= (LANGUAGE_CONFIG_OCR[languageText] || -1);
  }
}
