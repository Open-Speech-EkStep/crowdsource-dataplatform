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
  boloIndiaHome: `${initiativeBaseRoute.boloIndia}/home`,
  boloIndiaContribute: `${initiativeBaseRoute.boloIndia}/record.html`,
  boloIndiaValidate: `${initiativeBaseRoute.boloIndia}/validator-page.html`,
  boloIndiaDashboard: `${initiativeBaseRoute.boloIndia}/dashboard.html`,
  dekhoIndiaHome: `${initiativeBaseRoute.dekhoIndia}/home`,
  dekhoIndiaContribute: `${initiativeBaseRoute.dekhoIndia}/record.html`,
  dekhoIndiaValidate: `${initiativeBaseRoute.dekhoIndia}/validator-page.html`,
  dekhoIndiaDashboard: `${initiativeBaseRoute.dekhoIndia}/dashboard.html`,
  likhoIndiaHome: `${initiativeBaseRoute.likhoIndia}/home`,
  likhoIndiaContribute: `${initiativeBaseRoute.likhoIndia}/record.html`,
  likhoIndiaValidate: `${initiativeBaseRoute.likhoIndia}/validator-page.html`,
  likhoIndiaDashboard: `${initiativeBaseRoute.likhoIndia}/dashboard.html`,
  badges: '/badges.html',
  myBadges: '/my-badges.html',
  termsAndConditions: '/terms-and-conditions.html',
  privacyPolicy: '/terms-and-conditions.html#privacy-policy',
} as const;

export default routePaths;
