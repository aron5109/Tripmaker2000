import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { accommodations } from "@/data/accommodations";
import { tripPackages } from "@/data/packages";
import { pricingSettings } from "@/data/settings";
import type { Accommodation } from "@/data/types";
import { calculatePackageTotal, convertISKToEUR, formatEUR, formatISK } from "@/lib/pricing";

const accommodationById = new Map(accommodations.map((item) => [item.id, item]));

function dateDisplay(accommodation: Accommodation) {
  return typeof accommodation.dates === "string" ? accommodation.dates : accommodation.dates.display;
}

function imageSrc(accommodation: Accommodation) {
  return accommodation.images?.[0] ?? "/images/placeholder-trip.svg";
}

function bookingUrl(accommodation: Accommodation) {
  return accommodation.bookingUrl ?? accommodation.bookingLink;
}

export function generateStaticParams() {
  return tripPackages.map((pkg) => ({ slug: pkg.slug ?? pkg.id }));
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = tripPackages.find((item) => (item.slug ?? item.id) === slug);

  if (!pkg) {
    notFound();
  }

  const packageAccommodations = pkg.accommodationIds.map((id) => accommodationById.get(id)).filter(Boolean) as Accommodation[];
  const total = calculatePackageTotal(pkg);

  return (
    <main>
      <section className="container details">
        <Link className="button button-secondary" href="/">Back to all packages</Link>
        <article className="detail card">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Package detail</p>
              <h1>{pkg.name}</h1>
              <p className="muted">{pkg.fullDates}</p>
            </div>
            <div className="card-topline">
              <span className="badge">{pkg.label}</span>
              {pkg.secondaryLabel && <span className="badge">{pkg.secondaryLabel}</span>}
              <span className="badge">{pkg.ferryNeeded ? "Ferry Needed" : "No Ferry"}</span>
            </div>
          </div>

          <div className="price">
            <strong>{formatISK(total)}</strong>
            <span>{formatEUR(convertISKToEUR(total))} at {pricingSettings.eurToIskRate} ISK/EUR</span>
          </div>

          {pkg.badges && <div className="chips">{pkg.badges.map((badge) => <span key={badge}>{badge}</span>)}</div>}

          <div className="timeline">
            {packageAccommodations.map((stay) => (
              <article className="stay-card" key={stay.id}>
                <Image className="stay-image" src={imageSrc(stay)} alt={stay.name} width={640} height={360} />
                <div>
                  <p className="eyebrow">{dateDisplay(stay)}</p>
                  <h3>{stay.name}</h3>
                  <p className="muted">{stay.area}, {stay.island}</p>
                  <p><strong>Board:</strong> {stay.board}</p>
                  <div className="price">
                    <strong>{formatISK(stay.priceIsk)}</strong>
                    {stay.sourcePriceEur && <span>source €{new Intl.NumberFormat("en-US").format(stay.sourcePriceEur)}</span>}
                  </div>
                  {bookingUrl(stay) ? <a className="button button-small" href={bookingUrl(stay)} target="_blank" rel="noopener noreferrer">View / Book</a> : <span className="button button-secondary button-small" aria-disabled="true">Booking link coming soon</span>}
                </div>
              </article>
            ))}
          </div>

          <div className="detail-grid">
            <div><h3>Board</h3><ul>{pkg.boardSummary.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>Best reasons to choose</h3><ul>{pkg.sellingPoints.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>Notes</h3><ul>{pkg.importantNotes.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </article>
      </section>
    </main>
  );
}
