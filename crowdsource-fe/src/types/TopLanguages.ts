export interface TopLanguagesBySpeaker {
  language: string;
  total_speakers: number;
  type: string;
}

export interface TopLanguagesByHours {
  language: string;
  total_contribution_count: number;
  total_contributions: number;
  type: string;
}
