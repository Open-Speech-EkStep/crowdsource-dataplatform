import type { InitiativeType } from 'types/InitiativeType';

export interface CumulativeDataByState {
  state: string;
  total_speakers: number;
  total_contributions: number;
  total_validations: number;
  total_contribution_count: number | null;
  total_validation_count: number | null;
  type: InitiativeType;
}
