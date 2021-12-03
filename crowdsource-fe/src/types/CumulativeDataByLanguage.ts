import type { InitiativeType } from 'types/InitiativeType';

export interface CumulativeDataByLanguage {
  language: string;
  total_speakers: number;
  total_contributions: number;
  total_validations: number;
  total_contribution_count: number;
  total_validation_count: number;
  type: InitiativeType;
}
