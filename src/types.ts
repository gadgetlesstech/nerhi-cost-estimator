export interface EstimatorState {
  squareFootage: number;
  stories: string;
  slope: "flat" | "normal" | "steep";
  skylights: number;
  chimneys: number;
  roofVents: number;
  replaceGutters: boolean;
  shingleGrade: "standard" | "premium" | "both";
  fullName: string;
  email: string;
  phone: string;
}

export interface CalculationResult {
  squares: number;
  approxRoofAreaSqFt: number;
  estimatedRange: {
    low: number;
    high: number;
  };
  premiumRange: {
    low: number;
    high: number;
  };
  promotionalDiscount: number;
  monthlyPaymentEstimate: number;
  breakdown: {
    laborAndTearOff: number;
    materialsAndUnderlayment: number;
    flashingAndPenetrations: number;
    guttersAndGuards: number;
  };
}

export interface DirectScheduleState {
  serviceNeeded: string;
  roofAge: string;
  town: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  town: string;
  rating: number;
  date: string;
  avatarText: string;
  avatarBg: string;
  reviewText: string;
  highlight?: string;
  verified: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  bullets: string[];
}

export type ThemeMode = "professional" | "classic" | "minimal";

export interface ProjectItem {
  id: string;
  title: string;
  town: string;
  shingleType: string;
  imageUrl: string;
  beforeImageUrl?: string;
  tag: string;
  completionYear?: string;
  warrantyYears?: number;
}
