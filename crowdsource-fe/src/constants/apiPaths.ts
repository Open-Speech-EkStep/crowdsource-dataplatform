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
  genderGroupContributions: nodeConfig.staticFileUrl + '/aggregated-json/genderGroupContributions.json',
  genderGroupAndLanguageContributions:
    nodeConfig.staticFileUrl + '/aggregated-json/genderGroupAndLanguageContributions.json',
  ageGroupContributions: nodeConfig.staticFileUrl + '/aggregated-json/ageGroupContributions.json',
  ageGroupAndLanguageContributions:
    nodeConfig.staticFileUrl + '/aggregated-json/ageGroupAndLanguageContributions.json',
  participationStats: nodeConfig.staticFileUrl + '/aggregated-json/participationStats.json',
  lastUpdatedTime: nodeConfig.staticFileUrl + '/aggregated-json/lastUpdatedAtQuery.json',
  cumulativeDataByLanguage: nodeConfig.staticFileUrl + '/aggregated-json/cumulativeDataByLanguage.json',
  cumulativeDataByState: nodeConfig.staticFileUrl + '/aggregated-json/cumulativeDataByState.json',
  cumulativeDataByLanguageAndState:
    nodeConfig.staticFileUrl + '/aggregated-json/cumulativeDataByLanguageAndState.json',
  feedback: nodeConfig.apiUrl + '/feedback',
  report: nodeConfig.apiUrl + '/report',
  mediaAsr: nodeConfig.apiUrl + '/media/asr',
  mediaParallel: nodeConfig.apiUrl + '/media/parallel',
  contributionsAsr: nodeConfig.apiUrl + '/contributions/asr',
  contributionsParallel: nodeConfig.apiUrl + '/contributions/parallel',
  store: nodeConfig.apiUrl + '/store',
  validate: nodeConfig.apiUrl + '/validate',
  skip: nodeConfig.apiUrl + '/skip',
  userRewards: nodeConfig.apiUrl + '/user-rewards',
  monthlyTimelineCumulative: nodeConfig.staticFileUrl + '/aggregated-json/monthlyTimelineCumulative.json',
  quarterlyTimelineCumulative: nodeConfig.staticFileUrl + '/aggregated-json/quarterlyTimelineCumulative.json',
  monthlyTimeline: nodeConfig.staticFileUrl + '/aggregated-json/monthlyTimeline.json',
  quarterlyTimeline: nodeConfig.staticFileUrl + '/aggregated-json/quarterlyTimeline.json',
  rewards: nodeConfig.apiUrl + '/rewards',
  setCookie: nodeConfig.apiUrl + '/get-userid',
  rewardInfo: nodeConfig.apiUrl + '/rewards-info',
};

export default apiPaths;
