"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { roleOptions, unchosen, type RoleId } from "@/data/onboarding";

export default function RoleChooser() {
  const router = useRouter();
  const [chosen, setChosen] = useState<RoleId | null>(null);
  const [going, setGoing] = useState(false);

  const selected = roleOptions.find((option) => option.id === chosen) ?? null;

  function go() {
    if (!selected) return;
    setGoing(true);
    router.push(selected.href);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14 text-center sm:py-20">
      <p className="inline-flex items-center gap-2.5 text-sm text-forest">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-sage text-xs text-forest"
        >
          ✓
        </span>
        Account created
      </p>

      <h1 className="mt-5 font-display text-4xl text-forest-deep sm:text-5xl">
        How will you use FITS?
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-forest/70">
        Pick one to start. It&rsquo;s the same account either way — you can
        switch any time.
      </p>

      {/* Radio group: one answer, and the cards are the control. */}
      <div
        role="radiogroup"
        aria-label="How will you use FITS?"
        className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2"
      >
        {roleOptions.map((option) => {
          const active = option.id === chosen;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setChosen(option.id)}
              className={`overflow-hidden rounded-3xl border-2 bg-white text-left transition-colors ${
                active
                  ? "border-clay"
                  : "border-transparent hover:border-forest/20"
              }`}
            >
              <span className={`relative block h-48 ${option.tone}`}>
                {active && (
                  <span
                    aria-hidden
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-clay text-cream"
                  >
                    ✓
                  </span>
                )}
              </span>

              <span className="block p-6">
                <span className="block font-display text-xl text-forest">
                  {option.title}
                </span>
                <span className="mt-2 block text-forest/70">
                  {option.description}
                </span>

                <span className="mt-5 block space-y-2">
                  {option.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="flex gap-2.5 text-sm text-forest/85"
                    >
                      <span aria-hidden className="text-moss">
                        ✓
                      </span>
                      {benefit}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={go}
        disabled={!selected || going}
        className={`mx-auto mt-10 flex w-full max-w-md items-center justify-center rounded-full px-8 py-4 font-semibold transition-colors ${
          selected
            ? "bg-clay text-cream hover:bg-clay-deep"
            : "cursor-not-allowed bg-clay-soft/55 text-cream/90"
        }`}
      >
        {selected ? selected.cta : unchosen.cta}
      </button>

      <p className="mt-4 text-sm text-forest/60">
        {selected ? selected.note : unchosen.note}
      </p>
    </div>
  );
}
