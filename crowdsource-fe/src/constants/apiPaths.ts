import nodeConfig from './nodeConfig';

const apiPaths = {
  languagesWithData: nodeConfig.staticFileUrl + '/aggregated-json/languagesWithData.json',
  enableDisableCards: nodeConfig.staticFileUrl + '/aggregated-json/enableDisableCards.json',
  initiativeGoals: nodeConfig.staticFileUrl + '/aggregated-json/initiativeGoals.json',
  cumulativeCount: nodeConfig.staticFileUrl + '/aggregated-json/cumulativeCount.json',
  topLanguagesByHoursContributed:
    nodeConfig.staticFileUrl + '/aggregated-json/topLanguagesByHoursContributed.json',
  topLanguagesBySpeakerContributions:
    nodeConfig.staticFileUrl + '/aggregated-json/topLanguagesBySpeakerContributions.json',
  participationStats: nodeConfig.staticFileUrl + '/aggregated-json/participationStats.json',
  lastUpdatedTime: nodeConfig.staticFileUrl + '/aggregated-json/lastUpdatedAtQuery.json',
  cumulativeDataByLanguage: nodeConfig.staticFileUrl + '/aggregated-json/cumulativeDataByLanguage.json',
  feedback: nodeConfig.apiUrl + '/feedback',
  report: nodeConfig.apiUrl + '/report',
  mediaAsr: nodeConfig.apiUrl + '/media/asr',
  store: nodeConfig.apiUrl + '/store',
  skip: nodeConfig.apiUrl + '/skip',
};

export default apiPaths;
