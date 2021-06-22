const {readFileSync} = require('fs');
import origFetch from 'node-fetch';
const {stringToHTML} = require('../utils');
const {getLanguageGoalForModules} = require('../../build/js/common/platformCardSection');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/platformCardSection.ejs`, 'UTF-8')+
  readFileSync(`${__dirname}/../../src/views/home.ejs`, 'UTF-8')
);

jest.mock('node-fetch');

describe("getLanguageGoalForModules", () => {
  test("should set language goal and available languages", () => {
    const respBoloGoal = {ok:true, json:()=> {return {goal: 400};}}
    const respBoloLanguages = {ok:true, json:()=> {return {datasetLanguages: [1,2,3,4,5,6]};}}
    const respSunoGoal= {ok:true, json:()=> {return {goal: 200};}}
    const respSunoLanguages= {ok:true, json:()=> {return {datasetLanguages: [1,2,3,4]};}}
    const respLikhoGoal = {ok:true, json:()=> {return {goal: 300};}}
    const respLikhoLanguages = {ok:true, json:()=> {return {datasetLanguages: [1,2,3]};}}
    const respDekhoGoal = {ok:true, json:()=> {return {goal: 50};}}
    const respDekhoLanguages = {ok:true, json:()=> {return {datasetLanguages: [1,2]};}}

    origFetch
      .mockResolvedValueOnce(respSunoGoal)
      .mockResolvedValueOnce(respSunoLanguages)
      .mockResolvedValueOnce(respBoloGoal)
      .mockResolvedValueOnce(respBoloLanguages)
      .mockResolvedValueOnce(respLikhoGoal)
      .mockResolvedValueOnce(respLikhoLanguages)
      .mockResolvedValueOnce(respDekhoGoal)
      .mockResolvedValueOnce(respDekhoLanguages)

    getLanguageGoalForModules().then(res => {
      expect(origFetch).toHaveBeenCalledWith('@@apiUrl/language-goal/text/English/contribute',{"credentials": "include", "mode": "cors"})
      expect(origFetch).toHaveBeenCalledWith('@@apiUrl/language-goal/asr/English/contribute',{"credentials": "include", "mode": "cors"})
      expect(origFetch).toHaveBeenCalledWith('@@apiUrl/language-goal/parallel/English/contribute',{"credentials": "include", "mode": "cors"})
      expect(origFetch).toHaveBeenCalledWith('@@apiUrl/language-goal/ocr/English/contribute',{"credentials": "include", "mode": "cors"})
      expect(origFetch).toHaveBeenCalledWith('@@apiUrl/available-languages/ocr',{"credentials": "include", "mode": "cors"})
      expect(origFetch).toHaveBeenCalledWith('@@apiUrl/available-languages/parallel',{"credentials": "include", "mode": "cors"})
      expect(origFetch).toHaveBeenCalledWith('@@apiUrl/available-languages/asr',{"credentials": "include", "mode": "cors"})
      expect(origFetch).toHaveBeenCalledWith('@@apiUrl/available-languages/text',{"credentials": "include", "mode": "cors"})

      const resData = [
        [{goal: 200},{datasetLanguages: [1,2,3,4]}],
        [{goal: 400},{datasetLanguages: [1,2,3,4,5,6]}],
        [{goal: 300},{datasetLanguages: [1,2,3]}],
        [{goal: 50},{datasetLanguages: [1,2]}],
      ]
      expect(res).toEqual(resData)
    }).then(()=>{
      jest.clearAllMocks()
    }).catch(err=>{
      console.log(err)
    })
  })
})