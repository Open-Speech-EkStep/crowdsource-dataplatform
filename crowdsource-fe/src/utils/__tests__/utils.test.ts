import {
  convertIntoHrsFormat,
  roundOffValue,
  convertTimeFormat,
  formatTime,
  isSunoOrBoloInitiative,
  capitalizeFirstLetter,
  findInputError,
  getDeviceInfo,
  getBrowserInfo,
  groupBy,
  isBoloInitiative,
  getErrorMsg,
  isMobileDevice,
  getLanguageRank,
} from '../utils';
import '__fixtures__/mockComponentsWithSideEffects';

interface CumulativeDataByLanguage {
  total_contribution_count: number;
  total_contributions: number;
  total_validation_count: number;
  total_validations: number;
  type: 'asr' | 'ocr' | 'parallel' | 'text';
  total_speakers: number;
  language: string;
}

describe('Utils', () => {
  it('should test the convert into hrs format method', () => {
    const data = convertIntoHrsFormat(30 * 60 * 60);

    const expectedOutput = { hours: 30, minutes: 0, seconds: 0 };
    expect(data).toEqual(expectedOutput);
  });

  it('should test the convert into hrs format method without seconds', () => {
    const data = convertIntoHrsFormat(30 * 60 * 60, false);

    const expectedOutput = { hours: 30, minutes: 0 };
    expect(data).toEqual(expectedOutput);
  });

  it('should test the roundOffValue method', () => {
    const roundValue = roundOffValue(0.0275, 1);

    const expectedOutput = '0.0';
    expect(roundValue).toEqual(expectedOutput);
  });

  it('should test the convertTimeFormat method', () => {
    const convertedTime = convertTimeFormat('3.456');

    const expectedOutput = '3 hours1 27 minutes1';
    expect(convertedTime).toEqual(expectedOutput);
  });

  it('should test the format time method', () => {
    const formatedTime = formatTime(3, 45, 23);

    const expectedOutput = '3 hours1 45 minutes1';
    expect(formatedTime).toEqual(expectedOutput);
  });

  it('should test the format time method with "0"', () => {
    const formatedTime = formatTime(0, 0, 0);

    const expectedOutput = '0 seconds1';
    expect(formatedTime).toEqual(expectedOutput);
  });

  it('should test the format time method with hrs & minute "0" but seconds greater than "0"', () => {
    const formatedTime = formatTime(0, 0, 0.45);

    const expectedOutput = '0.45 seconds1';
    expect(formatedTime).toEqual(expectedOutput);
  });

  it('should test the format time method with "no minutes and seconds" paramter', () => {
    const formatedTime = formatTime(0);

    const expectedOutput = '0 seconds1';
    expect(formatedTime).toEqual(expectedOutput);
  });

  it('should test the format time method return the default "english translation string"', () => {
    const formatedTime = formatTime(0, 45, 50);

    const expectedOutput = '45 minutes1';
    expect(formatedTime).toEqual(expectedOutput);
  });

  it('should test the isSunoOrBoloInitiative method', () => {
    const roundValue = isSunoOrBoloInitiative('asr');

    const expectedOutput = true;
    expect(roundValue).toEqual(expectedOutput);
  });

  it('should test the isBoloInitiative method', () => {
    const roundValue = isBoloInitiative('text');

    const expectedOutput = true;
    expect(roundValue).toEqual(expectedOutput);
  });

  it('should test the capitalizeFirstLetter method', () => {
    const capitalizeValue = capitalizeFirstLetter('suno');

    const expectedOutput = 'Suno';
    expect(capitalizeValue).toEqual(expectedOutput);
  });

  it('should test the findInputError method', () => {
    const errorType = findInputError('suno', 'parallel', 'Hindi');

    const expectedOutput = { type: 'language', errorTextKey: expect.anything() };
    expect(errorType).toEqual(expectedOutput);

    const errorType2 = findInputError('abc', 'asr', 'English');

    expect(errorType2).toEqual(undefined);

    const errorType3 = findInputError('abc@', 'asr', 'English');

    const expectedOutput3 = { type: 'symbol', errorTextKey: expect.anything() };
    expect(errorType3).toEqual(expectedOutput3);
  });

  it('should test the device info method', () => {
    const deviceInfo = getDeviceInfo();

    const expectedOutput = 'android 11';
    expect(deviceInfo).toEqual(expectedOutput);
  });

  it('should test the browser info method', () => {
    const browserInfo = getBrowserInfo();

    const expectedOutput = 'Chrome 13';
    expect(browserInfo).toEqual(expectedOutput);
  });

  it('should group the given list of data on the basis of provided key', () => {
    const data = [
      { 1: 'asr', 2: 'two' },
      { 1: 'ocr', 2: '2' },
      { 1: 'ocr', 2: 'xyz' },
      { 1: 'text', 2: '2' },
    ];
    const groupedData = groupBy(data, '1');
    const expectedOutput = {
      asr: [{ '1': 'asr', '2': 'two' }],
      ocr: [
        { '1': 'ocr', '2': '2' },
        { '1': 'ocr', '2': 'xyz' },
      ],
      text: [{ '1': 'text', '2': '2' }],
    };
    expect(groupedData).toEqual(expectedOutput);
  });

  it('should give empty list of data when provided given list is empty or not a list', () => {
    const data: never[] = [];
    const groupedData = groupBy(data, '1');
    const expectedOutput: any[] = [];
    expect(groupedData).toEqual(expectedOutput);
  });

  it('should give empty list of data when provided key is not present in given data', () => {
    const data = [
      { 1: 'asr', 2: 'two' },
      { 1: 'ocr', 2: '2' },
      { 1: 'ocr', 2: 'xyz' },
      { 1: 'text', 2: '2' },
    ];
    const groupedData = groupBy(data, '3');
    const expectedOutput: any[] = [];
    expect(groupedData).toEqual(expectedOutput);
  });

  it('should return the error meessage on the basis of error code', () => {
    const error = {
      status: 404,
    };

    const multipleRequestError = {
      status: 503,
    };

    const errorMsg = getErrorMsg(error);

    const multipleRequestErrorMsg = getErrorMsg(multipleRequestError);

    const expectedOutput = 'apiFailureError';
    const expectedMultipleRequestOutput = 'multipleRequestApiError';
    expect(errorMsg).toEqual(expectedOutput);

    expect(multipleRequestErrorMsg).toEqual(expectedMultipleRequestOutput);
  });

  it('should give false for desktop view', () => {
    expect(isMobileDevice()).toEqual(false);
  });

  it('should give 1st rank when langauge is on top', () => {
    const cumulativeDataByLanguage: Array<CumulativeDataByLanguage> = [
      {
        total_contribution_count: 5,
        total_contributions: 5.8,
        total_validation_count: 9.4,
        total_validations: 9.6,
        type: 'asr',
        total_speakers: 8,
        language: 'English',
      },
      {
        total_contribution_count: 7,
        total_contributions: 7.8,
        total_validation_count: 8,
        total_validations: 8.9,
        type: 'asr',
        total_speakers: 9,
        language: 'Hindi',
      },
      {
        total_contribution_count: 7,
        total_contributions: 7.8,
        total_validation_count: 8,
        total_validations: 8.9,
        type: 'ocr',
        total_speakers: 10,
        language: 'English',
      },
    ];

    const rank = getLanguageRank(cumulativeDataByLanguage, 'asr', 'total_validation_count', 'English');
    expect(rank).toEqual(1);
  });

  it('should give 0 rank when data is not present is on top', () => {
    const rank = getLanguageRank([], 'asr', 'total_validation_count', 'English');
    expect(rank).toEqual(0);
  });

  it('should give 0 rank when initiativeType is not present in data', () => {
    const cumulativeDataByLanguage: Array<CumulativeDataByLanguage> = [
      {
        total_contribution_count: 5,
        total_contributions: 5.8,
        total_validation_count: 9.4,
        total_validations: 9.6,
        type: 'asr',
        total_speakers: 8,
        language: 'English',
      },
      {
        total_contribution_count: 7,
        total_contributions: 7.8,
        total_validation_count: 8,
        total_validations: 8.9,
        type: 'asr',
        total_speakers: 9,
        language: 'Hindi',
      },
    ];
    const rank = getLanguageRank(cumulativeDataByLanguage, 'ocr', 'total_validation_count', 'English');
    expect(rank).toEqual(0);
  });

  it('should give 0 rank when language is not present in list', () => {
    const cumulativeDataByLanguage: Array<CumulativeDataByLanguage> = [
      {
        total_contribution_count: 5,
        total_contributions: 5.8,
        total_validation_count: 9.4,
        total_validations: 9.6,
        type: 'asr',
        total_speakers: 8,
        language: 'English',
      },
      {
        total_contribution_count: 7,
        total_contributions: 7.8,
        total_validation_count: 8,
        total_validations: 8.9,
        type: 'asr',
        total_speakers: 9,
        language: 'Hindi',
      },
    ];
    const rank = getLanguageRank(cumulativeDataByLanguage, 'asr', 'total_validation_count', 'Odia');
    expect(rank).toEqual(0);
  });

  it('should give last rank when language is in bottom', () => {
    const cumulativeDataByLanguage: Array<CumulativeDataByLanguage> = [
      {
        total_contribution_count: 5,
        total_contributions: 5.8,
        total_validation_count: 9.4,
        total_validations: 9.6,
        type: 'asr',
        total_speakers: 8,
        language: 'English',
      },
      {
        total_contribution_count: 7,
        total_contributions: 7.8,
        total_validation_count: 8,
        total_validations: 8.9,
        type: 'asr',
        total_speakers: 9,
        language: 'Hindi',
      },
    ];
    const rank = getLanguageRank(cumulativeDataByLanguage, 'asr', 'total_validation_count', 'Hindi');
    expect(rank).toEqual(2);
  });
});
