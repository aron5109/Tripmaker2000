import { accommodations } from "@/data/accommodations";
import type { Accommodation } from "@/data/types";

// ---------------------------------------------------------------------------
// Trip window (source of truth for the picker)
// ---------------------------------------------------------------------------
export const TRIP_START = "2026-08-17";
export const TRIP_END = "2026-09-07";
export const TOTAL_NIGHTS = 21;

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Parse "17 August 2026" → "2026-08-17". Returns undefined if unparseable. */
function parseLongDate(text: string): string | undefined {
  const match = text.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return undefined;
  const month = MONTHS[match[2].toLowerCase()];
  if (!month) return undefined;
  return `${match[3]}-${pad(month)}-${pad(Number(match[1]))}`;
}

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(`${checkIn}T00:00:00Z`).getTime();
  const b = new Date(`${checkOut}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** "2026-08-17" → "17 Aug" / "7 Sep" for compact UI labels. */
export function shortDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(date);
}

// ---------------------------------------------------------------------------
// Accommodation stay-block resolution
// ---------------------------------------------------------------------------
export type StayBlock = {
  checkIn: string;
  checkOut: string;
  nights: number;
};

/**
 * Resolve an accommodation's dates into machine-readable check-in/out.
 * Handles both the structured object form and "17 August 2026 – 31 August 2026"
 * string form. Returns undefined when the dates cannot be resolved.
 */
export function getStayBlock(accommodation: Accommodation): StayBlock | undefined {
  const { dates } = accommodation;

  if (typeof dates === "object") {
    return { checkIn: dates.checkIn, checkOut: dates.checkOut, nights: dates.nights };
  }

  const parts = dates.split(/–|—|-{1,2}|to/).map((part) => part.trim()).filter(Boolean);
  if (parts.length !== 2) return undefined;

  const checkIn = parseLongDate(parts[0]);
  const checkOut = parseLongDate(parts[1]);
  if (!checkIn || !checkOut) return undefined;

  return { checkIn, checkOut, nights: accommodation.nights ?? nightsBetween(checkIn, checkOut) };
}

// ---------------------------------------------------------------------------
// Splits: how the 21 nights are divided
// ---------------------------------------------------------------------------
export type SlotDefinition = {
  label: string;
  checkIn: string;
  checkOut: string;
  nights: number;
};

export type TripSplit = {
  id: string;
  name: string;
  description: string;
  slots: SlotDefinition[];
};

function makeSlot(label: string, checkIn: string, nights: number): SlotDefinition {
  return { label, checkIn, checkOut: addDays(checkIn, nights), nights };
}

/**
 * The three ways to divide the fixed 21-night window.
 * Selecting the first block dictates the second block's dates:
 *   7 + 14 → 17–24 Aug, then 24 Aug – 7 Sep
 *   14 + 7 → 17–31 Aug, then 31 Aug – 7 Sep
 *   21     → single stay, second slot hidden
 */
export const tripSplits: TripSplit[] = [
  {
    id: "14-7",
    name: "14 + 7 nights",
    description: "Settle in for two weeks first, then one week somewhere new.",
    slots: [makeSlot("Stay 1", TRIP_START, 14), makeSlot("Stay 2", addDays(TRIP_START, 14), 7)],
  },
  {
    id: "7-14",
    name: "7 + 14 nights",
    description: "One week first, then two weeks at the second place.",
    slots: [makeSlot("Stay 1", TRIP_START, 7), makeSlot("Stay 2", addDays(TRIP_START, 7), 14)],
  },
  {
    id: "21",
    name: "21 nights · one place",
    description: "No moving at all — one stay for the whole trip.",
    slots: [makeSlot("Full stay", TRIP_START, 21)],
  },
];

// ---------------------------------------------------------------------------
// Matching accommodations to slots
// ---------------------------------------------------------------------------
/** All accommodations whose priced dates exactly match the slot's dates. */
export function staysForSlot(slot: SlotDefinition): Accommodation[] {
  return accommodations.filter((accommodation) => {
    const block = getStayBlock(accommodation);
    return block !== undefined && block.checkIn === slot.checkIn && block.checkOut === slot.checkOut;
  });
}

/** A split is bookable only if every slot has at least one priced stay. */
export function splitAvailability(split: TripSplit): { available: boolean; perSlot: number[] } {
  const perSlot = split.slots.map((slot) => staysForSlot(slot).length);
  return { available: perSlot.every((count) => count > 0), perSlot };
}
