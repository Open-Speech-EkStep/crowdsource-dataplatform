const { readFileSync } = require('fs');
jest.mock('node-fetch');
const { stringToHTML, mockLocalStorage, mockDom, mockLocation } = require('../utils');
const {
  CONTRIBUTION_LANGUAGE,
  SPEAKER_DETAILS_KEY,
  CURRENT_MODULE,
  AGGREGATED_DATA_BY_LANGUAGE,
} = require('../../build/js/common/constants');
const {
  hasUserRegistered,
  setBadge,
  updateGoalProgressBar,
  isInTopLanguage,
  getTop3Languages,
  getCountBasedOnSource,
  languageFilter,
  reduceList,
  redirectToHomeForDirectLanding,
} = require('../../build/js/common/common.js');

describe('test common js', () => {
  beforeEach(() => {
    document.body = stringToHTML(
      readFileSync(`${__dirname}/../../build/views/common/cards.ejs`, 'UTF-8') +
        readFileSync(`${__dirname}/../../build/views/common/languageNavBar.ejs`, 'UTF-8') +
        readFileSync(`${__dirname}/../../build/views/common/thankyouPageParticipationMsg.ejs`, 'UTF-8') +
        readFileSync(`${__dirname}/../../build/views/common/thankyouPageHeading.ejs`, 'UTF-8') +
        readFileSync(`${__dirname}/../../build/views/common/thankyouPageProgressBar.ejs`, 'UTF-8') +
        readFileSync(`${__dirname}/../../build/views/common/badgesMilestone.ejs`, 'UTF-8') +
        readFileSync(`${__dirname}/../../build/views/common/languageGoal.ejs`, 'UTF-8')
    );
  });

  describe('getTop3Languages', () => {
    test('should give top 3 for suno India based on contribution count', () => {
      const languagList = [
        {
          language: 'Assamese',
          total_speakers: '3',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '4',
        },
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '9',
          total_validation_count: '0',
        },
      ];

      mockLocalStorage();
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(languagList));

      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '9',
          total_validation_count: '0',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
      ];

      const result = getTop3Languages('contribute', 'suno', 'Hindi');
      expect(result).toEqual(sortedLanguageStats);
      localStorage.clear();
    });

    test('should give top 2 for suno India based on contribution count', () => {
      const languageList = [
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '9',
          total_validation_count: '0',
        },
      ];

      mockLocalStorage();
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(languageList));

      const sortedLanguageStats = [
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '9',
          total_validation_count: '0',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
      ];

      const result = getTop3Languages('contribute', 'suno', 'Hindi');
      expect(result).toEqual(sortedLanguageStats);
      localStorage.clear();
    });

    test('should repalce bottom language with contribution language when their stats are same', () => {
      const languagList = [
        {
          language: 'Assamese',
          total_speakers: '3',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '4',
        },
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
      ];

      mockLocalStorage();
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(languagList));

      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
      ];

      const result = getTop3Languages('contribute', 'suno', 'Hindi');
      expect(result).toEqual(sortedLanguageStats);
      localStorage.clear();
    });
  });

  describe('isInTopLanguage', () => {
    test('should give true when contribution language is the top language', () => {
      const sortedLanguageStats = [
        {
          language: 'Assamese-Bengali',
          total_speakers: '3',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '4',
        },
        {
          language: 'Assamese-Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '2',
          total_validation_count: '1',
        },
        {
          language: 'Assamese-English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '1',
          total_validation_count: '0',
        },
      ];

      const result = isInTopLanguage(sortedLanguageStats, 'Assamese-Bengali', 'total_contribution_count');
      expect(result).toEqual(true);
    });

    test('should give true when contribution language and top language have same stats', () => {
      const sortedLanguageStats = [
        {
          language: 'Assamese-Bengali',
          total_speakers: '3',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '4',
        },
        {
          language: 'Assamese-Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '1',
        },
        {
          language: 'Assamese-English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '1',
          total_validation_count: '0',
        },
      ];

      const result = isInTopLanguage(sortedLanguageStats, 'Assamese-Gujarati', 'total_contribution_count');
      expect(result).toEqual(true);
    });

    test('should give false when contribution language is not in the top 3 language', () => {
      const sortedLanguageStats = [
        {
          language: 'Assamese-Bengali',
          total_speakers: '3',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '4',
        },
        {
          language: 'Assamese-Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '2',
          total_validation_count: '1',
        },
        {
          language: 'Assamese-English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '1',
          total_validation_count: '0',
        },
      ];

      const result = isInTopLanguage(sortedLanguageStats, 'Assamese-Hindi', 'total_contribution_count');
      expect(result).toEqual(false);
    });

    test('should give true when contribution language is the top 3 language with stats 0', () => {
      const sortedLanguageStats = [
        {
          language: 'Assamese-Bengali',
          total_speakers: '3',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '4',
        },
        {
          language: 'Assamese-Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '2',
          total_validation_count: '1',
        },
        {
          language: 'Assamese-English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '1',
          total_validation_count: '0',
        },
      ];

      const result = isInTopLanguage(sortedLanguageStats, 'Assamese-Bengali', 'total_contribution_count');
      expect(result).toEqual(true);
    });

    test('should give true when contribution language is the top language', () => {
      const sortedLanguageStats = [
        {
          language: 'Assamese-Bengali',
          total_speakers: '3',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '4',
        },
      ];

      const result = isInTopLanguage(sortedLanguageStats, 'Assamese-Bengali', 'total_contribution_count');
      expect(result).toEqual(true);
    });
  });

  describe('setBadge', () => {
    test('should show card without badge when user skip all sentences for contribution flow when language is in top', () => {
      mockLocalStorage();
      localStorage.setItem(CURRENT_MODULE, 'bolo');
      localStorage.setItem(CONTRIBUTION_LANGUAGE, 'hindi');
      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
      ];
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(sortedLanguageStats));
      const data = { isNewBadge: false, contributionCount: 0, nextBadgeType: 'Bronze', currentBadgeType: '' };
      const localeStrings = { bronze: 'Bronze', silver: 'Silver' };
      setBadge(data, localeStrings, 'contribute');

      expect($('#languageInTopWeb').hasClass('d-none')).toEqual(false);
      expect($('#languageInTopMob').hasClass('d-none')).toEqual(false);
      expect($('#languageNotInTopMob').hasClass('d-none')).toEqual(true);
      expect($('#languageNotInTopWeb').hasClass('d-none')).toEqual(true);
      expect($('.new-badge-msg').hasClass('d-none')).toEqual(true);
      expect($('.thankyou-page-heading').hasClass('d-none')).toEqual(false);
      expect($('.user-contribution-msg').hasClass('d-none')).toEqual(true);
      localStorage.clear();
    });

    test('should show card without badge when user skip all sentences for contribution flow when language is not in top', () => {
      mockLocalStorage();
      localStorage.setItem(CURRENT_MODULE, 'suno');
      localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
        {
          language: 'Punjabi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '0',
          total_validation_count: '0',
        },
      ];
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(sortedLanguageStats));
      const data = { isNewBadge: false, contributionCount: 0, nextBadgeType: 'Bronze', currentBadgeType: '' };
      const localeStrings = { bronze: 'Bronze', silver: 'Silver' };
      setBadge(data, localeStrings, 'contribute');

      expect($('#languageInTopWeb').hasClass('d-none')).toEqual(true);
      expect($('#languageInTopMob').hasClass('d-none')).toEqual(true);
      expect($('#languageNotInTopMob').hasClass('d-none')).toEqual(false);
      expect($('#languageNotInTopWeb').hasClass('d-none')).toEqual(false);
      expect($('.new-badge-msg').hasClass('d-none')).toEqual(true);
      expect($('.thankyou-page-heading').hasClass('d-none')).toEqual(false);
      expect($('.user-contribution-msg').hasClass('d-none')).toEqual(true);
      localStorage.clear();
    });

    test('should show card without badge when user contribute very few sentences when language is not in top', () => {
      mockLocalStorage();
      localStorage.setItem(CURRENT_MODULE, 'suno');
      localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
        {
          language: 'Punjabi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '2',
          total_validation_count: '0',
        },
      ];
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(sortedLanguageStats));
      const data = { isNewBadge: false, contributionCount: 2, nextBadgeType: 'Bronze', currentBadgeType: '' };
      const localeStrings = { bronze: 'Bronze', silver: 'Silver' };
      setBadge(data, localeStrings, 'contribute');

      expect($('#languageInTopWeb').hasClass('d-none')).toEqual(true);
      expect($('#languageInTopMob').hasClass('d-none')).toEqual(true);
      expect($('#languageNotInTopMob').hasClass('d-none')).toEqual(false);
      expect($('#languageNotInTopWeb').hasClass('d-none')).toEqual(false);
      expect($('.new-badge-msg').hasClass('d-none')).toEqual(true);
      expect($('.thankyou-page-heading').hasClass('d-none')).toEqual(true);
      expect($('.user-contribution-msg').hasClass('d-none')).toEqual(false);
      localStorage.clear();
    });

    test('should show card with badge when user achieved a badge for the language that is not in top', () => {
      mockLocalStorage();
      localStorage.setItem(CURRENT_MODULE, 'suno');
      localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
        {
          language: 'Punjabi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '2',
          total_validation_count: '0',
        },
      ];
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(sortedLanguageStats));
      const data = {
        isNewBadge: true,
        contributionCount: 5,
        nextBadgeType: 'Silver',
        currentBadgeType: 'Bronze',
      };
      const localeStrings = { bronze: 'Bronze', silver: 'Silver' };
      setBadge(data, localeStrings, 'contribute');

      expect($('#languageInTopWeb').hasClass('d-none')).toEqual(true);
      expect($('#languageInTopMob').hasClass('d-none')).toEqual(true);
      expect($('#languageNotInTopMob').hasClass('d-none')).toEqual(false);
      expect($('#languageNotInTopWeb').hasClass('d-none')).toEqual(false);
      expect($('.new-badge-msg').hasClass('d-none')).toEqual(false);
      expect($('.thankyou-page-heading').hasClass('d-none')).toEqual(true);
      expect($('.user-contribution-msg').hasClass('d-none')).toEqual(true);
      expect($('#milestone_text').hasClass('d-none')).toEqual(false);
      localStorage.clear();
    });

    test('should show card with badge after user achieved a badge for the language that is not in top', () => {
      mockLocalStorage();
      localStorage.setItem(CURRENT_MODULE, 'suno');
      localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
        {
          language: 'Punjabi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '2',
          total_validation_count: '0',
        },
      ];
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(sortedLanguageStats));
      const data = {
        isNewBadge: false,
        contributionCount: 7,
        nextBadgeType: 'Silver',
        currentBadgeType: 'Bronze',
      };
      const localeStrings = { bronze: 'Bronze', silver: 'Silver' };
      setBadge(data, localeStrings, 'contribute');

      expect($('#languageInTopWeb').hasClass('d-none')).toEqual(true);
      expect($('#languageInTopMob').hasClass('d-none')).toEqual(true);
      expect($('#languageNotInTopMob').hasClass('d-none')).toEqual(false);
      expect($('#languageNotInTopWeb').hasClass('d-none')).toEqual(false);
      expect($('.new-badge-msg').hasClass('d-none')).toEqual(true);
      expect($('.thankyou-page-heading').hasClass('d-none')).toEqual(true);
      expect($('.user-contribution-msg').hasClass('d-none')).toEqual(false);
      localStorage.clear();
    });

    test('should show card with Platinum badge after user achieved a Platinum badge when language is in top', () => {
      mockLocalStorage();
      localStorage.setItem(CURRENT_MODULE, 'bolo');
      localStorage.setItem(CONTRIBUTION_LANGUAGE, 'hindi');
      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
      ];
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(sortedLanguageStats));

      const data = {
        isNewBadge: false,
        contributionCount: 700,
        nextBadgeType: '',
        currentBadgeType: 'Platinum',
      };
      const localeStrings = {
        bronze: 'Bronze',
        silver: 'Silver',
        gold: 'Gold',
        platinum: 'Platinum',
      };
      setBadge(data, localeStrings, 'contribute');

      expect($('#languageInTopWeb').hasClass('d-none')).toEqual(false);
      expect($('#languageInTopMob').hasClass('d-none')).toEqual(false);
      expect($('#languageNotInTopMob').hasClass('d-none')).toEqual(true);
      expect($('#languageNotInTopWeb').hasClass('d-none')).toEqual(true);
      expect($('.new-badge-msg').hasClass('d-none')).toEqual(true);
      expect($('.thankyou-page-heading').hasClass('d-none')).toEqual(true);
      expect($('.user-contribution-msg').hasClass('d-none')).toEqual(false);
      expect($('#sentence_away_msg').hasClass('d-none')).toEqual(true);
      expect($('#platinum_reward_msg_1').hasClass('d-none')).toEqual(false);
      localStorage.clear();
    });

    test('should show card with Platinum badge after user achieved a Platinum badge for the language that is not in top', () => {
      mockLocalStorage();
      localStorage.setItem(CURRENT_MODULE, 'suno');
      localStorage.setItem(CONTRIBUTION_LANGUAGE, 'punjabi');
      const sortedLanguageStats = [
        {
          language: 'Gujarati',
          total_speakers: '2',
          total_contributions: '0.000',
          total_validations: '0.000',
          total_contribution_count: '28',
          total_validation_count: '1',
        },
        {
          language: 'English',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '6',
          total_validation_count: '0',
        },
        {
          language: 'Hindi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '4',
          total_validation_count: '0',
        },
        {
          language: 'Punjabi',
          total_speakers: '1',
          total_contributions: null,
          total_validations: '0.000',
          total_contribution_count: '2',
          total_validation_count: '0',
        },
      ];
      localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(sortedLanguageStats));
      const data = {
        isNewBadge: false,
        contributionCount: 700,
        nextBadgeType: '',
        currentBadgeType: 'Platinum',
      };
      const localeStrings = {
        bronze: 'Bronze',
        silver: 'Silver',
        gold: 'Gold',
        platinum: 'Platinum',
      };
      setBadge(data, localeStrings, 'contribute');

      expect($('#languageInTopWeb').hasClass('d-none')).toEqual(true);
      expect($('#languageInTopMob').hasClass('d-none')).toEqual(true);
      expect($('#languageNotInTopMob').hasClass('d-none')).toEqual(false);
      expect($('#languageNotInTopWeb').hasClass('d-none')).toEqual(false);
      expect($('.new-badge-msg').hasClass('d-none')).toEqual(true);
      expect($('.thankyou-page-heading').hasClass('d-none')).toEqual(true);
      expect($('.user-contribution-msg').hasClass('d-none')).toEqual(false);
      expect($('#sentence_away_msg').hasClass('d-none')).toEqual(true);
      expect($('#platinum_reward_msg_2').hasClass('d-none')).toEqual(false);
      localStorage.clear();
    });
  });

  describe('updateGoalProgressBar', () => {
    beforeEach(() => {
      document.body = stringToHTML(
        readFileSync(`${__dirname}/../../build/views/common/thankyouPageProgressBar.ejs`, 'UTF-8') +
          readFileSync(`${__dirname}/../../build/views/boloIndia/home.ejs`, 'UTF-8')
      );
    });

    afterEach(() => {
      jest.resetAllMocks();
      localStorage.clear();
    });

    test('should set progress average in progress bar', () => {
      localStorage.setItem(
        'localeString',
        JSON.stringify({ 'hour(s)': 'hour(s)', 'minute(s)': 'minute(s)', 'second(s)': 'second(s)' })
      );
      localStorage.setItem(CURRENT_MODULE, 'suno');

      const origFetch = require('node-fetch');
      origFetch.mockImplementation(() => {
        const res = {};
        res.ok = true;
        res.json = () => ({ goal: 100, 'current-progress': 50 });
        return Promise.resolve(res);
      });

      return updateGoalProgressBar('/asr').then(() => {
        const totalAverage = $('#totalAverage');
        expect(totalAverage.html()).toEqual('50.0%');
        const $progressBar = $('#progress_bar');
        expect($progressBar.css('width')).toEqual('50%');
      });
    });
  });

  describe('hasUserRegistered', () => {
    mockLocalStorage();

    afterEach(() => {
      localStorage.clear();
    });
    test('should give false if user is not registered', () => {
      expect(hasUserRegistered()).toEqual(false);
    });

    test('should give true if user is registered', () => {
      localStorage.setItem(SPEAKER_DETAILS_KEY, JSON.stringify({ userName: 'priya' }));
      expect(hasUserRegistered()).toEqual(true);
    });

    test('should give true if user is registered', () => {
      localStorage.setItem(SPEAKER_DETAILS_KEY, JSON.stringify({ userName: '' }));
      expect(hasUserRegistered()).toEqual(true);
    });
  });

  describe('test getCountBasedOnSource', () => {
    test('should give contribution value for source contribute', () => {
      const result = getCountBasedOnSource('contribute', 2, 3);
      expect(result).toEqual(2);
    });

    test('should give contribution value for source validate', () => {
      const result = getCountBasedOnSource('validate', 2, 3);
      expect(result).toEqual(3);
    });

    test('should give total value for source not specified', () => {
      const result = getCountBasedOnSource('', 2, 3);
      expect(result).toEqual(5);
    });
  });

  describe('test languageFilter', () => {
    const data = [
      { language: 'Hindi', type: 'text' },
      { language: 'Tamil', type: 'text' },
    ];
    test('should return filtered list if language present', () => {
      const language = 'Hindi';
      const result = languageFilter(data, 'text', language);
      expect(result).toEqual([{ language, type: 'text' }]);
    });

    test('should return actual list if language empty', () => {
      const language = '';
      const result = languageFilter(data, 'text', language);
      expect(result).toEqual(data);
    });

    test('should return empty list if language not present', () => {
      const language = 'someLanguage';
      const result = languageFilter(data, 'text', language);
      expect(result).toEqual([]);
    });

    test('should return list with starting language for language pairs data', () => {
      const data = [
        { language: 'Hindi-language2', type: 'text' },
        { language: 'Tamil', type: 'text' },
      ];
      const language = 'Hindi';
      const result = languageFilter(data, 'text', language);
      expect(result).toEqual([{ language: 'Hindi-language2', type: 'text' }]);
    });

    test('should return list with starting language for language pairs data and input', () => {
      const data = [
        { language: 'Hindi-language2', type: 'text' },
        { language: 'Tamil-Odia', type: 'parallel' },
        { language: 'Tamil-English', type: 'parallel' },
      ];
      const language = 'Tamil-Bengali';
      const result = languageFilter(data, 'parallel', language);
      expect(result).toEqual([
        { language: 'Tamil-Odia', type: 'parallel' },
        { language: 'Tamil-English', type: 'parallel' },
      ]);
    });
  });

  describe('test reduceList', () => {
    test('should return totaled contribution_goal and validation goal as an object', () => {
      const language = 'Odia';
      const type = 'text';
      const dataList = [
        { contribution_goal: 10, validation_goal: 10, type, language },
        { contribution_goal: 5, validation_goal: 5, type, language },
      ];
      const result = reduceList(dataList);
      expect(result).toEqual({ contribution_goal: 15, validation_goal: 15 });
    });

    test('should return empty object for empty data', () => {
      const dataList = [];
      const result = reduceList(dataList);
      expect(result).toEqual({});
    });

    test('should return empty object for data without numbers', () => {
      const dataList = [{ key1: 'string1', key2: 'string2' }];
      const result = reduceList(dataList);
      expect(result).toEqual({});
    });
  });

  describe('redirectToHomeForDirectLanding', () => {
    test('should redirect to initiative landing page if url has been hit directly', () => {
      mockLocation();
      mockDom();
      document.referrer = '';
      location.href = './record.html';
      redirectToHomeForDirectLanding();
      expect(location.href).toEqual('./home.html');
    });

    test('should land to functional page if user went there through initiative landing page', () => {
      mockLocation();
      mockDom();
      document.referrer = '/record.html';
      location.href = './record.html';
      redirectToHomeForDirectLanding();
      expect(location.href).toEqual('./record.html');
    });

    test('should land to thankyou page if user went there through initiative landing page', () => {
      mockLocation();
      mockDom();
      document.referrer = '/record.html';
      location.href = './thankyou.html';
      redirectToHomeForDirectLanding();
      expect(location.href).toEqual('./thankyou.html');
    });
  });
});
