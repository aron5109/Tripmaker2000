"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { pricingSettings } from "@/data/settings";
import type { Accommodation } from "@/data/types";
import {
  shortDate,
  splitAvailability,
  staysForSlot,
  tripSplits,
  type SlotDefinition,
  type TripSplit,
} from "@/lib/picker";
import { convertISKToEUR, formatEUR, formatISK } from "@/lib/pricing";

function getPublicImageSrc(images?: string[]) {
  const src = images?.find((image) => image.startsWith("/images/") && !image.startsWith("/public/"));
  return src ?? "/images/placeholder-trip.svg";
}

function slotDateLabel(slot: SlotDefinition) {
  return `${shortDate(slot.checkIn)} → ${shortDate(slot.checkOut)}`;
}

function StayPickCard({
  stay,
  selected,
  onSelect,
}: {
  stay: Accommodation;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button type="button" className={`pick-card${selected ? " pick-card-selected" : ""}`} onClick={onSelect} aria-pressed={selected}>
      <Image className="pick-image" src={getPublicImageSrc(stay.images)} alt={stay.name} width={640} height={360} />
      <div className="pick-body">
        <p className="eyebrow">{stay.island} · {stay.area}</p>
        <h4>{stay.name}</h4>
        <p className="muted small">{stay.type} · {stay.board}</p>
        {stay.priceIsk > 0 ? (
          <div className="price">
            <strong>{formatISK(stay.priceIsk)}</strong>
            <span>{formatEUR(convertISKToEUR(stay.priceIsk))}</span>
          </div>
        ) : (
          <div className="price">
            <strong>Price TBD</strong>
            <span>Quote needed for these dates</span>
          </div>
        )}
        {stay.availabilityNote && <p className="warning small">{stay.availabilityNote}</p>}
        <span className="pick-state">{selected ? "✓ Selected" : "Choose this stay"}</span>
      </div>
    </button>
  );
}

function SlotSection({
  slot,
  stepNumber,
  selectedId,
  onSelect,
  locked,
}: {
  slot: SlotDefinition;
  stepNumber: number;
  selectedId?: string;
  onSelect: (id: string) => void;
  locked?: boolean;
}) {
  const stays = useMemo(() => staysForSlot(slot), [slot]);

  return (
    <div className={`picker-step${locked ? " picker-step-locked" : ""}`}>
      <div className="picker-step-heading">
        <span className="step-number">{stepNumber}</span>
        <div>
          <h3>{slot.label}: pick where to sleep</h3>
          <p className="muted">
            {slotDateLabel(slot)} · {slot.nights} nights
            {stepNumber > 2 && " — dates locked in automatically by your first pick"}
          </p>
        </div>
      </div>
      {locked ? (
        <p className="muted">Pick your first stay above and this step unlocks with the matching dates.</p>
      ) : stays.length === 0 ? (
        <p className="warning">No priced stays yet for {slotDateLabel(slot)}. Add one in <code>src/data/accommodations.ts</code> with these exact dates and it will appear here.</p>
      ) : (
        <div className="pick-grid">
          {stays.map((stay) => (
            <StayPickCard key={stay.id} stay={stay} selected={selectedId === stay.id} onSelect={() => onSelect(stay.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingLinkButton({ stay }: { stay: Accommodation }) {
  if (!stay.bookingLink) {
    return <span className="button button-secondary button-small" aria-disabled="true">Booking link coming soon</span>;
  }
  return (
    <a className="button button-small" href={stay.bookingLink} target="_blank" rel="noopener noreferrer">
      Book {stay.name}
    </a>
  );
}

export default function TripPicker() {
  const [splitId, setSplitId] = useState<string>(tripSplits[0].id);
  const [selections, setSelections] = useState<Record<number, string | undefined>>({});

  const split: TripSplit = tripSplits.find((item) => item.id === splitId) ?? tripSplits[0];

  const selectedStays = split.slots.map((slot, index) => {
    const id = selections[index];
    return id ? staysForSlot(slot).find((stay) => stay.id === id) : undefined;
  });

  const allChosen = selectedStays.every(Boolean);
  const chosen = selectedStays.filter(Boolean) as Accommodation[];
  const totalIsk = chosen.reduce((sum, stay) => sum + stay.priceIsk, 0);
  const hasUnpriced = chosen.some((stay) => stay.priceIsk === 0);
  const islands = Array.from(new Set(chosen.map((stay) => stay.island)));
  const interIsland = islands.length > 1;

  function chooseSplit(id: string) {
    setSplitId(id);
    setSelections({});
  }

  function chooseStay(slotIndex: number, stayId: string) {
    setSelections((previous) => ({ ...previous, [slotIndex]: stayId }));
  }

  return (
    <section className="container" id="picker">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Build your own trip</p>
          <h2>Pick your stays</h2>
        </div>
      </div>
      <p className="subtitle">
        The trip is fixed at 21 nights, 17 Aug – 7 Sep 2026. Choose how to split it — your first pick
        automatically locks the dates for the second stay.
      </p>

      {/* Step 1: split */}
      <div className="picker-step">
        <div className="picker-step-heading">
          <span className="step-number">1</span>
          <div>
            <h3>How do you want to split the 21 nights?</h3>
          </div>
        </div>
        <div className="split-grid">
          {tripSplits.map((item) => {
            const { available, perSlot } = splitAvailability(item);
            const isSelected = item.id === splitId;
            return (
              <button
                key={item.id}
                type="button"
                className={`split-card${isSelected ? " split-card-selected" : ""}${available ? "" : " split-card-disabled"}`}
                onClick={() => available && chooseSplit(item.id)}
                aria-pressed={isSelected}
                disabled={!available}
              >
                <h4>{item.name}</h4>
                <p className="muted small">{item.description}</p>
                <ul className="split-slots">
                  {item.slots.map((slot, index) => (
                    <li key={slot.label}>
                      <strong>{slot.label}</strong> · {slotDateLabel(slot)} · {slot.nights} nights
                      {!available && perSlot[index] === 0 && <em> — no priced stays yet</em>}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {/* Steps 2..n: one per slot, later slots unlock in order */}
      {split.slots.map((slot, index) => (
        <SlotSection
          key={`${split.id}-${slot.label}`}
          slot={slot}
          stepNumber={index + 2}
          selectedId={selections[index]}
          onSelect={(id) => chooseStay(index, id)}
          locked={index > 0 && !selections[index - 1]}
        />
      ))}

      {/* Summary */}
      <div className={`summary-bar${allChosen ? " summary-bar-ready" : ""}`}>
        {allChosen ? (
          <>
            <div className="summary-main">
              <p className="eyebrow">Your trip · 17 Aug – 7 Sep 2026</p>
              <p className="summary-route">
                {chosen.map((stay, index) => (
                  <span key={stay.id}>
                    {index > 0 && " → "}
                    <strong>{stay.name}</strong> ({stay.island}, {split.slots[index].nights}n)
                  </span>
                ))}
              </p>
              {interIsland && (
                <p className="warning small">
                  This combination crosses islands ({islands.join(" + ")}), so a ferry or flight is needed —
                  that transfer is not included in the total below.
                </p>
              )}
            </div>
            <div className="summary-total">
              <div className="price">
                <strong>{formatISK(totalIsk)}{hasUnpriced ? " + TBD" : ""}</strong>
                <span>
                  {hasUnpriced
                    ? "Partial total — one of your stays has no price quote yet"
                    : `${formatEUR(convertISKToEUR(totalIsk))} at ${pricingSettings.eurToIskRate} ISK/EUR`}
                </span>
              </div>
              <div className="summary-actions">
                {chosen.map((stay) => (
                  <BookingLinkButton key={stay.id} stay={stay} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="muted">
            {split.slots.length === 1
              ? "Pick a stay above to see your total."
              : "Pick a stay for each block above to see your total."}
          </p>
        )}
      </div>
    </section>
  );
}
