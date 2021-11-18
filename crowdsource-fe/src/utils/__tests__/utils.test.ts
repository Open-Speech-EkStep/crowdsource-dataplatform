import {
  convertIntoHrsFormat,
  roundOffValue,
  convertTimeFormat,
  formatTime,
  isSunoOrBoloInitiative,
  capitalizeFirstLetter,
  verifyLanguage,
  getDeviceInfo,
  getBrowserInfo,
  groupBy,
  isBoloInitiative,
  getErrorMsg,
} from '../utils';
import '__fixtures__/mockComponentsWithSideEffects';

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

  it('should test the verifyLanguage method', () => {
    const errorType = verifyLanguage('suno', 'likho', 'Hindi');

    const expectedOutput = { type: 'language' };
    expect(errorType).toEqual(expectedOutput);

    const errorType2 = verifyLanguage('abc', 'suno', 'English');

    const expectedOutput2 = { type: '' };
    expect(errorType2).toEqual(expectedOutput2);

    const errorType3 = verifyLanguage('abc@', 'suno', 'English');

    const expectedOutput3 = { type: 'symbol' };
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
      status: 429,
    };

    const errorMsg = getErrorMsg(error);

    const multipleRequestErrorMsg = getErrorMsg(multipleRequestError);

    const expectedOutput = 'apiFailureError';
    const expectedMultipleRequestOutput = 'multipleRequestApiError';
    expect(errorMsg).toEqual(expectedOutput);

    expect(multipleRequestErrorMsg).toEqual(expectedMultipleRequestOutput);
  });
});
