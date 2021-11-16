import assert from 'assert'
import {BleuScore} from '../../src/validations/BleuScoreValidator'

describe('BleuScore',()=>{

    it('should call validate with english and same text',()=>{
        const bleuScore = new BleuScore()
        expect(bleuScore).toBeInstanceOf(BleuScore);

        let result = bleuScore.validate('English',"this is a test","this is a test")

        expect(result).toBeTruthy()

    })

    it('should call validate with english and same text',()=>{
        const bleuScore = new BleuScore()
        expect(bleuScore).toBeInstanceOf(BleuScore);

        let result = bleuScore.validate('English',"this is a test","this is a test a")

        expect(result).toBeFalsy()

    })
})