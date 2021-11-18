import { jsPDF } from 'jspdf';
import { i18n } from 'next-i18next';

import { ErrorStatusCode } from 'constants/errorStatusCode';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import { KEYBOARD_ERROR, LANGUAGE_UNICODE, OTHER_LANGUAGE_UNICODE } from 'constants/Keyboard';
import type { InitiativeType } from 'types/InitiativeType';

import apiPaths from '../constants/apiPaths';

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
  const hrStr = translateText('hours1');
  const minStr = translateText('minutes1');
  const secStr = translateText('seconds1');
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

const roundDuration = (value: number) => {
  return Math.round(value * 100) / 100;
};

export const getHoursValue = (value: any) => {
  return roundDuration(value);
};

export const getMinutesValue = (value: any) => {
  return roundDuration(value * 60);
};

export const getHoursText = (value: any) => {
  return `${getHoursValue(value)} ${i18n?.t('hours2')}`;
};

export const getMinutesText = (value: any) => {
  return `${getMinutesValue(value)} ${i18n?.t('minutes2')}`;
};

export const isSunoOrBoloInitiative = (value: InitiativeType) => {
  const boloOrSuno = ['asr', 'text'];
  return boloOrSuno.includes(value);
};

export const isBoloInitiative = (value: InitiativeType) => {
  const boloOrSuno = ['text'];
  return boloOrSuno.includes(value);
};

export const findInputError = (text: string, currentModule: string, language: string) => {
  if (!text.length) return;
  const newText = text.replace(/\s/g, ''); //read input value, and remove "space" by replace \s
  let error: any = KEYBOARD_ERROR.language;
  const isSunoModule = currentModule === INITIATIVES_MAPPING.suno;
  const specialSymbols = /[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u0964-\u0965]/;
  if (currentModule === INITIATIVES_MAPPING.suno && specialSymbols.test(newText) === true) {
    return KEYBOARD_ERROR.symbol;
  }
  Object.entries(isSunoModule ? LANGUAGE_UNICODE : OTHER_LANGUAGE_UNICODE).forEach(([key, value]) => {
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
        const data = await fetch(`${apiPaths.locationInfo}?ip=${ipAddress}`);
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

export const downloadBadge = (
  locale: string | undefined,
  initiative: string,
  source: string,
  badgeType: string,
  badgeId: string
) => {
  const pdf = new jsPDF();
  const img = new Image();
  img.src = `/images/${locale}/badges/${locale}_${initiative}_${badgeType}_${source}.png`;
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    pdf.addImage(img, 50, 10, 105, 130);
    pdf.save(`${badgeType}-badge.pdf`);
  };

  pdf.text(`Badge Id : ${badgeId}`, 36, 190);
};

export const groupBy = function (list: any, keyName: any) {
  if (!list || list.length === 0 || !list[0][keyName]) {
    return [];
  }
  return list.reduce(function (pair: any, key: any) {
    (pair[key[keyName]] = pair[key[keyName]] || []).push(key);
    return pair;
  }, {});
};

/* istanbul ignore next */
export const visualize = (visualizer: any, analyser: any) => {
  const canvasCtx = visualizer.getContext('2d');
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const WIDTH = visualizer.width;
  const HEIGHT = visualizer.height;
  // TODO do we need to limit the number of time visualize refreshes per second
  // so that it can run on Android processors without causing audio to drop?
  function draw() {
    // this is more efficient than calling with processor.onaudioprocess
    // and sending floatarray with each call...
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    // canvasCtx.fillStyle = 'rgb(255, 255, 255, 0)';
    // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0,123,255)';
    canvasCtx.beginPath();
    const sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0; // uint8
      let y = (v * HEIGHT) / 2; // uint8
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    canvasCtx.lineTo(visualizer.width, visualizer.height / 2);
    canvasCtx.stroke();
  }

  draw();
};

export const getErrorMsg = (error: any) => {
  if (error && error.status === ErrorStatusCode.TOO_MANY_REQUEST) {
    return 'multipleRequestApiError';
  } else {
    return 'apiFailureError';
  }
};
