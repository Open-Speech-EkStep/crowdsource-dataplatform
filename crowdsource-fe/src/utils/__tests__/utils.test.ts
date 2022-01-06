import { waitFor } from '@testing-library/react';

import {
  convertIntoHrsFormat,
  roundOffValue,
  convertTimeFormat,
  formatTime,
  isTtsOrAsrInitiative,
  capitalizeFirstLetter,
  findInputError,
  getDeviceInfo,
  getBrowserInfo,
  groupBy,
  isAsrInitiative,
  getErrorMsg,
  isMobileDevice,
  getLanguageRank,
  getHoursValue,
  getHoursText,
  fetchLocationInfo,
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

  it('should test the isTtsOrAsrInitiative method', () => {
    const roundValue = isTtsOrAsrInitiative('asr');

    const expectedOutput = true;
    expect(roundValue).toEqual(expectedOutput);
  });

  it('should test the isAsrInitiative method', () => {
    const roundValue = isAsrInitiative('text');

    const expectedOutput = true;
    expect(roundValue).toEqual(expectedOutput);
  });

  it('should test the capitalizeFirstLetter method', () => {
    const capitalizeValue = capitalizeFirstLetter('tts');

    const expectedOutput = 'Tts';
    expect(capitalizeValue).toEqual(expectedOutput);
  });

  it('should test the findInputError method', () => {
    const errorType = findInputError('tts', 'Hindi');

    const expectedOutput = { type: 'language', errorTextKey: expect.anything() };
    expect(errorType).toEqual(expectedOutput);

    const errorType2 = findInputError('abc', 'English');

    expect(errorType2).toEqual(undefined);
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
    Object.defineProperty(window.navigator, 'userAgent', { value: 'Desktop', configurable: true });
    expect(isMobileDevice()).toEqual(false);
  });

  it('should give true for Android mobile view', () => {
    Object.defineProperty(window.navigator, 'userAgent', { value: 'Android', configurable: true });
    expect(isMobileDevice()).toEqual(true);
  });

  it('should test the getHoursValue method', () => {
    const roundedValue = getHoursValue(25);
    expect(roundedValue).toEqual(25);
  });

  it('should test the getHoursText method', () => {
    const roundedValue = getHoursText(25);
    expect(roundedValue).toEqual('25 hours2');
  });

  it('should test the fetchLocationInfo for given ipAddress method', async () => {
    const mockIpAddress = 'dummyAddress';

    fetchMock
      .doMockOnceIf('https://www.cloudflare.com/cdn-cgi/trace')
      .mockResponseOnce(`ip=${mockIpAddress}`);

    fetchMock.doMockOnceIf(`/location-info?ip=${mockIpAddress}`).mockResponseOnce(
      JSON.stringify({
        state: 'Uttar Pradesh',
        region: 'India',
      })
    );

    await fetchLocationInfo();
    expect(fetchMock).toBeCalledWith('https://www.cloudflare.com/cdn-cgi/trace');

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/location-info?ip=dummyAddress');
    });
  });

  it('should test the fetchLocationInfo for invalid ipAddressText method', async () => {
    const mockIpAddress = 'dummyAddress';

    fetchMock.doMockOnceIf('https://www.cloudflare.com/cdn-cgi/trace').mockResponseOnce(`${mockIpAddress}`);

    await expect(fetchLocationInfo()).rejects.toEqual('Ip Address not available');
  });

  it('should test the fetchLocationInfo for no ipAddress method', async () => {
    const mockIpAddress = '';

    fetchMock
      .doMockOnceIf('https://www.cloudflare.com/cdn-cgi/trace')
      .mockResponseOnce(`ip=${mockIpAddress}`);

    await expect(fetchLocationInfo()).rejects.toEqual('Ip Address not available');
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
        total_validation_count: 10,
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
