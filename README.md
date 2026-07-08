# Tripmaker2000

A simple, editable Next.js trip package selection site for Canary Islands family trips.

## What is included

- Package overview cards for Tenerife-only and Tenerife/Fuerteventura options.
- Package detail sections with timelines, known costs, missing costs, and booking buttons.
- Comparison table with ISK source prices and approximate EUR estimates.
- Accommodation library built from local TypeScript data files.
- Mobile-first styling suitable for Vercel deployment.

## Edit prices and accommodation details

Accommodation prices live in `src/data/accommodations.ts`.

1. Find the accommodation by `id`.
2. Update `priceIsk` and, if useful, `previousPriceIsk`.
3. Keep ISK as the source-of-truth currency.

If a booking price is originally listed in EUR, store the manually calculated ISK estimate in `priceIsk` so package totals and comparisons still work in ISK. Also add `sourcePriceEur`, `previousSourcePriceEur` if relevant, and a short `sourceCurrencyNote` explaining the exchange-rate calculation, for example `€3,155 × 145 ISK/EUR = ISK 457,475`. This keeps the final comparison visible in ISK while making it clear when the ISK amount is an estimate from a EUR source price.

Package totals are calculated from accommodation IDs, so package cards and the comparison table update automatically.

Some accommodations may not yet have booking links. Keep those accommodations visible, leave `bookingLink` unset, and let the UI show the disabled secondary button text “Booking link coming soon”. Do not hide the accommodation or crash the page while the link is missing.

## Update the EUR exchange rate

The manually configured exchange rate lives in `src/data/settings.ts`:

```ts
export const pricingSettings = {
  eurToIskRate: 145,
  currencyNote: "EUR prices are estimates based on a manually configured exchange rate.",
};
```

Change `eurToIskRate` when you want to refresh EUR estimates. EUR display is approximate and calculated as `ISK / eurToIskRate`.

## Add images

The site uses browser/public image paths such as `/images/placeholder-trip.svg` and falls back to that placeholder so the build does not fail while JPGs are missing. Do not use `/public/images/...` in React or Next image `src` values.

Future accommodation image paths are already stored in `src/data/accommodations.ts`. Add real JPG files here when available:

- `public/images/accommodations/hovima-atlantis-01.jpg`
- `public/images/accommodations/hovima-atlantis-02.jpg`
- `public/images/accommodations/home2book-bereber-santa-cruz-01.jpg`
- `public/images/accommodations/home2book-bereber-santa-cruz-02.jpg`
- `public/images/accommodations/hotel-arena-beach-01.jpg`
- `public/images/accommodations/hotel-arena-beach-02.jpg`
- `public/images/accommodations/occidental-jandia-mar-01.jpg`
- `public/images/accommodations/occidental-jandia-mar-02.jpg`
- `public/images/accommodations/ona-hollywood-mirage-01.jpg`
- `public/images/accommodations/ona-hollywood-mirage-02.jpg`
- `public/images/accommodations/livvo-coloradamar-01.jpg`
- `public/images/accommodations/livvo-coloradamar-02.jpg`
- `public/images/accommodations/barcelo-santa-cruz-contemporaneo-01.jpg`
- `public/images/accommodations/barcelo-santa-cruz-contemporaneo-02.jpg`
- `public/images/accommodations/hotel-mirador-papagayo-livvo-01.jpg`
- `public/images/accommodations/hotel-mirador-papagayo-livvo-02.jpg`

The UI reads the first browser path from each accommodation's `images` array and falls back to `/images/placeholder-trip.svg` when an array is empty. Package and booking buttons must never point to image files.

## Add a new trip package

1. Add any new stay to `src/data/accommodations.ts`.
2. Add any transfer estimate to `src/data/transfers.ts` if needed.
3. Add a new object to `tripPackages` in `src/data/packages.ts`.
4. Reference accommodation IDs in `accommodationIds`.
5. Reference transfer IDs in `knownTransferIds` if the package has known transfer estimates.
6. Add missing or unknown costs in `missingCosts` so they remain visible.

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js settings.
4. Vercel will run `npm install` and `npm run build`.

## Local development

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```
