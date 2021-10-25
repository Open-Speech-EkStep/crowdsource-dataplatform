import { i18n } from 'next-i18next';

import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import { KEYBOARD_ERROR, LANGUAGE_UNICODE } from 'constants/Keyboard';
import type { InitiativeType } from 'types/InitiativeType';

var platform = require('platform');

export const convertIntoHrsFormat = (data: any, isSeconds = true) => {
  const hours = Math.floor(data / 3600);
  const remainingAfterHours = data % 3600;
  const minutes = Math.floor(remainingAfterHours / 60);
  const seconds = Math.round(remainingAfterHours % 60);
  if (isSeconds) {
    return { hours, minutes, seconds };
  } else {
    return { hours, minutes };
  }
};

export const roundOffValue = (average: any, precision: number) => {
  const formattedAverage = average.toFixed(precision);
  return formattedAverage;
};

export const capitalizeFirstLetter = (strValue: string) => {
  return strValue?.charAt(0).toUpperCase() + strValue?.slice(1);
};

const translateText = (text: string) => i18n?.t(text);

export const formatTime = (hours: number, minutes = 0, seconds = 0) => {
  const hrStr = translateText('hours');
  const minStr = translateText('minutes');
  const secStr = translateText('seconds');
  let result = '';
  if (hours > 0) {
    result += `${hours} ${hrStr} `;
  }
  if (minutes > 0) {
    result += `${minutes} ${minStr} `;
  }
  if (hours === 0 && minutes === 0 && seconds > 0) {
    result += `${seconds} ${secStr} `;
  }

  if (hours === 0 && minutes === 0 && seconds === 0) {
    result += `0 ${secStr} `;
  }

  return result.substr(0, result.length - 1);
};

export const convertTimeFormat = (value: any) => {
  const { hours, minutes, seconds } = convertIntoHrsFormat(Number(value) * 60 * 60);
  const data = formatTime(hours, minutes, seconds);
  return data;
};

export const isSunoOrBoloInitiative = (value: InitiativeType) => {
  const boloOrSuno = ['asr', 'text'];
  return boloOrSuno.includes(value);
};

export const verifyLanguage = (text: string, currentModule: string, language: string) => {
  const newText = text.replace(/\s/g, ''); //read input value, and remove "space" by replace \s
  let error: any = KEYBOARD_ERROR.language;
  const specialSymbols = /[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u0964-\u0965]/;
  if (currentModule === INITIATIVES_MAPPING.suno && specialSymbols.test(newText) === true) {
    return KEYBOARD_ERROR.symbol;
  }
  Object.entries(LANGUAGE_UNICODE).forEach(([key, value]) => {
    if (value.test(newText)) {
      //Check Unicode to see which one is true
      if (key.toLowerCase() === language.toLowerCase()) {
        error = KEYBOARD_ERROR.noError;
      }
    }
  });
  return error;
};

export const fetchLocationInfo = async () => {
  const result = await fetch('https://www.cloudflare.com/cdn-cgi/trace')
    .then(res => res.text())
    .then(async ipAddressText => {
      const dataArray = ipAddressText.split('\n');
      let ipAddress = '';
      for (let ind in dataArray) {
        if (dataArray[ind].startsWith('ip=')) {
          ipAddress = dataArray[ind].replace('ip=', '');
          break;
        }
      }
      if (ipAddress.length !== 0) {
        const data = await fetch(`/location-info?ip=${ipAddress}`);
        return data && data.json();
      } else {
        return new Promise((resolve, reject) => {
          reject('Ip Address not available');
        });
      }
    });

  return result;
};

export const getDeviceInfo = () => {
  const os = platform.os;
  return os.family + ' ' + os.version;
};

export const getBrowserInfo = () => {
  return platform.name + ' ' + platform.version;
};
