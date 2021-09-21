import nodeConfig from './nodeConfig';

const apiPaths = {
  languagesWithData: '/aggregated-json/languagesWithData.json',
  enableDisableCards: '/aggregated-json/enableDisableCards.json',
  initiativeGoals: '/aggregated-json/initiativeGoals.json',
  cumulativeCount: '/aggregated-json/cumulativeCount.json',
  topLanguagesByHoursContributed: '/aggregated-json/topLanguagesByHoursContributed.json',
  topLanguagesBySpeakerContributions: '/aggregated-json/topLanguagesBySpeakerContributions.json',
  participationStats: nodeConfig.staticFileUrl + '/aggregated-json/participationStats.json',
  feedback: nodeConfig.apiUrl + '/feedback',
};

export default apiPaths;
