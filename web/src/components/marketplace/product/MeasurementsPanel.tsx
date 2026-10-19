"use client";

import { useId, useState } from "react";

import type { Measurements } from "@/components/marketplace/ShopperProvider";

export type MeasurementField = "bust" | "waist" | "hips" | "length";

export const MEASUREMENT_FIELDS: { key: MeasurementField; label: string }[] = [
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "length", label: "Length" },
];

/** Plausible adult ranges in inches; anything outside is more likely a typo. */
const RANGES_IN: Record<MeasurementField, [number, number]> = {
  bust: [24, 70],
  waist: [18, 70],
  hips: [26, 75],
  length: [16, 70],
};

const CM_PER_IN = 2.54;

export const blankMeasurements: Measurements = {
  unit: "in",
  bust: "",
  waist: "",
  hips: "",
  length: "",
};

/** The fields that are missing or out of range, for the unit they were typed in. */
export function invalidFields(m: Measurements): MeasurementField[] {
  return MEASUREMENT_FIELDS.map((field) => field.key).filter((key) => {
    const value = Number(m[key]);
    if (!m[key].trim() || Number.isNaN(value)) return true;
    const [min, max] = RANGES_IN[key];
    const scale = m.unit === "cm" ? CM_PER_IN : 1;
    return value < min * scale || value > max * scale;
  });
}

/** Converts what has been typed, leaving blanks and half-typed values alone. */
function convertUnit(m: Measurements, unit: Measurements["unit"]): Measurements {
  if (m.unit === unit) return m;
  const next: Measurements = { ...m, unit };
  for (const { key } of MEASUREMENT_FIELDS) {
    const value = Number(m[key]);
    if (!m[key].trim() || Number.isNaN(value)) continue;
    next[key] =
      unit === "cm"
        ? String(Math.round(value * CM_PER_IN))
        : String(Math.round((value / CM_PER_IN) * 2) / 2);
  }
  return next;
}

type MeasurementsPanelProps = {
  value: Measurements;
  onChange: (next: Measurements) => void;
  /** Fields to flag, once the buyer has tried to add to cart. */
  errors: MeasurementField[];
  prefilled: boolean;
  creatorName: string;
};

export default function MeasurementsPanel({
  value,
  onChange,
  errors,
  prefilled,
  creatorName,
}: MeasurementsPanelProps) {
  const [guideOpen, setGuideOpen] = useState(false);
  const headingId = useId();

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="mt-5 rounded-2xl border-2 border-forest bg-white p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 id={headingId} className="font-semibold text-forest">
          Your measurements
        </h3>
        <div
          role="radiogroup"
          aria-label="Units"
          className="flex rounded-full border border-forest/15 p-0.5"
        >
          {(["in", "cm"] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              role="radio"
              aria-checked={value.unit === unit}
              onClick={() => onChange(convertUnit(value, unit))}
              className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                value.unit === unit ? "bg-forest text-cream" : "text-forest"
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {MEASUREMENT_FIELDS.map((field) => {
          const invalid = errors.includes(field.key);
          return (
            <label key={field.key} className="block">
              <span className="text-sm text-forest/70">{field.label}</span>
              <input
                inputMode="decimal"
                value={value[field.key]}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [field.key]: event.target.value.replace(/[^0-9.]/g, ""),
                  })
                }
                aria-invalid={invalid}
                aria-label={`${field.label} in ${value.unit === "in" ? "inches" : "centimetres"}`}
                className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 font-semibold text-forest outline-none transition-colors focus:border-clay ${
                  invalid ? "border-clay bg-clay-wash/40" : "border-forest/20"
                }`}
              />
            </label>
          );
        })}
      </div>

      {errors.length > 0 && (
        <p role="alert" className="mt-3 text-sm font-medium text-clay-deep">
          {errors.length === MEASUREMENT_FIELDS.length
            ? `Add all four measurements so ${creatorName} can make it to fit.`
            : `Check ${listFields(errors)} — ${
                errors.length === 1 ? "it looks" : "they look"
              } off for ${value.unit === "in" ? "inches" : "centimetres"}.`}
        </p>
      )}

      <p className="mt-3 text-sm text-forest/65">
        {prefilled
          ? "Filled from your saved measurements."
          : "We'll save these for next time."}{" "}
        <button
          type="button"
          onClick={() => setGuideOpen((open) => !open)}
          aria-expanded={guideOpen}
          className="font-medium text-clay underline hover:text-clay-deep"
        >
          How to measure
        </button>{" "}
        · {creatorName} confirms your size before cutting.
      </p>

      {guideOpen && (
        <ul className="mt-3 space-y-1.5 rounded-xl bg-cream p-4 text-sm text-forest/75">
          <li>
            <strong className="font-semibold text-forest">Bust</strong> — around the
            fullest part, tape level across your back.
          </li>
          <li>
            <strong className="font-semibold text-forest">Waist</strong> — your
            natural waist, the narrowest point.
          </li>
          <li>
            <strong className="font-semibold text-forest">Hips</strong> — around the
            fullest part, feet together.
          </li>
          <li>
            <strong className="font-semibold text-forest">Length</strong> — from the
            top of the shoulder to where you want the hem.
          </li>
        </ul>
      )}
    </div>
  );
}

function listFields(fields: MeasurementField[]) {
  if (fields.length === 1) return `the ${fields[0]}`;
  return `the ${fields.slice(0, -1).join(", ")} and ${fields[fields.length - 1]}`;
}
