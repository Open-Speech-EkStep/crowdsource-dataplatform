import { Validator } from './validator'
import levenshtein from 'js-levenshtein';
import {LANGUAGE_CONFIG_OCR} from './constants';

export class Levenstein implements Validator {
    validate(language: string, ref: string, hyp: string): boolean {
        let ref_ocr = ref.split(' ').join('');
        let hyp_ocr = hyp.split(' ').join('');
        let mismatch_count = levenshtein(hyp_ocr, ref_ocr);
        console.log('mismatchCount', mismatch_count)
        let score = 1 - (mismatch_count / hyp_ocr.length);
        console.log('score', score)
        return score < LANGUAGE_CONFIG_OCR[language];

    }
}