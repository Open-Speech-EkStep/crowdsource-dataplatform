jest.mock('components/ContributionStats', () => () => 'ContributionStats');
jest.mock('components/ParticipationStats', () => () => 'ParticipationStats');
jest.mock('components/ContributionStatsByLanguage', () => () => 'ContributionStatsByLanguage');
jest.mock('components/Feedback', () => () => 'Feedback');
jest.mock('components/Report', () => () => 'Report');
jest.mock('components/TargetProgress', () => () => 'Feedback');
jest.mock('components/ContributionTracker', () => () => 'ContributionTracker');
jest.mock('components/Charts/BarChart', () => () => 'BarChart');
jest.mock('components/DataLastUpdated', () => () => 'DataLastUpdated');
jest.mock('components/SunoTranscribe', () => () => 'SunoTranscribe');
jest.mock('components/Charts/MapChart', () => () => 'MapChart');
jest.mock('components/Charts/LineChart', () => () => 'LineChart');
jest.mock('components/Charts/PieChart', () => () => 'PieChart');

export {};
