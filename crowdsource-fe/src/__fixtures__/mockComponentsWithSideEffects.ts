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
jest.mock('components/MapChart', () => () => 'MapChart');

export {};
