jest.mock('node-fetch');
const origFetch = require('node-fetch');
const {
  calculateTime,
  formatTime,
  showElement,
  hideElement,
  performAPIRequest,
  formatTimeForLegends,
  translate,
} = require('../src/assets/js/utils');
const { stringToHTML, mockLocalStorage } = require('./utils');
const { readFileSync } = require('fs');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../build/views/common/headerWithoutNavBar.ejs`, 'UTF-8')
);

describe('test utils', () => {
  describe('performAPIRequest', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test('should show error popup with default message if server responds not ok', async () => {
      Object.setPrototypeOf(
        $('#errorPopup'),
        Object.assign(Object.getPrototypeOf($('#errorPopup')), { modal: jest.fn() })
      );

      Object.setPrototypeOf(
        $('#error-text'),
        Object.assign(Object.getPrototypeOf($('#error-text')), { text: jest.fn() })
      );

      origFetch.mockImplementation(() => {
        const res = {};
        res.ok = false;
        return Promise.resolve(res);
      });

      return performAPIRequest('/aggregate-data-count')
        .catch(() => {
          expect($('#errorPopup').modal).toHaveBeenCalledWith('show');
          expect($('#error-text').text).toHaveBeenCalledWith('An unexpected error has occurred.');
        })
        .then(() => {
          delete Object.getPrototypeOf($('#errorPopup')).modal;
          delete Object.getPrototypeOf($('#error-text')).text;
        });
    });

    test('should show error popup with message specific for 503 if server responds not ok and status is 503', async () => {
      Object.setPrototypeOf(
        $('#errorPopup'),
        Object.assign(Object.getPrototypeOf($('#errorPopup')), { modal: jest.fn() })
      );

      Object.setPrototypeOf(
        $('#error-text'),
        Object.assign(Object.getPrototypeOf($('#error-text')), { text: jest.fn() })
      );

      origFetch.mockImplementation(() => {
        const res = {};
        res.ok = false;
        res.status = 503;
        return Promise.resolve(res);
      });

      return performAPIRequest('/aggregate-data-count')
        .catch(() => {
          expect($('#errorPopup').modal).toHaveBeenCalledWith('show');
          expect($('#error-text').text).toHaveBeenCalledWith(
            'We are processing multiple requests at the moment. Please try again after sometime.'
          );
        })
        .then(() => {
          delete Object.getPrototypeOf($('#errorPopup')).modal;
          delete Object.getPrototypeOf($('#error-text')).text;
        });
    });

    test('should give details for given language if server responds ok', async () => {
      const testData = {
        data: [
          {
            total_languages: '2',
            total_speakers: '80',
            total_contributions: '0.348',
            total_validations: '0.175',
          },
        ],
      };

      origFetch.mockImplementation(() => {
        const res = {};
        res.ok = true;
        res.json = () => testData;
        return Promise.resolve(res);
      });

      return performAPIRequest('/aggregate-data-count').then(data => {
        expect(data).toEqual(testData);
      });
    });

    test('should give details for all language if server responds ok', () => {
      const testData = {
        data: [{ language: 'Hindi', count: 5 }],
      };

      origFetch.mockImplementation(() => {
        const res = {};
        res.ok = true;
        res.json = () => testData;
        return Promise.resolve(res);
      });

      return performAPIRequest(`/aggregate-data-count?byLanguage=${true}`).then(data => {
        expect(data).toEqual(testData);
      });
    });

    test('should give list for top-5 languages based on no. of contributions if server responds ok', () => {
      const response = [
        { language: 'Hindi', contributions: 5 },
        { language: 'Odia', contributions: 4 },
      ];

      origFetch.mockImplementation(() => {
        const res = {};
        res.ok = true;
        res.json = () => response;
        return Promise.resolve(res);
      });

      return performAPIRequest('/top-languages-by-hours').then(data => {
        expect(data).toEqual(response);
      });
    });
  });

  describe('calculateTime', () => {
    test('should calculate time in hours,min and sec for given sentence count', () => {
      expect(calculateTime(162)).toEqual({ hours: 0, minutes: 2, seconds: 42 });
    });

    test('should calculate time in hours and min for given sentence count', () => {
      expect(calculateTime(162, false)).toEqual({ hours: 0, minutes: 2 });
    });
  });

  describe('formatTime', () => {
    test('should formats h only for given h', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ 'hour(s)': 'hour(s)', 'second(s)': 'second(s)', 'minute(s)': 'minute(s)' })
      );
      expect(formatTime(162)).toEqual('162 hour(s)');
      localStorage.clear();
    });

    test('should format h and min for given h and m', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ 'hour(s)': 'hour(s)', 'second(s)': 'second(s)', 'minute(s)': 'minute(s)' })
      );
      expect(formatTime(162, 12)).toEqual('162 hour(s) 12 minute(s)');
      localStorage.clear();
    });

    test('should format in s when hours and minutes are 0', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ 'hour(s)': 'hour(s)', 'second(s)': 'second(s)', 'minute(s)': 'minute(s)' })
      );
      expect(formatTime(0, 0, 2)).toEqual('2 second(s)');
      localStorage.clear();
    });

    test('should show 0s when hours, minutes and seconds are 0', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ 'hour(s)': 'hour(s)', 'second(s)': 'second(s)', 'minute(s)': 'minute(s)' })
      );
      expect(formatTime(0, 0, 0)).toEqual('0 second(s)');
      localStorage.clear();
    });

    test('should show hours and minutes text in english no translation present in local storage', () => {
      mockLocalStorage();
      expect(formatTime(10, 5, 0)).toEqual('10 hour(s) 5 minute(s)');
      localStorage.clear();
    });
  });

  describe('formatTimeForLegends', () => {
    test('should formats hours for given hours when labels are allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(162, 0, 0, true)).toEqual('162 hours');
      localStorage.clear();
    });

    test('should formats hours for given hours when labels are not allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(162, 0, 0, false)).toEqual('162');
      localStorage.clear();
    });

    test('should format hours for given hours and minutes when labels are allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(162, 15, 0, true)).toEqual('162.25 hours');
      localStorage.clear();
    });

    test('should format hours for given hours and minutes when labels are not allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(162, 15, 0, false)).toEqual('162.25');
      localStorage.clear();
    });

    test('should format in s when hours and minutes are 0 when labels are allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(0, 0, 2, true)).toEqual('2 seconds');
      localStorage.clear();
    });

    test('should format in s when hours and minutes are 0 when labels are not allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(0, 0, 2, false)).toEqual('2');
      localStorage.clear();
    });

    test('should format in minutes  when hours, minutes and seconds are 0  when labels are allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(0, 20, 0, true)).toEqual('20 minutes');
      localStorage.clear();
    });

    test('should format in minutes  when hours, minutes and seconds are 0  when labels are allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(0, 20, 0, false)).toEqual('20');
      localStorage.clear();
    });

    test('should show 0s when hours, minutes and seconds are 0  when labels are allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(0, 0, 0, true)).toEqual('0 seconds');
      localStorage.clear();
    });

    test('should show 0s when hours, minutes and seconds are 0  when labels are not allowed', () => {
      mockLocalStorage();
      localStorage.setItem(
        'localeString',
        JSON.stringify({ hours: 'hours', seconds: 'seconds', minutes: 'minutes' })
      );
      expect(formatTimeForLegends(0, 0, 0, false)).toEqual('0');
      localStorage.clear();
    });
  });

  describe('showElement', () => {
    test('should remove class d-none from given element', () => {
      const element = $('#navbarSupportedContent');
      showElement(element);
      expect(element.hasClass('d-none')).toEqual(false);
    });
  });

  describe('hideElement', () => {
    test('should add class d-none from given element', () => {
      const element = $('#navbarSupportedContent');
      hideElement(element);
      expect(element.hasClass('d-none')).toEqual(true);
    });
  });

  describe('Test translate method', () => {
    test('should return translated string', () => {
      mockLocalStorage();
      localStorage.setItem('localeString', JSON.stringify({ test: 'A' }));
      expect(translate('test')).toEqual('A');
      localStorage.clear();
    });

    test('should return english/default string where localeString not present', () => {
      mockLocalStorage();
      localStorage.setItem('localeString', JSON.stringify({ test1: 'A' }));
      expect(translate('test2')).toEqual('test2');
      localStorage.clear();
    });
  });
});
