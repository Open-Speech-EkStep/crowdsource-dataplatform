import { Validator } from './validator'

export class Wer implements Validator {
    validate(language: string, ref: string, hyp: string): boolean {
        //calculate wer  
        //return wer > 10
        return true;
    }
}