import { accommodations } from "@/data/accommodations";
import { pricingSettings } from "@/data/settings";
import { getTransferTotalIsk, transfers } from "@/data/transfers";
import type { TripPackage } from "@/data/types";

export function convertISKToEUR(isk: number, eurToIskRate = pricingSettings.eurToIskRate) {
  return isk / eurToIskRate;
}

export function formatISK(isk: number) {
  return `ISK ${new Intl.NumberFormat("en-US").format(Math.round(isk))}`;
}

export function formatEUR(eur: number) {
  return `approx. €${new Intl.NumberFormat("en-US").format(Math.round(eur))}`;
}

export function formatDualCurrency(isk: number) {
  return `${formatISK(isk)} / ${formatEUR(convertISKToEUR(isk))}`;
}

export function calculatePackageTotal(pkg: TripPackage, includeKnownTransfers = false) {
  const accommodationTotal = pkg.accommodationIds.reduce((sum, id) => {
    const accommodation = accommodations.find((item) => item.id === id);
    return sum + (accommodation?.priceIsk ?? 0);
  }, 0);

  const transferTotal = includeKnownTransfers
    ? (pkg.knownTransferIds ?? []).reduce((sum, id) => {
        const transfer = transfers.find((item) => item.id === id);
        return sum + (transfer ? getTransferTotalIsk(transfer) : 0);
      }, 0)
    : 0;

  return accommodationTotal + transferTotal;
}
