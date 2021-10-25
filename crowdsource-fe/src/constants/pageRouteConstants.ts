import { INITIATIVES_MAPPING } from './initiativeConstants';
import routePaths from './routePaths';

export const pageRouteConstants = {
  [routePaths.home]: 'Home Page',
  [routePaths.sunoIndiaHome]: 'Suno India',
  [routePaths.boloIndiaHome]: 'Bolo India',
  [routePaths.likhoIndiaHome]: 'Likho India',
  [routePaths.dekhoIndiaHome]: 'Dekho India',
  [routePaths.sunoIndiaContribute]: 'Contributed',
  [routePaths.sunoIndiaContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.sunoIndiaValidateThankYou]: 'Validation Thank You Page',
  [routePaths.boloIndiaContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.boloIndiaValidateThankYou]: 'Validation Thank You Page',
  [routePaths.dekhoIndiaContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.dekhoIndiaValidateThankYou]: 'Validation Thank You Page',
  [routePaths.likhoIndiaContributeThankYou]: 'Contribution Thank You Page',
  [routePaths.likhoIndiaValidateThankYou]: 'Validation Thank You Page',
} as const;

export const sourceConstants = {
  contribute: 'contribute',
  validate: 'validate',
} as const;

export const pageSourceConstants = {
  [routePaths.sunoIndiaContribute]: 'contribution',
  [routePaths.sunoIndiaValidate]: 'validation',
  [routePaths.boloIndiaContribute]: 'contribution',
  [routePaths.boloIndiaValidate]: 'validation',
  [routePaths.likhoIndiaContribute]: 'contribution',
  [routePaths.likhoIndiaValidate]: 'validation',
  [routePaths.dekhoIndiaContribute]: 'contribution',
  [routePaths.dekhoIndiaValidate]: 'validation',
  [routePaths.sunoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.sunoIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.boloIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.boloIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.dekhoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.dekhoIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.likhoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.likhoIndiaValidateThankYou]: sourceConstants.validate,
} as const;

export const pageMediaTypeConstants = {
  [routePaths.sunoIndiaContributeThankYou]: 'sentence(s)',
  [routePaths.sunoIndiaValidateThankYou]: 'sentence(s)',
  [routePaths.boloIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.boloIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.dekhoIndiaContributeThankYou]: 'image label(s)',
  [routePaths.dekhoIndiaValidateThankYou]: 'image label(s)',
  [routePaths.likhoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.likhoIndiaValidateThankYou]: sourceConstants.validate,
} as const;

export const pageInitiativeRouteConstants = {
  [routePaths.home]: 'Others',
  [routePaths.sunoIndiaHome]: INITIATIVES_MAPPING.suno,
  [routePaths.sunoIndiaContribute]: INITIATIVES_MAPPING.suno,
  [routePaths.boloIndiaHome]: INITIATIVES_MAPPING.bolo,
  [routePaths.likhoIndiaHome]: INITIATIVES_MAPPING.likho,
  [routePaths.dekhoIndiaHome]: INITIATIVES_MAPPING.dekho,

  [routePaths.sunoIndiaContributeThankYou]: INITIATIVES_MAPPING.suno,
  [routePaths.boloIndiaContributeThankYou]: INITIATIVES_MAPPING.bolo,
  [routePaths.dekhoIndiaContributeThankYou]: INITIATIVES_MAPPING.dekho,
  [routePaths.likhoIndiaContributeThankYou]: INITIATIVES_MAPPING.likho,
} as const;

export default pageRouteConstants;
