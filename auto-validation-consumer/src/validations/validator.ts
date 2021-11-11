export interface Validator {
    validate(language: string, ref: string, hyp: string): boolean
}