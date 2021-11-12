import { INITIATIVES_MAPPING } from './initiativeConstants';
import routePaths from './routePaths';

export const pageRouteConstants = {
  [routePaths.home]: 'Home Page',
  [routePaths.sunoIndiaHome]: 'Suno India',
  [routePaths.boloIndiaHome]: 'Bolo India',
  [routePaths.likhoIndiaHome]: 'Likho India',
  [routePaths.dekhoIndiaHome]: 'Dekho India',
  [routePaths.sunoIndiaContribute]: 'Transcribe',
  [routePaths.sunoIndiaValidate]: 'Validate',
  [routePaths.likhoIndiaContribute]: 'Translate',
  [routePaths.likhoIndiaValidate]: 'Validate',
  [routePaths.dekhoIndiaContribute]: 'Label',
  [routePaths.dekhoIndiaValidate]: 'Validate',
  [routePaths.sunoIndiaDashboard]: 'Dashboard',
  [routePaths.likhoIndiaDashboard]: 'Dashboard',
  [routePaths.dekhoIndiaDashboard]: 'Dashboard',
  [routePaths.boloIndiaDashboard]: 'Dashboard',
  [routePaths.sunoIndiaContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.sunoIndiaValidateThankYou]: 'Validation Thank You Page',
  [routePaths.boloIndiaContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.boloIndiaValidateThankYou]: 'Validation Thank You Page',
  [routePaths.dekhoIndiaContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.dekhoIndiaValidateThankYou]: 'Validation Thank You Page',
  [routePaths.likhoIndiaContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.likhoIndiaValidateThankYou]: 'Validation Thank You Page',
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
  [routePaths.sunoIndiaContribute]: SOURCE_CONSTANT_2.contribution,
  [routePaths.sunoIndiaValidate]: SOURCE_CONSTANT_2.validation,
  [routePaths.boloIndiaContribute]: SOURCE_CONSTANT_2.contribution,
  [routePaths.boloIndiaValidate]: SOURCE_CONSTANT_2.validation,
  [routePaths.likhoIndiaContribute]: SOURCE_CONSTANT_2.contribution,
  [routePaths.likhoIndiaValidate]: SOURCE_CONSTANT_2.validation,
  [routePaths.dekhoIndiaContribute]: SOURCE_CONSTANT_2.contribution,
  [routePaths.dekhoIndiaValidate]: SOURCE_CONSTANT_2.validation,
  [routePaths.sunoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.sunoIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.boloIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.boloIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.dekhoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.dekhoIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.likhoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.likhoIndiaValidateThankYou]: sourceConstants.validate,
} as const;

export const pageSourceConstants2 = {
  [routePaths.sunoIndiaContributeThankYou]: SOURCE_CONSTANT_WITH_D.contributed,
  [routePaths.sunoIndiaValidateThankYou]: SOURCE_CONSTANT_WITH_D.validated,
  [routePaths.boloIndiaContributeThankYou]: SOURCE_CONSTANT_WITH_D.contributed,
  [routePaths.boloIndiaValidateThankYou]: SOURCE_CONSTANT_WITH_D.validated,
  [routePaths.dekhoIndiaContributeThankYou]: SOURCE_CONSTANT_WITH_D.contributed,
  [routePaths.dekhoIndiaValidateThankYou]: SOURCE_CONSTANT_WITH_D.validated,
  [routePaths.likhoIndiaContributeThankYou]: SOURCE_CONSTANT_WITH_D.contributed,
  [routePaths.likhoIndiaValidateThankYou]: SOURCE_CONSTANT_WITH_D.validated,
} as const;

export const pageSourceConstants3 = {
  [routePaths.sunoIndiaContributeThankYou]: SOURCE_CONSTANT_2.contribution,
  [routePaths.sunoIndiaValidateThankYou]: SOURCE_CONSTANT_2.validation,
  [routePaths.boloIndiaContributeThankYou]: SOURCE_CONSTANT_2.contribution,
  [routePaths.boloIndiaValidateThankYou]: SOURCE_CONSTANT_2.validation,
  [routePaths.dekhoIndiaContributeThankYou]: SOURCE_CONSTANT_2.contribution,
  [routePaths.dekhoIndiaValidateThankYou]: SOURCE_CONSTANT_2.validation,
  [routePaths.likhoIndiaContributeThankYou]: SOURCE_CONSTANT_2.contribution,
  [routePaths.likhoIndiaValidateThankYou]: SOURCE_CONSTANT_2.validation,
} as const;

export const pageSourceConstants4 = {
  [routePaths.sunoIndiaContributeThankYou]: SOURCE_CONSTANT_3.contributor,
  [routePaths.sunoIndiaValidateThankYou]: SOURCE_CONSTANT_3.validatior,
  [routePaths.boloIndiaContributeThankYou]: SOURCE_CONSTANT_3.contributor,
  [routePaths.boloIndiaValidateThankYou]: SOURCE_CONSTANT_3.validatior,
  [routePaths.dekhoIndiaContributeThankYou]: SOURCE_CONSTANT_3.contributor,
  [routePaths.dekhoIndiaValidateThankYou]: SOURCE_CONSTANT_3.validatior,
  [routePaths.likhoIndiaContributeThankYou]: SOURCE_CONSTANT_3.contributor,
  [routePaths.likhoIndiaValidateThankYou]: SOURCE_CONSTANT_3.validatior,
} as const;

export const pageMediaTypeConstants = {
  [routePaths.sunoIndiaContributeThankYou]: 'sentences',
  [routePaths.sunoIndiaValidateThankYou]: 'sentences',
  [routePaths.boloIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.boloIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.dekhoIndiaContributeThankYou]: 'image label(s)',
  [routePaths.dekhoIndiaValidateThankYou]: 'image label(s)',
  [routePaths.likhoIndiaContributeThankYou]: 'sentences',
  [routePaths.likhoIndiaValidateThankYou]: 'sentences',
} as const;

export const pageInitiativeRouteConstants = {
  [routePaths.home]: 'Others',
  [routePaths.sunoIndiaHome]: INITIATIVES_MAPPING.suno,
  [routePaths.sunoIndiaContribute]: INITIATIVES_MAPPING.suno,
  [routePaths.sunoIndiaValidate]: INITIATIVES_MAPPING.suno,
  [routePaths.boloIndiaHome]: INITIATIVES_MAPPING.bolo,
  [routePaths.likhoIndiaHome]: INITIATIVES_MAPPING.likho,
  [routePaths.dekhoIndiaHome]: INITIATIVES_MAPPING.dekho,
  [routePaths.sunoIndiaDashboard]: INITIATIVES_MAPPING.suno,
  [routePaths.likhoIndiaDashboard]: INITIATIVES_MAPPING.likho,
  [routePaths.dekhoIndiaDashboard]: INITIATIVES_MAPPING.dekho,
  [routePaths.boloIndiaDashboard]: INITIATIVES_MAPPING.bolo,

  [routePaths.sunoIndiaContribute]: INITIATIVES_MAPPING.suno,
  [routePaths.sunoIndiaValidate]: INITIATIVES_MAPPING.suno,
  [routePaths.likhoIndiaContribute]: INITIATIVES_MAPPING.likho,
  [routePaths.likhoIndiaValidate]: INITIATIVES_MAPPING.likho,
  [routePaths.dekhoIndiaContribute]: INITIATIVES_MAPPING.dekho,
  [routePaths.dekhoIndiaValidate]: INITIATIVES_MAPPING.dekho,

  [routePaths.sunoIndiaContributeThankYou]: INITIATIVES_MAPPING.suno,
  [routePaths.boloIndiaContributeThankYou]: INITIATIVES_MAPPING.bolo,
  [routePaths.dekhoIndiaContributeThankYou]: INITIATIVES_MAPPING.dekho,
  [routePaths.likhoIndiaContributeThankYou]: INITIATIVES_MAPPING.likho,

  [routePaths.sunoIndiaValidateThankYou]: INITIATIVES_MAPPING.suno,
  [routePaths.boloIndiaValidateThankYou]: INITIATIVES_MAPPING.bolo,
  [routePaths.dekhoIndiaValidateThankYou]: INITIATIVES_MAPPING.dekho,
  [routePaths.likhoIndiaValidateThankYou]: INITIATIVES_MAPPING.likho,

  [routePaths.myBadges]: 'Others',
  [routePaths.badges]: 'Others',
  [routePaths.termsAndConditions]: 'Others',
  [routePaths.termsOfUse]: 'Others',
  [routePaths.privacyPolicy]: 'Others',
  [routePaths.copyright]: 'Others',
} as const;

export default pageRouteConstants;
