import { Levenstein } from '../../src/validations/LevensteinValidator'

describe('Levenstein', () => {

    it('should call validate with english and same text should return true', () => {
        const levenstein = new Levenstein()
        expect(levenstein).toBeInstanceOf(Levenstein);

        let result = levenstein.validate('English', "test", "test")

        expect(result).toBeTruthy()

    })

    it('should call validate with Tamil or language which does not exist in the constant array and same text should return true', () => {
        const levenstein = new Levenstein()
        expect(levenstein).toBeInstanceOf(Levenstein);

        let result = levenstein.validate('Tamil', "test", "test1234567890")

        expect(result).toBeTruthy()

    })

    it('should call validate with english and different text should return false', () => {
        const levenstein = new Levenstein()
        expect(levenstein).toBeInstanceOf(Levenstein);

        let result = levenstein.validate('English', "testone", "test")

        expect(result).toBeFalsy()

    })
})