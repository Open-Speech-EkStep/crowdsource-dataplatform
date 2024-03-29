import { i18n } from 'next-i18next';

import { ErrorStatusCode } from 'constants/errorStatusCode';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import type { LANGUAGE_UNICODE } from 'constants/Keyboard';
import { TEXT_INPUT_ERROR_CONFIG, OTHER_LANGUAGE_UNICODE } from 'constants/Keyboard';
import nodeConfig from 'constants/nodeConfig';
import type { CumulativeDataByLanguage } from 'types/CumulativeDataByLanguage';
import type { Initiative } from 'types/Initiatives';
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

export const isTtsOrAsrInitiative = (value: InitiativeType) => {
  const asrOrTts = ['asr', 'text'];
  return asrOrTts.includes(value);
};

export const isAsrInitiative = (value: InitiativeType) => {
  const asrOrTts = ['text'];
  return asrOrTts.includes(value);
};

const hasIncorrectLanguageText = (
  language: string,
  text: string,
  languagePattern: typeof LANGUAGE_UNICODE
) => {
  let flag = true;
  Object.entries(languagePattern).forEach(([languageText, languageUnicode]) => {
    if (languageText.toLowerCase() === language.toLowerCase() && languageUnicode.test(text)) {
      flag = false;
    }
  });
  return flag;
};

export const findInputError = (text: string, language: string) => {
  if (!text.length) return;
  const newText = text.replace(/\s/g, ''); //read input value, and remove "space" by replace \s
  const unicode = OTHER_LANGUAGE_UNICODE;
  if (hasIncorrectLanguageText(language, newText, unicode)) {
    return TEXT_INPUT_ERROR_CONFIG.language;
  }
  return;
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

export const downloadBadge = async (
  locale: string | undefined,
  initiative: Initiative,
  source: string,
  badgeType: string,
  badgeId: string
) => {
  const jsPDF = (await import('jspdf')).jsPDF;
  const pdf = new jsPDF();
  const img = new Image();
  img.src = `${nodeConfig.contextRoot}/images/${nodeConfig.brand}/${locale}/badges/${locale}_${INITIATIVES_MAPPING[initiative]}_${badgeType}_${source}.png`;
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
  if (error && error.status === ErrorStatusCode.SERVICE_UNAVAILABLE) {
    return 'multipleRequestApiError';
  } else {
    return 'apiFailureError';
  }
};

export const isMobileDevice = () => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    return true;
  } else {
    // false for not mobile device
    return false;
  }
};

export const getLanguageRank = (
  cumulativeDataByLanguage: Array<CumulativeDataByLanguage>,
  initiative: InitiativeType,
  contributionType: string,
  contributionLanguage: string
) => {
  const langaugeDataByInitiative = cumulativeDataByLanguage?.filter(
    dataByLanguage => dataByLanguage.type === initiative
  );

  const sortingLanguages = langaugeDataByInitiative.sort((a: any, b: any) =>
    Number(a[contributionType]) > Number(b[contributionType]) ? -1 : 1
  );

  const rank = sortingLanguages.findIndex(x => {
    return x.language.toLowerCase() == contributionLanguage.toLowerCase();
  });

  return rank + 1;
};

export const isLanguageImageAvailable = (language: string | undefined) => {
  const hasLanguageImages = nodeConfig.hasLanguage_image;
  return hasLanguageImages.find(item => item === language) || 'en';
};
