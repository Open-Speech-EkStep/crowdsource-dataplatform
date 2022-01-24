import { BleuScore } from '../../src/validations/BleuScoreValidator'

describe('BleuScore', () => {

    it('should call validate with hindi english and same text', () => {
        const bleuScore = new BleuScore()
        expect(bleuScore).toBeInstanceOf(BleuScore);

        let result = bleuScore.validate('Hindi-English', "this is a test", "this is a test")

        expect(result).toBe(true)

    })

    it('should call validate with assamese english and same text', () => {
        const bleuScore = new BleuScore()
        expect(bleuScore).toBeInstanceOf(BleuScore);

        let result = bleuScore.validate('Assamese-English', "this is a test", "test this a is this test a test this test this a is this test a test this")

        expect(result).toBeFalsy()

    })
    it('should call validate with assamese english and same text 2', () => {
        const bleuScore = new BleuScore()
        expect(bleuScore).toBeInstanceOf(BleuScore);

        let result = bleuScore.validate('Assamese-English', "abcd", " x y z")

        expect(result).toBeFalsy()

    })
})