export type RatingMap = Record<string, number>;

export type Accommodation = {
  id: string;
  name: string;
  slug: string;
  island: "Tenerife" | "Fuerteventura";
  area: string;
  address?: string;
  dates: string;
  shortDates: string;
  nights: number;
  guests: string;
  priceIsk: number;
  previousPriceIsk?: number;
  sourcePriceEur?: number;
  previousSourcePriceEur?: number;
  sourceCurrencyNote?: string;
  type: string;
  unit?: string;
  board: string;
  size?: string;
  locationNotes?: string[];
  facilities: string[];
  ratings?: RatingMap;
  overallRating?: number;
  reviewCount?: number;
  familyRating?: string;
  notes?: string[];
  bookingUrl: string;
  images: string[];
};

export type Transfer = {
  id: string;
  name: string;
  passengers: number;
  pricePerPassengerEur: number;
  totalEur: number;
  notes: string[];
};

export type TripPackage = {
  id: string;
  name: string;
  slug: string;
  label: "Best Value" | "All Inclusive" | "Family Resort" | "Tenerife Only";
  secondaryLabel?: string;
  badges?: string[];
  fullDates: string;
  accommodationIds: string[];
  islands: string[];
  ferryNeeded: boolean;
  boardSummary: string[];
  bestFor: string;
  sellingPoints: string[];
  importantNotes: string[];
  knownTransferIds?: string[];
  missingCosts?: string[];
};
