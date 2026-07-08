import Image from "next/image";
import { accommodations } from "@/data/accommodations";
import { tripPackages } from "@/data/packages";
import { pricingSettings, tripSettings } from "@/data/settings";
import { getTransferTotalIsk, transfers } from "@/data/transfers";
import type { Accommodation, TripPackage } from "@/data/types";
import { calculatePackageTotal, formatDualCurrency, formatEUR, formatISK, convertISKToEUR } from "@/lib/pricing";

const byId = new Map(accommodations.map((item) => [item.id, item]));
const transferById = new Map(transfers.map((item) => [item.id, item]));

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "warm" | "green" | "warn" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Price({ isk }: { isk: number }) {
  return (
    <div className="price">
      <strong>{formatISK(isk)}</strong>
      <span>{formatEUR(convertISKToEUR(isk))}</span>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: TripPackage }) {
  const total = calculatePackageTotal(pkg);
  return (
    <article className="card package-card">
      <div className="card-topline">
        <Badge tone={pkg.label === "Best Value" ? "green" : pkg.ferryNeeded ? "warm" : "default"}>{pkg.label}</Badge>
        {pkg.ferryNeeded ? <Badge tone="warn">Ferry Needed</Badge> : <Badge>Tenerife Only</Badge>}
      </div>
      <h3>{pkg.name}</h3>
      <p className="muted">{pkg.fullDates}</p>
      <Price isk={total} />
      <dl className="quick-facts">
        <div><dt>Islands</dt><dd>{pkg.islands.join(" + ")}</dd></div>
        <div><dt>Ferry needed</dt><dd>{pkg.ferryNeeded ? "Yes" : "No"}</dd></div>
        <div><dt>Board</dt><dd>{pkg.boardSummary.join("; ")}</dd></div>
      </dl>
      <p>{pkg.bestFor}</p>
      <a className="button" href={`#${pkg.id}`}>View package</a>
    </article>
  );
}

function AccommodationMini({ accommodation }: { accommodation: Accommodation }) {
  return (
    <article className="stay-card">
      <Image className="stay-image" src="/images/placeholder-trip.svg" alt="Travel placeholder" width={640} height={360} />
      <div>
        <p className="eyebrow">{accommodation.shortDates} · {accommodation.nights} nights</p>
        <h4>{accommodation.name}</h4>
        <p className="muted">{accommodation.area}, {accommodation.island}</p>
        <Price isk={accommodation.priceIsk} />
        <a className="button button-small" href={accommodation.bookingLink} target="_blank" rel="noreferrer">Open booking link</a>
      </div>
    </article>
  );
}

function PackageDetail({ pkg }: { pkg: TripPackage }) {
  const packageAccommodations = pkg.accommodationIds.map((id) => byId.get(id)).filter(Boolean) as Accommodation[];
  const packageTransfers = (pkg.knownTransferIds ?? []).map((id) => transferById.get(id)).filter(Boolean);

  return (
    <section className="detail card" id={pkg.id}>
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Package detail</p>
          <h3>{pkg.name}</h3>
        </div>
        <div className="card-topline"><Badge>{pkg.label}</Badge>{pkg.ferryNeeded && <Badge tone="warn">Transfer TBD</Badge>}</div>
      </div>
      {pkg.ferryNeeded && <p className="warning">Ferry estimate is included as a known extra, but local transfer costs are still TBD.</p>}
      <div className="timeline">
        {packageAccommodations.map((stay) => <AccommodationMini key={stay.id} accommodation={stay} />)}
      </div>
      <div className="detail-grid">
        <div><h4>Known costs</h4><ul><li>Accommodation total: {formatDualCurrency(calculatePackageTotal(pkg))}</li>{packageTransfers.map((transfer) => <li key={transfer.id}>{transfer.name}: {formatISK(getTransferTotalIsk(transfer))} / {formatEUR(transfer.totalEur)} for {transfer.passengers} passengers</li>)}</ul></div>
        <div><h4>Missing costs / TBD</h4><ul>{pkg.importantNotes.map((note) => <li key={note}>{note}</li>)}{(pkg.missingCosts ?? []).map((cost) => <li key={cost}>{cost}</li>)}</ul></div>
        <div><h4>Best reasons to choose</h4><ul>{pkg.sellingPoints.map((point) => <li key={point}>{point}</li>)}</ul></div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Family trip planner · Canary Islands</p>
          <h1>Canary Islands Family Trip Packages</h1>
          <p className="subtitle">Compare Tenerife and Fuerteventura package ideas for {tripSettings.fullTravelPeriod}.</p>
          <div className="hero-badges"><Badge>{tripSettings.guests}</Badge><Badge>{tripSettings.rooms}</Badge><Badge>Rate: €1 = ISK {pricingSettings.eurToIskRate}</Badge></div>
        </div>
      </section>

      <section className="container">
        <div className="note">{pricingSettings.currencyNote} Prices are planning estimates and are not final booking confirmations.</div>
        <div className="section-heading"><div><p className="eyebrow">Choose a route</p><h2>Package overview</h2></div></div>
        <div className="package-grid">{tripPackages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}</div>
      </section>

      <section className="container">
        <div className="section-heading"><div><p className="eyebrow">Side-by-side</p><h2>Comparison table</h2></div></div>
        <div className="table-wrap"><table><thead><tr><th>Package</th><th>Total ISK</th><th>Approx. EUR</th><th>Ferry needed</th><th>All-inclusive?</th><th>Best for</th><th>Notes</th></tr></thead><tbody>{tripPackages.map((pkg) => { const total = calculatePackageTotal(pkg); return <tr key={pkg.id}><td>{pkg.name}</td><td>{formatISK(total)}</td><td>{formatEUR(convertISKToEUR(total))}</td><td>{pkg.ferryNeeded ? "Yes" : "No"}</td><td>{pkg.boardSummary.some((item) => item.toLowerCase().includes("all inclusive")) ? "Second week" : "No"}</td><td>{pkg.bestFor}</td><td>{pkg.importantNotes.join(" ")} {(pkg.missingCosts ?? []).join(" ")}</td></tr>; })}</tbody></table></div>
      </section>

      <section className="container details">{tripPackages.map((pkg) => <PackageDetail key={pkg.id} pkg={pkg} />)}</section>

      <section className="container">
        <div className="section-heading"><div><p className="eyebrow">Reusable stays</p><h2>Accommodation library</h2></div></div>
        <div className="accommodation-grid">{accommodations.map((stay) => <article className="card accommodation-card" key={stay.id}><Image className="library-image" src="/images/placeholder-trip.svg" alt="Travel placeholder" width={640} height={360} /><div className="card-body"><p className="eyebrow">{stay.type}</p><h3>{stay.name}</h3><p className="muted">{stay.area}, {stay.island} · {stay.dates}</p><Price isk={stay.priceIsk} />{stay.previousPriceIsk && <p className="muted">Previous price: {formatISK(stay.previousPriceIsk)}</p>}<p><strong>Board:</strong> {stay.board}</p><div className="chips">{stay.facilities.slice(0, 6).map((facility) => <span key={facility}>{facility}</span>)}</div>{stay.notes && <p className="warning small">{stay.notes.join(" ")}</p>}<a className="button" href={stay.bookingLink} target="_blank" rel="noreferrer">Open booking link</a></div></article>)}</div>
      </section>
    </main>
  );
}
