import type { Validator } from 'types/Validator';

export class TruthyValidator implements Validator {
  validate(language: string, ref: string, hyp: string): boolean {
    console.log(language, ref, hyp);
    return true;
  }
}
