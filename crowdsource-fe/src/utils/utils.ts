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
  return strValue.charAt(0).toUpperCase() + strValue.slice(1);
};

export const formatTime = (hours: number, minutes = 0, seconds = 0) => {
  const hrStr = 'hours';
  const minStr = 'minutes';
  const secStr = 'seconds';
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

export const isSunoOrBoloInitiative = (value: string) => {
  const boloOrSuno = ['suno', 'bolo'];
  return boloOrSuno.includes(value);
};
