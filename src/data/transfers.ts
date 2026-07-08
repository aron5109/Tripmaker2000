import { pricingSettings } from "./settings";
import type { Transfer } from "./types";

export const transfers: Transfer[] = [
  {
    id: "tenerife-morro-jable-ferry",
    name: "Tenerife → Morro Jable ferry",
    passengers: 3,
    pricePerPassengerEur: 62,
    totalEur: 186,
    notes: [
      "Approximate ferry estimate.",
      "Needed for Fuerteventura package options.",
      "Hotel Arena Beach may also need an extra transfer from Morro Jable to Corralejo.",
      "Transfer cost from Morro Jable to Corralejo is TBD.",
    ],
  },
];

export const getTransferTotalIsk = (transfer: Transfer) => Math.round(transfer.totalEur * pricingSettings.eurToIskRate);
