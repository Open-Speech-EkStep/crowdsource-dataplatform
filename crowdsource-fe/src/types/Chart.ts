export interface CumulativeCount {
  total_contribution_count: number;
  total_contributions: number;
  total_languages: number;
  total_validation_count: number;
  total_validations: number;
  type: string;
}

export interface ChartDetails {
  data: Array<any>;
  colors?: Array<string>;
  isScrollbar?: boolean;
  tooltipTemplate?: string;
  xAxisLabel?: string | any;
  yAxisLabel?: string | any;
}

export interface TopLanguagesByHours {
  language: string;
  total_contribution_count: number;
  total_contributions: number;
  type: string;
}

export interface TopLanguagesBySpeaker {
  language: string;
  total_speakers: number;
  type: string;
}
