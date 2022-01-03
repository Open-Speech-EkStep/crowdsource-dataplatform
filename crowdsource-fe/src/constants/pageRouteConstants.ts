import { INITIATIVES_MAPPING } from './initiativeConstants';
import routePaths from './routePaths';

export const pageRouteConstants = {
  [routePaths.home]: 'Home Page',
  [routePaths.ttsInitiativeHome]: 'TTS Initiative',
  [routePaths.asrInitiativeHome]: 'ASR Initiative',
  [routePaths.translationInitiativeHome]: 'Translation Initiative',
  [routePaths.ocrInitiativeHome]: 'OCR Initiative',
  [routePaths.ttsInitiativeContribute]: 'Transcribe',
  [routePaths.ttsInitiativeValidate]: 'Validate',
  [routePaths.asrInitiativeContribute]: 'Speak',
  [routePaths.asrInitiativeValidate]: 'Validate',
  [routePaths.translationInitiativeContribute]: 'Translate',
  [routePaths.translationInitiativeValidate]: 'Validate',
  [routePaths.ocrInitiativeContribute]: 'Label',
  [routePaths.ocrInitiativeValidate]: 'Validate',
  [routePaths.ttsInitiativeDashboard]: 'Dashboard',
  [routePaths.translationInitiativeDashboard]: 'Dashboard',
  [routePaths.ocrInitiativeDashboard]: 'Dashboard',
  [routePaths.asrInitiativeDashboard]: 'Dashboard',
  [routePaths.ttsInitiativeContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.ttsInitiativeValidateThankYou]: 'Validation Thank You Page',
  [routePaths.asrInitiativeContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.asrInitiativeValidateThankYou]: 'Validation Thank You Page',
  [routePaths.ocrInitiativeContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.ocrInitiativeValidateThankYou]: 'Validation Thank You Page',
  [routePaths.translationInitiativeContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.translationInitiativeValidateThankYou]: 'Validation Thank You Page',
  [routePaths.myBadges]: 'My Badges',
  [routePaths.badges]: 'Badges Info',
  [routePaths.termsAndConditions]: 'Terms and Conditions',
  [routePaths.termsOfUse]: 'Terms and Conditions',
  [routePaths.privacyPolicy]: 'Terms and Conditions',
  [routePaths.copyright]: 'Terms and Conditions',
} as const;

export const sourceConstants = {
  contribute: 'contribute',
  validate: 'validate',
} as const;

export const SOURCE_CONSTANT_WITH_D = {
  contributed: 'contributed',
  validated: 'validated',
} as const;

export const SOURCE_CONSTANT_2 = {
  contribution: 'contribution',
  validation: 'validation',
} as const;

export const SOURCE_CONSTANT_3 = {
  contributor: 'contributor',
  validatior: 'validator',
} as const;

export const pageSourceConstants = {
  [routePaths.ttsInitiativeContribute]: SOURCE_CONSTANT_2.contribution,
  [routePaths.ttsInitiativeValidate]: SOURCE_CONSTANT_2.validation,
  [routePaths.asrInitiativeContribute]: SOURCE_CONSTANT_2.contribution,
  [routePaths.asrInitiativeValidate]: SOURCE_CONSTANT_2.validation,
  [routePaths.translationInitiativeContribute]: SOURCE_CONSTANT_2.contribution,
  [routePaths.translationInitiativeValidate]: SOURCE_CONSTANT_2.validation,
  [routePaths.ocrInitiativeContribute]: SOURCE_CONSTANT_2.contribution,
  [routePaths.ocrInitiativeValidate]: SOURCE_CONSTANT_2.validation,
  [routePaths.ttsInitiativeContributeThankYou]: sourceConstants.contribute,
  [routePaths.ttsInitiativeValidateThankYou]: sourceConstants.validate,
  [routePaths.asrInitiativeContributeThankYou]: sourceConstants.contribute,
  [routePaths.asrInitiativeValidateThankYou]: sourceConstants.validate,
  [routePaths.ocrInitiativeContributeThankYou]: sourceConstants.contribute,
  [routePaths.ocrInitiativeValidateThankYou]: sourceConstants.validate,
  [routePaths.translationInitiativeContributeThankYou]: sourceConstants.contribute,
  [routePaths.translationInitiativeValidateThankYou]: sourceConstants.validate,
  [routePaths.asrInitiativeContributeThankYou]: sourceConstants.contribute,
  [routePaths.asrInitiativeValidateThankYou]: sourceConstants.validate,
} as const;

export const pageSourceConstants2 = {
  [routePaths.ttsInitiativeContributeThankYou]: SOURCE_CONSTANT_WITH_D.contributed,
  [routePaths.ttsInitiativeValidateThankYou]: SOURCE_CONSTANT_WITH_D.validated,
  [routePaths.asrInitiativeContributeThankYou]: SOURCE_CONSTANT_WITH_D.contributed,
  [routePaths.asrInitiativeValidateThankYou]: SOURCE_CONSTANT_WITH_D.validated,
  [routePaths.ocrInitiativeContributeThankYou]: SOURCE_CONSTANT_WITH_D.contributed,
  [routePaths.ocrInitiativeValidateThankYou]: SOURCE_CONSTANT_WITH_D.validated,
  [routePaths.translationInitiativeContributeThankYou]: SOURCE_CONSTANT_WITH_D.contributed,
  [routePaths.translationInitiativeValidateThankYou]: SOURCE_CONSTANT_WITH_D.validated,
} as const;

export const pageSourceConstants3 = {
  [routePaths.ttsInitiativeContributeThankYou]: SOURCE_CONSTANT_2.contribution,
  [routePaths.ttsInitiativeValidateThankYou]: SOURCE_CONSTANT_2.validation,
  [routePaths.asrInitiativeContributeThankYou]: SOURCE_CONSTANT_2.contribution,
  [routePaths.asrInitiativeValidateThankYou]: SOURCE_CONSTANT_2.validation,
  [routePaths.ocrInitiativeContributeThankYou]: SOURCE_CONSTANT_2.contribution,
  [routePaths.ocrInitiativeValidateThankYou]: SOURCE_CONSTANT_2.validation,
  [routePaths.translationInitiativeContributeThankYou]: SOURCE_CONSTANT_2.contribution,
  [routePaths.translationInitiativeValidateThankYou]: SOURCE_CONSTANT_2.validation,
} as const;

export const pageSourceConstants4 = {
  [routePaths.ttsInitiativeContributeThankYou]: SOURCE_CONSTANT_3.contributor,
  [routePaths.ttsInitiativeValidateThankYou]: SOURCE_CONSTANT_3.validatior,
  [routePaths.asrInitiativeContributeThankYou]: SOURCE_CONSTANT_3.contributor,
  [routePaths.asrInitiativeValidateThankYou]: SOURCE_CONSTANT_3.validatior,
  [routePaths.ocrInitiativeContributeThankYou]: SOURCE_CONSTANT_3.contributor,
  [routePaths.ocrInitiativeValidateThankYou]: SOURCE_CONSTANT_3.validatior,
  [routePaths.translationInitiativeContributeThankYou]: SOURCE_CONSTANT_3.contributor,
  [routePaths.translationInitiativeValidateThankYou]: SOURCE_CONSTANT_3.validatior,
} as const;

export const pageMediaTypeConstants = {
  [routePaths.ttsInitiativeContributeThankYou]: 'sentences',
  [routePaths.ttsInitiativeValidateThankYou]: 'sentences',
  [routePaths.asrInitiativeContributeThankYou]: sourceConstants.contribute,
  [routePaths.asrInitiativeValidateThankYou]: sourceConstants.validate,
  [routePaths.ocrInitiativeContributeThankYou]: 'image label(s)',
  [routePaths.ocrInitiativeValidateThankYou]: 'image label(s)',
  [routePaths.translationInitiativeContributeThankYou]: 'sentences',
  [routePaths.translationInitiativeValidateThankYou]: 'sentences',
} as const;

export const pageInitiativeRouteConstants = {
  [routePaths.home]: 'Others',
  [routePaths.ttsInitiativeHome]: INITIATIVES_MAPPING.tts,
  [routePaths.ttsInitiativeContribute]: INITIATIVES_MAPPING.tts,
  [routePaths.ttsInitiativeValidate]: INITIATIVES_MAPPING.tts,
  [routePaths.asrInitiativeHome]: INITIATIVES_MAPPING.asr,
  [routePaths.translationInitiativeHome]: INITIATIVES_MAPPING.translation,
  [routePaths.ocrInitiativeHome]: INITIATIVES_MAPPING.ocr,
  [routePaths.ttsInitiativeDashboard]: INITIATIVES_MAPPING.tts,
  [routePaths.translationInitiativeDashboard]: INITIATIVES_MAPPING.translation,
  [routePaths.ocrInitiativeDashboard]: INITIATIVES_MAPPING.ocr,
  [routePaths.asrInitiativeDashboard]: INITIATIVES_MAPPING.asr,

  [routePaths.ttsInitiativeContribute]: INITIATIVES_MAPPING.tts,
  [routePaths.ttsInitiativeValidate]: INITIATIVES_MAPPING.tts,
  [routePaths.translationInitiativeContribute]: INITIATIVES_MAPPING.translation,
  [routePaths.translationInitiativeValidate]: INITIATIVES_MAPPING.translation,
  [routePaths.ocrInitiativeContribute]: INITIATIVES_MAPPING.ocr,
  [routePaths.ocrInitiativeValidate]: INITIATIVES_MAPPING.ocr,
  [routePaths.asrInitiativeContribute]: INITIATIVES_MAPPING.asr,
  [routePaths.asrInitiativeValidate]: INITIATIVES_MAPPING.asr,

  [routePaths.ttsInitiativeContributeThankYou]: INITIATIVES_MAPPING.tts,
  [routePaths.asrInitiativeContributeThankYou]: INITIATIVES_MAPPING.asr,
  [routePaths.ocrInitiativeContributeThankYou]: INITIATIVES_MAPPING.ocr,
  [routePaths.translationInitiativeContributeThankYou]: INITIATIVES_MAPPING.translation,

  [routePaths.ttsInitiativeValidateThankYou]: INITIATIVES_MAPPING.tts,
  [routePaths.asrInitiativeValidateThankYou]: INITIATIVES_MAPPING.asr,
  [routePaths.ocrInitiativeValidateThankYou]: INITIATIVES_MAPPING.ocr,
  [routePaths.translationInitiativeValidateThankYou]: INITIATIVES_MAPPING.translation,

  [routePaths.myBadges]: 'Others',
  [routePaths.badges]: 'Others',
  [routePaths.termsAndConditions]: 'Others',
  [routePaths.termsOfUse]: 'Others',
  [routePaths.privacyPolicy]: 'Others',
  [routePaths.copyright]: 'Others',
} as const;

export default pageRouteConstants;
