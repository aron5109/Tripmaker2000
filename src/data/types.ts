export type RatingMap = Record<string, number>;

export type AccommodationDateRange = string | {
  checkIn: string;
  checkOut: string;
  display: string;
  nights: number;
};

export type AccommodationGuests = string | {
  adults: number;
  children: number;
  childAge: number;
};

export type Accommodation = {
  id: string;
  slug?: string;
  name: string;
  island: "Tenerife" | "Fuerteventura" | "Lanzarote";
  area: string;
  address?: string;
  dates: AccommodationDateRange;
  shortDates?: string;
  nights?: number;
  guests: AccommodationGuests;
  priceIsk: number;
  previousPriceIsk?: number;
  sourcePriceEur?: number;
  previousSourcePriceEur?: number;
  sourceCurrencyNote?: string;
  type: string;
  unit?: string;
  board: string;
  breakfastNote?: string;
  size?: string;
  roomSize?: string;
  view?: string;
  locationRating?: number;
  locationNotes?: string[];
  facilities: string[];
  ratings?: RatingMap;
  overallRating?: number;
  reviewCount?: number;
  familyRating?: string;
  notes?: string[];
  priceNote?: string;
  savings?: { eur: number; isk: number };
  bookingTerms?: string[];
  availabilityNote?: string;
  bedOptions?: string[];
  bookingLink?: string;
  bookingUrl?: string;
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
  slug?: string;
  name: string;
  label: string;
  secondaryLabel?: string;
  badges?: string[];
  fullDates: string;
  accommodationIds: string[];
  islands: string[];
  ferryNeeded: boolean;
  boardSummary: string[];
  bestFor?: string;
  sellingPoints: string[];
  sellingAngle?: string[];
  importantNotes: string[];
  notes?: string[];
  totalAccommodationIsk?: number;
  knownTransferIds?: string[];
  missingCosts?: string[];
};
