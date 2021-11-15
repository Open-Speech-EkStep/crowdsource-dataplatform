import type { InitiativeType } from 'types/InitiativeType';

export interface ActionInterface {
  device: string;
  browser: string;
  country: string;
  state: string;
  type: InitiativeType;
  sentenceId: number;
}

export interface ActionStoreInterface extends ActionInterface {
  speakerDetails: any;
  language: string;
  userInput: string;
  fromLanguage?: string;
}

export interface ActionStoreBoloInterface extends ActionInterface {
  speakerDetails: any;
  language: string;
  audio_data?: Blob;
  audioDuration?: number;
}
