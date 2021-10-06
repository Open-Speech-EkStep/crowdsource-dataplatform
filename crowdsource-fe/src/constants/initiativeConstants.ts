export const INITIATIVES_MAPPING = {
  suno: 'suno',
  bolo: 'bolo',
  likho: 'likho',
  dekho: 'dekho',
} as const;

export const INITIATIVES_MEDIA_MAPPING = {
  [INITIATIVES_MAPPING.suno]: 'asr',
  [INITIATIVES_MAPPING.bolo]: 'text',
  [INITIATIVES_MAPPING.likho]: 'parallel',
  [INITIATIVES_MAPPING.dekho]: 'ocr',
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
} as const;
