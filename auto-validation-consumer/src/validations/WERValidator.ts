import {calculateEditDistance} from "word-error-rate";

import { Validator } from './validator'
import { LANGUAGE_CONFIG_ASR } from './constants';


export class Wer implements Validator {
    validate(language: string, ref: string, hyp: string): boolean {
        const wordCount = ref.split(" ").length;

        let wer = calculateEditDistance(ref, hyp) / wordCount

        console.log('WER',wer)

        return wer < LANGUAGE_CONFIG_ASR[language]

    }
}