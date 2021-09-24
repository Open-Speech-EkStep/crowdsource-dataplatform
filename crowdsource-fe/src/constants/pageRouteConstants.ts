import { INITIATIVES_MAPPING } from './initiativeConstants';
import routePaths from './routePaths';

const pageRouteConstants = {
  [routePaths.home]: 'Home Page',
} as const;

export const pageInitiativeRouteConstants = {
  [routePaths.home]: 'Others',
  [routePaths.sunoIndiaHome]: INITIATIVES_MAPPING.suno,
  [routePaths.boloIndiaHome]: INITIATIVES_MAPPING.bolo,
  [routePaths.likhoIndiaHome]: INITIATIVES_MAPPING.likho,
  [routePaths.dekhoIndiaHome]: INITIATIVES_MAPPING.dekho,
} as const;

export default pageRouteConstants;
