
// Define shared types for Firebase services

export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  order?: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface VenueInfo {
  name: string;
  address: string;
  mapsUrl: string;
}

export interface WeddingDetails {
  groomName: string;
  brideName: string;
  weddingDate: string;
  story: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  description: string;
  order: number;
}

export interface GuestRSVP {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  plusOne: boolean;
  dietaryRestrictions: string;
  message: string;
  timestamp: number;
}
