import type { Initiative } from 'types/Initiatives';

import routePaths from './routePaths';

export const INITIATIVES_MAPPING = {
  tts: 'tts',
  asr: 'asr',
  translation: 'translation',
  ocr: 'ocr',
} as const;

export const INITIATIVES_MEDIA = {
  asr: 'asr',
  text: 'text',
  parallel: 'parallel',
  ocr: 'ocr',
} as const;

export const INITIATIVES_MEDIA_MAPPING = {
  [INITIATIVES_MAPPING.tts]: 'asr',
  [INITIATIVES_MAPPING.asr]: 'text',
  [INITIATIVES_MAPPING.translation]: 'parallel',
  [INITIATIVES_MAPPING.ocr]: 'ocr',
} as const;

export const INITIATIVES_REVERSE_MEDIA_MAPPING = {
  [INITIATIVES_MEDIA.asr]: 'tts',
  [INITIATIVES_MEDIA.text]: 'asr',
  [INITIATIVES_MEDIA.parallel]: 'translation',
  [INITIATIVES_MEDIA.ocr]: 'ocr',
} as const;

export const INITIATIVES = Object.keys(INITIATIVES_MAPPING) as Array<Initiative>;

export const INITIATIVE_ACTIONS = {
  [INITIATIVES_MAPPING.tts]: { contribute: 'transcribe', validate: 'validate' },
  [INITIATIVES_MAPPING.asr]: { contribute: 'speak', validate: 'validate' },
  [INITIATIVES_MAPPING.translation]: { contribute: 'translate', validate: 'validate' },
  [INITIATIVES_MAPPING.ocr]: { contribute: 'label', validate: 'validate' },
} as const;

export const INITIATIVE_ACTIONS_CAPS = {
  transcribed: 'transcribed',
  validated: 'validated',
} as const;

export const INITIATIVE_ACTIONS_PAGE_MAPPING = {
  [routePaths.ttsInitiativeContributeThankYou]: INITIATIVE_ACTIONS_CAPS.transcribed,
  [routePaths.ttsInitiativeValidateThankYou]: INITIATIVE_ACTIONS_CAPS.validated,
  [routePaths.translationInitiativeContributeThankYou]: INITIATIVE_ACTIONS_CAPS.transcribed,
  [routePaths.translationInitiativeValidateThankYou]: INITIATIVE_ACTIONS_CAPS.validated,
} as const;

export const INITIATIVE_CUMULATIVE_VALUE = {
  tts: [
    { languages: 'total_languages', isFormat: 'false' },
    { peopleParticipated: 'peopleParticipated', isFormat: 'false' },
    { durationTranscribed: 'total_contributions', isFormat: 'true' },
    { durationValidated: 'total_validations', isFormat: 'true' },
  ],
  asr: [
    { languages: 'total_languages', isFormat: 'false' },
    { peopleParticipated: 'peopleParticipated', isFormat: 'false' },
    { durationRecorded: 'total_contributions', isFormat: 'true' },
    { durationValidated: 'total_validations', isFormat: 'true' },
  ],
  translation: [
    { languagePairs: 'total_languages', isFormat: 'false' },
    { peopleParticipated: 'peopleParticipated', isFormat: 'false' },
    { translationsDone: 'total_contribution_count', isFormat: 'false' },
    { translationsValidated: 'total_validation_count', isFormat: 'false' },
  ],
  ocr: [
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
  [routePaths.ttsInitiativeContributeThankYou]: 'total_contribution_count',
  [routePaths.ttsInitiativeValidateThankYou]: 'total_validation_count',
  [routePaths.asrInitiativeContributeThankYou]: 'total_contributions',
  [routePaths.asrInitiativeValidateThankYou]: 'total_validation_count',
  [routePaths.ocrInitiativeContributeThankYou]: 'total_contribution_count',
  [routePaths.ocrInitiativeValidateThankYou]: 'total_validation_count',
  [routePaths.translationInitiativeContributeThankYou]: 'total_contribution_count',
  [routePaths.translationInitiativeValidateThankYou]: 'total_validation_count',
} as const;

export const INITIATIVE_MEDIA_BADGES_MAPPING = {
  [INITIATIVES_MAPPING.tts]: 'sentences',
  [INITIATIVES_MAPPING.asr]: 'recordings',
  [INITIATIVES_MAPPING.translation]: 'translations',
  [INITIATIVES_MAPPING.ocr]: 'image labels',
} as const;
