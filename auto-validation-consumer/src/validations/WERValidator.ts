import { calculateEditDistance } from "word-error-rate";

import { Validator } from '../types/validator'
import { LANGUAGE_CONFIG_ASR } from '../constants/constants';


export class Wer implements Validator {
    validate(language: string, ref: string, hyp: string): boolean {
        const wordCount = ref.split(" ").length;

        let wer = calculateEditDistance(ref, hyp) / wordCount

        console.log('score', wer)
        console.log('value', LANGUAGE_CONFIG_ASR[language])
        return wer <= (LANGUAGE_CONFIG_ASR[language] || 2)

    }
}