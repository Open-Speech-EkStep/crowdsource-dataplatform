import nodeConfig from 'constants/nodeConfig';

const routePaths: { [key: string]: string } = {
  root: '/',
  home: `${nodeConfig.contextRoot}/home`,
  sunoIndiaHome: `${nodeConfig.contextRoot}/sunoIndia/home.html`,
  boloIndiaHome: `${nodeConfig.contextRoot}/boloIndia/home.html`,
  likhoIndiaHome: `${nodeConfig.contextRoot}/likhoIndia/home.html`,
  dekhoIndiaHome: `${nodeConfig.contextRoot}/dekhoIndia/home.html`,
  badges: `${nodeConfig.contextRoot}/badges.html`,
  myBadges: `${nodeConfig.contextRoot}/my-badges.html`,
  termsAndConditions: `${nodeConfig.contextRoot}/terms-and-conditions.html`,
  privacyPolicy: `${nodeConfig.contextRoot}/terms-and-conditions.html#privacy-policy`,
} as const;

export default routePaths;
