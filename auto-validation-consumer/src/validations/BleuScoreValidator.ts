import { Validator } from './validator'

export class BleuScore implements Validator {
    validate(language: string, ref: string, hyp: string): boolean {
        return true;
    }
}