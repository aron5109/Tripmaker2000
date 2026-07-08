import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { accommodations } from "@/data/accommodations";
import { tripPackages } from "@/data/packages";
import { pricingSettings } from "@/data/settings";
import { getPublicImageSrc } from "@/lib/images";
import { calculatePackageTotal, convertISKToEUR, formatEUR, formatISK } from "@/lib/pricing";

const accommodationById = new Map(accommodations.map((item) => [item.id, item]));

type PackagePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tripPackages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = tripPackages.find((item) => item.slug === slug);

  if (!pkg) {
    return {};
  }

  return {
    title: `${pkg.name} | Canary Islands Family Trip Packages`,
    description: pkg.bestFor,
  };
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = tripPackages.find((item) => item.slug === slug);

  if (!pkg) {
    notFound();
  }

  const packageAccommodations = pkg.accommodationIds.map((id) => accommodationById.get(id)).filter((stay) => stay !== undefined);
  const total = calculatePackageTotal(pkg);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Package detail</p>
          <h1>{pkg.name}</h1>
          <p className="subtitle">{pkg.bestFor}</p>
          <div className="hero-badges">
            <span className="badge badge-default">{pkg.fullDates}</span>
            <span className="badge badge-default">{pkg.ferryNeeded ? "Ferry needed" : "No ferry"}</span>
            <span className="badge badge-default">{pkg.islands.join(" + ")}</span>
          </div>
        </div>
      </section>

      <section className="container">
        <Link className="button button-small" href="/">Back to packages</Link>
        <article className="detail card">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Accommodation total</p>
              <h2>{formatISK(total)}</h2>
              <p className="muted">{formatEUR(convertISKToEUR(total))} at {pricingSettings.eurToIskRate} ISK/EUR.</p>
            </div>
          </div>

          <div className="timeline">
            {packageAccommodations.map((accommodation) => (
              <article className="stay-card" key={accommodation.id}>
                <Image className="stay-image" src={getPublicImageSrc(accommodation.images)} alt={accommodation.name} width={640} height={360} />
                <div>
                  <p className="eyebrow">{accommodation.shortDates} · {accommodation.nights} nights</p>
                  <h4>{accommodation.name}</h4>
                  <p className="muted">{accommodation.area}, {accommodation.island}</p>
                  <p><strong>Board:</strong> {accommodation.board}</p>
                  <p><strong>Price:</strong> {formatISK(accommodation.priceIsk)}{accommodation.sourcePriceEur ? ` / source €${new Intl.NumberFormat("en-US").format(accommodation.sourcePriceEur)}` : ""}</p>
                  <a className="button button-small" href={accommodation.bookingUrl} target="_blank" rel="noopener noreferrer">View / Book</a>
                </div>
              </article>
            ))}
          </div>

          <div className="detail-grid">
            <div><h4>Board</h4><ul>{pkg.boardSummary.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h4>Important notes</h4><ul>{pkg.importantNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
            <div><h4>Best reasons to choose</h4><ul>{pkg.sellingPoints.map((point) => <li key={point}>{point}</li>)}</ul></div>
          </div>
        </article>
      </section>
    </main>
  );
}
