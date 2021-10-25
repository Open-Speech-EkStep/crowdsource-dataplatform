import nodeConfig from './nodeConfig';

const apiPaths = {
  languagesWithData: nodeConfig.staticFileUrl + '/aggregated-json/languagesWithData.json',
  enableDisableCards: nodeConfig.staticFileUrl + '/aggregated-json/enableDisableCards.json',
  initiativeGoals: nodeConfig.staticFileUrl + '/aggregated-json/initiativeGoals.json',
  initiativeGoalsByLanguage: nodeConfig.staticFileUrl + '/aggregated-json/initiativeGoalsByLanguage.json',
  cumulativeCount: nodeConfig.staticFileUrl + '/aggregated-json/cumulativeCount.json',
  topLanguagesByHoursContributed:
    nodeConfig.staticFileUrl + '/aggregated-json/topLanguagesByHoursContributed.json',
  topLanguagesBySpeakerContributions:
    nodeConfig.staticFileUrl + '/aggregated-json/topLanguagesBySpeakerContributions.json',
  participationStats: nodeConfig.staticFileUrl + '/aggregated-json/participationStats.json',
  lastUpdatedTime: nodeConfig.staticFileUrl + '/aggregated-json/lastUpdatedAtQuery.json',
  cumulativeDataByLanguage: nodeConfig.staticFileUrl + '/aggregated-json/cumulativeDataByLanguage.json',
  cumulativeDataByState: nodeConfig.staticFileUrl + '/aggregated-json/cumulativeDataByState.json',
  cumulativeDataByLanguageAndState:
    nodeConfig.staticFileUrl + '/aggregated-json/cumulativeDataByLanguageAndState.json',
  feedback: nodeConfig.apiUrl + '/feedback',
  report: nodeConfig.apiUrl + '/report',
  mediaAsr: nodeConfig.apiUrl + '/media/asr',
  store: nodeConfig.apiUrl + '/store',
  skip: nodeConfig.apiUrl + '/skip',
  monthlyTimelineCumulative: nodeConfig.staticFileUrl + '/aggregated-json/monthlyTimelineCumulative.json',
  quarterlyTimelineCumulative: nodeConfig.staticFileUrl + '/aggregated-json/quarterlyTimelineCumulative.json',
  monthlyTimeline: nodeConfig.staticFileUrl + '/aggregated-json/monthlyTimeline.json',
  quarterlyTimeline: nodeConfig.staticFileUrl + '/aggregated-json/quarterlyTimeline.json',
  rewards: nodeConfig.apiUrl + '/rewards',
};

export default apiPaths;
