const initiativeBaseRoute: { [key: string]: string } = {
  sunoIndia: '/suno-india',
  boloIndia: '/bolo-india',
  likhoIndia: '/likho-india',
  dekhoIndia: '/dekho-india',
} as const;

const routePaths: { [key: string]: string } = {
  root: '/',
  home: '/home',
  sunoIndiaHome: `${initiativeBaseRoute.sunoIndia}`,
  sunoIndiaContributeThankYou: `${initiativeBaseRoute.sunoIndia}/contribute/thank-you`,
  sunoIndiaValidateThankYou: `${initiativeBaseRoute.sunoIndia}/validate/thank-you`,
  sunoIndiaContribute: `${initiativeBaseRoute.sunoIndia}/contribute`,
  sunoIndiaValidate: `${initiativeBaseRoute.sunoIndia}/validate`,
  sunoIndiaDashboard: `${initiativeBaseRoute.sunoIndia}/dashboard`,
  boloIndiaHome: `${initiativeBaseRoute.boloIndia}`,
  boloIndiaContribute: `${initiativeBaseRoute.boloIndia}/contribute`,
  boloIndiaValidate: `${initiativeBaseRoute.boloIndia}/validate.html`,
  boloIndiaDashboard: `${initiativeBaseRoute.boloIndia}/dashboard.html`,
  boloIndiaContributeThankYou: `${initiativeBaseRoute.boloIndia}/contribute/thank-you`,
  boloIndiaValidateThankYou: `${initiativeBaseRoute.boloIndia}/validate/thank-you`,
  dekhoIndiaHome: `${initiativeBaseRoute.dekhoIndia}`,
  dekhoIndiaContribute: `${initiativeBaseRoute.dekhoIndia}/contribute`,
  dekhoIndiaValidate: `${initiativeBaseRoute.dekhoIndia}/validate.html`,
  dekhoIndiaDashboard: `${initiativeBaseRoute.dekhoIndia}/dashboard`,
  dekhoIndiaContributeThankYou: `${initiativeBaseRoute.dekhoIndia}/contribute/thank-you`,
  dekhoIndiaValidateThankYou: `${initiativeBaseRoute.dekhoIndia}/validate/thank-you`,
  likhoIndiaHome: `${initiativeBaseRoute.likhoIndia}`,
  likhoIndiaContribute: `${initiativeBaseRoute.likhoIndia}/contribute`,
  likhoIndiaValidate: `${initiativeBaseRoute.likhoIndia}/validate.html`,
  likhoIndiaDashboard: `${initiativeBaseRoute.likhoIndia}/dashboard.html`,
  likhoIndiaContributeThankYou: `${initiativeBaseRoute.likhoIndia}/contribute/thank-you`,
  likhoIndiaValidateThankYou: `${initiativeBaseRoute.likhoIndia}/validate/thank-you`,
  badges: '/badges.html',
  myBadges: '/my-badges',
  termsAndConditions: '/terms-and-conditions.html',
  privacyPolicy: '/terms-and-conditions.html#privacy-policy',
} as const;

export default routePaths;
