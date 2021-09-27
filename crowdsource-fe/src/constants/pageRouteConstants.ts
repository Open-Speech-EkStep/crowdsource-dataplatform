import { INITIATIVES_MAPPING } from './initiativeConstants';
import routePaths from './routePaths';

export const pageRouteConstants = {
  [routePaths.home]: 'Home Page',
  [routePaths.sunoIndiaHome]: 'Suno India',
} as const;

export const pageInitiativeRouteConstants = {
  [routePaths.home]: 'Others',
  [routePaths.sunoIndiaHome]: INITIATIVES_MAPPING.suno,
  [routePaths.boloIndiaHome]: INITIATIVES_MAPPING.bolo,
  [routePaths.likhoIndiaHome]: INITIATIVES_MAPPING.likho,
  [routePaths.dekhoIndiaHome]: INITIATIVES_MAPPING.dekho,
} as const;

export default pageRouteConstants;
