
export interface RecipientProfile {
  relation: string;
  customRelation?: string;
  age: string;
  gender: string;
  interests: string;
  occasion: string;
  budget: string;
  currency: string;
  taste: string;
  exclusions?: string;
  isAcquaintance?: boolean; // New flag for "I don't know them well"
}

export interface GiftIdea {
  title: string;
  reason: string;
  retailer: string;
  estimatedPrice: string;
  imageKeyword: string; // Used to generate the image
  imageUrl?: string;    // The constructed URL
}

export enum AppState {
  LANDING = 'LANDING',
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}