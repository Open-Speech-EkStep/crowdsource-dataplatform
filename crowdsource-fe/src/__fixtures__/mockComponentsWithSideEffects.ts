jest.mock('components/ContributionStats', () => () => 'ContributionStats');
jest.mock('components/ParticipationStats', () => () => 'ParticipationStats');
jest.mock('components/Feedback', () => () => 'Feedback');
jest.mock('components/TargetProgress', () => () => 'Feedback');
jest.mock('components/IndiaMapChart', () => () => 'IndiaMapChart');
jest.mock('components/ProgressChart', () => () => 'ProgressChart');
jest.mock('components/AgeChart', () => () => 'AgeChart');
jest.mock('components/GenderChart', () => () => 'GenderChart');
jest.mock('components/Charts/BarChart', () => () => 'BarChart');
jest.mock('components/DataLastUpdated', () => () => 'DataLastUpdated');
jest.mock('components/TtsTranscribe', () => () => 'TtsTranscribe');
jest.mock('components/Charts/MapChart', () => () => 'MapChart');
jest.mock('components/Charts/LineChart', () => () => 'LineChart');
jest.mock('components/Charts/PieChart', () => () => 'PieChart');

export {};
