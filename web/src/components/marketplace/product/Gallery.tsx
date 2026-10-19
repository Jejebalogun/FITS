"use client";

import { useState } from "react";

import SaveButton from "@/components/marketplace/SaveButton";
import type { Product } from "@/data/marketplace";

const THUMBS_SHOWN = 4;

/**
 * Until product photography lands, each photo is the piece's tone in a
 * different light, so the gallery still reads as several shots.
 */
const SHOTS = [
  "",
  "brightness-90 saturate-75",
  "brightness-110",
  "brightness-75",
  "saturate-50",
  "brightness-105 contrast-125",
  "brightness-125 saturate-50",
  "brightness-95 contrast-75",
  "brightness-[.6]",
];

export default function Gallery({ product }: { product: Product }) {
  const count = Math.min(product.photos ?? 4, SHOTS.length);
  const [active, setActive] = useState(0);

  // With more photos than fit, the last tile stands for the rest: "+4".
  const overflow = count > THUMBS_SHOWN + 1;
  const thumbs = overflow ? THUMBS_SHOWN : count;

  function step(by: number) {
    setActive((index) => (index + by + count) % count);
  }

  return (
    <div className="flex gap-5">
      {count > 1 && (
        <ul className="hidden w-28 shrink-0 flex-col gap-4 sm:flex">
          {Array.from({ length: thumbs }, (_, index) => (
            <li key={index}>
              <Thumb
                tone={`${product.tone} ${SHOTS[index]}`}
                selected={active === index}
                onClick={() => setActive(index)}
                label={`Photo ${index + 1} of ${count}`}
              />
            </li>
          ))}
          {overflow && (
            <li>
              <button
                type="button"
                onClick={() => setActive(THUMBS_SHOWN)}
                aria-label={`Photo ${THUMBS_SHOWN + 1} of ${count}`}
                className={`flex aspect-[4/5] w-full items-center justify-center rounded-xl bg-sand text-sm font-semibold text-forest/70 transition-colors hover:bg-sand/70 ${
                  active >= THUMBS_SHOWN ? "ring-2 ring-clay ring-offset-2 ring-offset-cream" : ""
                }`}
              >
                +{count - THUMBS_SHOWN - 1}
              </button>
            </li>
          )}
        </ul>
      )}

      <div className="relative aspect-[6/7] min-w-0 flex-1 overflow-hidden rounded-3xl">
        <div aria-hidden className={`absolute inset-0 ${product.tone} ${SHOTS[active]}`} />
        <span className="sr-only">
          {product.name}, photo {active + 1} of {count}
        </span>

        <SaveButton
          product={product}
          className="absolute right-5 top-5 h-12 w-12 bg-cream/95 text-xl"
        />

        {count > 1 && (
          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
            <span className="rounded-full bg-forest-deep/85 px-4 py-2 text-sm font-medium text-cream">
              {active + 1} of {count}
            </span>
            <span className="flex gap-2">
              <StepButton label="Previous photo" onClick={() => step(-1)}>
                ←
              </StepButton>
              <StepButton label="Next photo" onClick={() => step(1)}>
                →
              </StepButton>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Thumb({
  tone,
  selected,
  onClick,
  label,
}: {
  tone: string;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      className={`block aspect-[4/5] w-full rounded-xl transition-shadow ${tone} ${
        selected ? "ring-2 ring-clay ring-offset-2 ring-offset-cream" : "hover:opacity-90"
      }`}
    />
  );
}

function StepButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-forest transition-colors hover:bg-cream"
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}
