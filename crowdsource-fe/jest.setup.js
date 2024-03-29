import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import jestFetchMock from 'jest-fetch-mock';
import preloadAll from 'jest-next-dynamic';

jest.mock('next/dist/client/router', () => {
  const router = require('next-router-mock');

  router.default.locales = ['as', 'bn', 'en', 'gu', 'hi', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];
  router.default.locale = 'en';

  return router;
});

jest.mock('react-i18next', () => {
  return {
    useTranslation: () => ({ t: key => key }),
    Trans: ({ defaults }) => defaults,
  };
});

jest.mock('next-i18next', () => ({
  ...jest.requireActual('next-i18next'),
  i18n: { t: key => key },
}));

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
});
expect.extend(toHaveNoViolations);

global.CROWDSOURCE_FE_NODE_CONFIG = {
  fe: {
    apiUrl: '',
    cdnUrl: '',
    staticFileUrl: '',
    whitelistingEmail: false,
    showDataSource: false,
    feedbackTopComponent: false,
    contextRoot: '',
    enabled_languages: ['as', 'bn', 'en', 'gu', 'hi', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'],
    enabled_locales: ['as', 'bn', 'en', 'gu', 'hi', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'],
    hasLanguage_image: ['as', 'bn', 'en', 'gu', 'hi', 'kn', 'ml', 'or', 'pa', 'ta', 'te'],
    autoValidation: true,
    appUrl: '',
    brand: 'vakyansh',
  },
};

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

jest.setTimeout(30000);

configure({
  asyncUtilTimeout: 15000,
});

console.error = message => {
  throw new Error(message);
};

// Mock data and helper methods
global.window.HTMLMediaElement.prototype._mock = {
  paused: false,
  _loaded: false,
  // Emulates the audio file loading
  _load: function audioInit(audio) {
    audio.dispatchEvent(new Event('loadedmetadata'));
    audio.dispatchEvent(new Event('canplaythrough'));
  },
  // Reset audio object mock data to the initial state
  _resetMock: function resetMock(audio) {
    audio._mock = Object.assign({}, global.window.HTMLMediaElement.prototype._mock);
  },
};

// Start the playback.
global.window.HTMLMediaElement.prototype.play = function playMock() {
  if (!this._mock._loaded) {
    // emulate the audio file load and metadata initialization
    this._mock._load(this);
  }
  this._mock.paused = false;
  this.dispatchEvent(new Event('play'));
};

// Pause the playback
global.window.HTMLMediaElement.prototype.pause = function pauseMock() {
  this._mock.paused = true;
  // this.dispatchEvent(new Event('pause'));
};

beforeAll(async () => {
  await preloadAll();
});

beforeEach(() => {
  jestFetchMock.enableMocks();

  localStorage.clear();

  jest.spyOn(Storage.prototype, 'getItem');
  jest.spyOn(Storage.prototype, 'setItem');
  jest.spyOn(Storage.prototype, 'removeItem');

  const platform = jest.requireActual('platform');
  Object.defineProperty(platform, 'version', {
    get: () => 13,
    configurable: true,
  });
  Object.defineProperty(platform, 'name', {
    get: () => 'Chrome',
    configurable: true,
  });

  Object.defineProperty(platform.os, 'version', {
    get: () => '11',
    configurable: true,
  });

  Object.defineProperty(platform.os, 'family', {
    get: () => 'android',
    configurable: true,
  });
  global.URL.createObjectURL = jest.fn();
  const event = {
    data: {
      size: 12816,
      type: 'audio/webm;codecs=opus',
    },
  };
  const mockMediaRecorder = {
    start: jest.fn(),
    ondataavailable: jest.fn(event => event),
    onerror: jest.fn(),
    state: '',
    onstop: jest.fn(() => {
      return {};
    }),
    stop: jest.fn(),
  };
  window.MediaRecorder = jest.fn().mockImplementation(() => mockMediaRecorder);
});

afterEach(() => {
  fetchMock.resetMocks();

  Storage.prototype.getItem.mockClear();
  Storage.prototype.setItem.mockClear();
  Storage.prototype.removeItem.mockClear();
});

class SVGPathElement extends HTMLElement {}

window.SVGPathElement = SVGPathElement;

const mockGetUserMedia = jest.fn(async () => {
  return new Promise(resolve => {
    resolve();
  });
});

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
});

const mockConnect = jest.fn();
const mockcreateMediaElementSource = jest.fn(() => {
  return {
    connect: mockConnect,
  };
});
const mockgetByteFrequencyData = jest.fn();
const mockgetByteTimeDomainData = jest.fn();
const mockcreateAnalyser = jest.fn(() => {
  return {
    connect: mockConnect,
    frequencyBinCount: [0, 1, 2],
    getByteFrequencyData: mockgetByteFrequencyData,
    getByteTimeDomainData: mockgetByteTimeDomainData,
  };
});
const mockcreateOscillator = jest.fn(() => {
  return {
    channelCount: 2,
  };
});
const mockChannelSplitterConnect = jest.fn(n => n);
const mockcreateChannelSplitter = jest.fn(() => {
  return {
    connect: mockChannelSplitterConnect,
  };
});

const mockcreateScriptProcessor = jest.fn(() => {
  return {
    connect: mockChannelSplitterConnect,
  };
});

const mockClose = jest.fn();

window.AudioContext = jest.fn().mockImplementation(() => {
  return {
    createAnalyser: mockcreateAnalyser,
    createMediaElementSource: mockcreateMediaElementSource,
    createMediaStreamSource: mockcreateMediaElementSource,
    createOscillator: mockcreateOscillator,
    createChannelSplitter: mockcreateChannelSplitter,
    createScriptProcessor: mockcreateScriptProcessor,
    close: mockClose,
  };
});

const mockClearRect = jest.fn();
const mockFillRect = jest.fn();
const mockBeginPath = jest.fn();
const mockMoveTo = jest.fn();
const mockStroke = jest.fn();

HTMLCanvasElement.prototype.getContext = () => {
  return {
    clearRect: mockClearRect,
    fillRect: mockFillRect,
    beginPath: mockBeginPath,
    lineTo: mockMoveTo,
    stroke: mockStroke,
  };
};
