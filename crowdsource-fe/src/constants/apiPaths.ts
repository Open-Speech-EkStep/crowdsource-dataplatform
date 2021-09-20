import nodeConfig from './nodeConfig';

const apiPaths = {
  participationStats: nodeConfig.staticFileUrl + '/aggregated-json/participationStats.json',
  feedback: nodeConfig.apiUrl + '/feedback',
};

export default apiPaths;
