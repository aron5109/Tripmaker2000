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
  childAge?: number;
};

export type NearbyPlaces = {
  highlights?: string[];
  restaurants?: string[];
  beaches?: string[];
  airports?: string[];
};

export type Accommodation = {
  id: string;
  slug?: string;
  name: string;
  island: string;
  area: string;
  address?: string;
  dates: AccommodationDateRange;
  shortDates?: string;
  nights?: number;
  guests?: AccommodationGuests;
  type: string;
  unit?: string;
  roomSize?: string;
  size?: string;
  view?: string;
  board: string;
  breakfastNote?: string;
  priceIsk: number;
  previousPriceIsk?: number;
  sourcePriceEur?: number;
  previousSourcePriceEur?: number;
  sourceCurrencyNote?: string;
  priceNote?: string;
  savings?: {
    eur?: number;
    isk?: number;
  };
  bookingLink?: string;
  images?: string[];
  facilities: string[];
  bookingTerms?: string[];
  notes?: string[];
  ratings?: RatingMap;
  locationRating?: number;
  availabilityNote?: string;
  bedOptions?: string[];
  locationNotes?: string[];
  nearby?: NearbyPlaces;
  overallRating?: number;
  reviewCount?: number;
  familyRating?: string;
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
  packageNumber?: number;
  name: string;
  label: string;
  secondaryLabel?: string;
  fullDates: string;
  islands: string[];
  ferryNeeded: boolean;
  transferCostsTbd?: boolean;
  accommodationIds: string[];
  knownTransferIds?: string[];
  boardSummary: string[];
  totalAccommodationIsk?: number;
  sellingAngle?: string[];
  notes?: string[];
  badges?: string[];
  bestFor?: string;
  sellingPoints: string[];
  importantNotes: string[];
  missingCosts?: string[];
};
