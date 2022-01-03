import type { InitiativeType } from 'types/InitiativeType';

export interface CumulativeDataByLanguageAndState {
  state: string;
  language: string;
  total_speakers: number;
  total_contributions: number;
  total_validations: number;
  total_contribution_count: number;
  total_validation_count: number;
  type: InitiativeType;
}

export interface UnSpecifiedDataByState {
  state: string;
  contribution: number | string;
  validation: number | string;
  speakers: number;
  contributionText: string;
  validationText: string;
  value: number;
}
