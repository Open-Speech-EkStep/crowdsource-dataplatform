import routePaths from './routePaths';

export const INITIATIVES_MAPPING = {
  suno: 'suno',
  bolo: 'bolo',
  likho: 'likho',
  dekho: 'dekho',
} as const;

export const INITIATIVES_MEDIA = {
  asr: 'asr',
  text: 'text',
  parallel: 'parallel',
  ocr: 'ocr',
} as const;

export const INITIATIVES_MEDIA_MAPPING = {
  [INITIATIVES_MAPPING.suno]: 'asr',
  [INITIATIVES_MAPPING.bolo]: 'text',
  [INITIATIVES_MAPPING.likho]: 'parallel',
  [INITIATIVES_MAPPING.dekho]: 'ocr',
} as const;

export const INITIATIVES_MEDIA_TYPE_MAPPING = {
  [INITIATIVES_MEDIA_MAPPING.suno]: 'Sentences',
  [INITIATIVES_MEDIA_MAPPING.bolo]: 'Sentences',
  [INITIATIVES_MEDIA_MAPPING.likho]: 'Translations',
  [INITIATIVES_MEDIA_MAPPING.dekho]: 'Images',
} as const;

export const INITIATIVES = Object.keys(INITIATIVES_MAPPING);

export const INITIATIVE_ACTIONS = {
  [INITIATIVES_MAPPING.suno]: { contribute: 'transcribe', validate: 'validate' },
  [INITIATIVES_MAPPING.bolo]: { contribute: 'speak', validate: 'validate' },
  [INITIATIVES_MAPPING.likho]: { contribute: 'translate', validate: 'validate' },
  [INITIATIVES_MAPPING.dekho]: { contribute: 'label', validate: 'validate' },
} as const;

export const INITIATIVE_CUMULATIVE_VALUE = {
  suno: [
    { languages: 'total_languages', isFormat: 'false' },
    { peopleParticipated: 'peopleParticipated', isFormat: 'false' },
    { durationTranscribed: 'total_contributions', isFormat: 'true' },
    { durationValidated: 'total_validations', isFormat: 'true' },
  ],
  bolo: [
    { languages: 'total_languages', isFormat: 'false' },
    { peopleParticipated: 'peopleParticipated', isFormat: 'false' },
    { durationRecorded: 'total_contributions', isFormat: 'true' },
    { durationValidated: 'total_validations', isFormat: 'true' },
  ],
  likho: [
    { languagePairs: 'total_languages', isFormat: 'false' },
    { peopleParticipated: 'peopleParticipated', isFormat: 'false' },
    { translationsDone: 'total_contribution_count', isFormat: 'false' },
    { translationsValidated: 'total_validation_count', isFormat: 'false' },
  ],
  dekho: [
    { languages: 'total_languages', isFormat: 'false' },
    { peopleParticipated: 'peopleParticipated', isFormat: 'false' },
    { imagesLabelled: 'total_contribution_count', isFormat: 'false' },
    { imagesValidated: 'total_validation_count', isFormat: 'false' },
  ],
} as const;

export const INITIATIVE_MEDIA_CONTRIBUTION_MAPPING = {
  [INITIATIVES_MEDIA.asr]: 'total_contributions',
  [INITIATIVES_MEDIA.text]: 'total_contributions',
  [INITIATIVES_MEDIA.parallel]: 'total_contribution_count',
  [INITIATIVES_MEDIA.ocr]: 'total_contribution_count',
} as const;

export const CONTRIBUTION_MAPPING = {
  [routePaths.sunoIndiaContributeThankYou]: 'total_contributions',
  [routePaths.sunoIndiaValidateThankYou]: 'total_validations',
  [routePaths.boloIndiaContributeThankYou]: 'total_contributions',
  [routePaths.boloIndiaValidateThankYou]: 'total_validations',
  [routePaths.dekhoIndiaContributeThankYou]: 'total_contribution_count',
  [routePaths.dekhoIndiaValidateThankYou]: 'total_validation_count',
  [routePaths.likhoIndiaContributeThankYou]: 'total_contribution_count',
  [routePaths.likhoIndiaValidateThankYou]: 'total_validation_count',
} as const;
