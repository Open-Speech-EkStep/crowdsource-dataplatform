import { INITIATIVES_MAPPING } from './initiativeConstants';
import routePaths from './routePaths';

export const pageRouteConstants = {
  [routePaths.home]: 'Home Page',
  [routePaths.sunoIndiaHome]: 'Suno India',
  [routePaths.boloIndiaHome]: 'Bolo India',
  [routePaths.likhoIndiaHome]: 'Likho India',
  [routePaths.dekhoIndiaHome]: 'Dekho India',
  [routePaths.sunoIndiaContribute]: 'Contributed',
} as const;

export const sourceConstants = {
  contribute: 'contribute',
  validate: 'validate',
} as const;

export const sourcePageConstants = {
  [routePaths.sunoIndiaContribute]: 'contribute',
  [routePaths.sunoIndiaValidate]: 'validate',
  [routePaths.boloIndiaContribute]: 'contribute',
  [routePaths.boloIndiaValidate]: 'validate',
  [routePaths.likhoIndiaContribute]: 'contribute',
  [routePaths.likhoIndiaValidate]: 'validate',
  [routePaths.dekhoIndiaContribute]: 'contribute',
  [routePaths.dekhoIndiaValidate]: 'validate',
} as const;

export const pageSourceConstants = {
  [routePaths.sunoIndiaContribute]: 'contribution',
  [routePaths.sunoIndiaValidate]: 'validate',
  [routePaths.boloIndiaContribute]: 'contribute',
  [routePaths.boloIndiaValidate]: 'validate',
  [routePaths.likhoIndiaContribute]: 'contribute',
  [routePaths.likhoIndiaValidate]: 'validate',
  [routePaths.dekhoIndiaContribute]: 'contribute',
  [routePaths.dekhoIndiaValidate]: 'validate',
  [routePaths.sunoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.sunoIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.boloIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.boloIndiaValidateThankYou]: sourceConstants.validate,
  [routePaths.dekhoIndiaContributeThankYou]: sourceConstants.contribute,
  [routePaths.dekhoIndiaValidateThankYou]: sourceConstants.validate,
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
} as const;

export default pageRouteConstants;
