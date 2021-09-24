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
  transcribe: 'Transcribe',
  validate: 'Validate',
  contribute: 'Contribute',
  speak: 'Speak',
  label: 'Label',
} as const;

export const INITIATIVE_CUMULATIVE_VALUE = {
  suno: [
    { Languages: 'total_languages', isFormat: 'false' },
    { 'People participated': 'peopleParticipated', isFormat: 'false' },
    { 'Duration transcribed': 'total_contributions', isFormat: 'true' },
    { 'Duration Validated': 'total_validations', isFormat: 'true' },
  ],
} as const;
