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
  sunoIndiaContribute: `${initiativeBaseRoute.sunoIndia}/record`,
  sunoIndiaValidate: `${initiativeBaseRoute.sunoIndia}/validator-page.html`,
  sunoIndiaDashboard: `${initiativeBaseRoute.sunoIndia}/dashboard`,
  boloIndiaContribute: `${initiativeBaseRoute.boloIndia}/record.html`,
  boloIndiaValidate: `${initiativeBaseRoute.boloIndia}/validator-page.html`,
  boloIndiaDashboard: `${initiativeBaseRoute.boloIndia}/dashboard`,
  dekhoIndiaContribute: `${initiativeBaseRoute.dekhoIndia}/record.html`,
  dekhoIndiaValidate: `${initiativeBaseRoute.dekhoIndia}/validator-page.html`,
  boloIndiaHome: `${initiativeBaseRoute.boloIndia}/home`,
  likhoIndiaHome: '/likhoIndia/home.html',
  dekhoIndiaHome: `${initiativeBaseRoute.dekhoIndia}/home`,
  badges: '/badges.html',
  myBadges: '/my-badges.html',
  termsAndConditions: '/terms-and-conditions.html',
  privacyPolicy: '/terms-and-conditions.html#privacy-policy',
} as const;

export default routePaths;
