import nodeConfig from 'constants/nodeConfig';

const routePaths: { [key: string]: string } = {
  root: '/',
  home: `${nodeConfig.contextRoot}/home`,
  sunoIndiaHome: `${nodeConfig.contextRoot}/sunoIndia/home.html`,
  boloIndiaHome: `${nodeConfig.contextRoot}/boloIndia/home.html`,
  likhoIndiaHome: `${nodeConfig.contextRoot}/likhoIndia/home.html`,
  dekhoIndiaHome: `${nodeConfig.contextRoot}/dekhoIndia/home.html`,
  badges: `${nodeConfig.contextRoot}/badges.html`,
} as const;

export default routePaths;
