import type { InitiativeType } from 'types/InitiativeType';

export interface CumulativeDataByDateAndLanguage {
  year: number;
  month: number;
  quarter: number;
  language: string;
  cumulative_contributions: number;
  cumulative_validations: number;
  total_contribution_count: number;
  total_validation_count: number;
  type: InitiativeType;
}
