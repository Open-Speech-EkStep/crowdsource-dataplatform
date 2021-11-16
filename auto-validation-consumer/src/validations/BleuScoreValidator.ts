import { Validator } from '../types/validator'

import { LANGUAGE_CONFIG_PARALLEL } from '../constants/constants'

import { scoreSegment } from './ibleu'


export class BleuScore implements Validator {
    validate(language: string, ref: string, hyp: string): boolean {
        let bleuScore = scoreSegment(hyp, ref)
        console.log(bleuScore)
        return bleuScore >= (LANGUAGE_CONFIG_PARALLEL[language] || 1)
    }
}
