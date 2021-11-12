import assert from 'assert'
import {Wer} from '../../src/validations/WERValidator'

describe('Wer',()=>{

    const wer = new Wer()

    it('should call validate with english and same text should return true',()=>{
        expect(wer).toBeInstanceOf(Wer);

        let result = wer.validate('English',"test","test")

        expect(result).toBeTruthy()

    })

    it('should call validate with english and different text should return true',()=>{
        expect(wer).toBeInstanceOf(Wer);

        let result = wer.validate('English',"test one","add two")

        expect(result).toBeFalsy()

    })
})