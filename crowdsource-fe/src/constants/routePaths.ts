const initiativeBaseRoute: { [key: string]: string } = {
  sunoIndia: '/sunoIndia',
  boloIndia: '/boloIndia',
  likhoIndia: '/likhoIndia',
  dekhoIndia: '/dekhoIndia',
} as const;

const routePaths: { [key: string]: string } = {
  root: '/',
  home: '/home',
  sunoIndiaHome: `${initiativeBaseRoute.sunoIndia}/home`,
  sunoIndiatranscribe: `${initiativeBaseRoute.sunoIndia}/record.html`,
  sunoIndiavalidate: `${initiativeBaseRoute.sunoIndia}/validator-page.html`,
  boloIndiaHome: '/boloIndia/home.html',
  likhoIndiaHome: '/likhoIndia/home.html',
  dekhoIndiaHome: '/dekhoIndia/home.html',
  badges: '/badges.html',
  myBadges: '/my-badges.html',
  termsAndConditions: '/terms-and-conditions.html',
  privacyPolicy: '/terms-and-conditions.html#privacy-policy',
} as const;

export default routePaths;
