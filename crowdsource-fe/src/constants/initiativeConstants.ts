export const INITIATIVES_MAPPING = {
  suno: 'suno',
  bolo: 'bolo',
  likho: 'likho',
  dekho: 'dekho',
} as const;

export const INITIATIVES_MEDIA_MAPPING = {
  suno: 'asr',
  bolo: 'text',
  likho: 'parallel',
  dekho: 'ocr',
} as const;

export const INITIATIVES = Object.keys(INITIATIVES_MAPPING);

export const INITIATIVE_ACTIONS = {
  transcribe: 'Transcribe',
  validate: 'Validate',
} as const;
