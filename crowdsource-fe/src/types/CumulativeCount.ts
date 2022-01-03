export interface CumulativeCount {
  total_contribution_count: number;
  total_contributions: number;
  total_languages: number;
  total_validation_count: number;
  total_validations: number;
  type: string;
}

export interface CumulativeDataByLanguage {
  total_contribution_count: number;
  total_contributions: number;
  total_languages: number;
  total_validation_count: number;
  total_validations: number;
  type: string;
  language: string;
}
