import { Validator } from '../types/validator'

export class TruthyValidator implements Validator {
    validate(language: string, ref: string, hyp: string): boolean {
        return true;
    }
}