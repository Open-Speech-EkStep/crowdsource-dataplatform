import assert from 'assert'
import {BleuScore} from '../../src/validations/BleuScoreValidator'

describe('BleuScore',()=>{

    it('should call validate with english and ',()=>{
        const bleuScore = new BleuScore()
        expect(bleuScore).toBeInstanceOf(BleuScore);

        let result = bleuScore.validate('English',"abcafasfafagafsggreafesgrre","abcndnjknak")

        expect(result).toBeTruthy()

    })
})