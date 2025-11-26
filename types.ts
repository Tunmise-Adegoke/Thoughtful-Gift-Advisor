
export interface RecipientProfile {
  relation: string;
  customRelation?: string;
  age: string;
  interests: string;
  occasion: string;
  budget: string;
  taste: string;
  exclusions?: string;
}

export interface GiftIdea {
  title: string;
  reason: string;
  retailer: string;
  estimatedPrice: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}