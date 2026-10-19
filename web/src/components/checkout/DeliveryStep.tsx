"use client";

import Link from "next/link";
import { useState } from "react";

import AddressForm, { type AddressFormResult } from "@/components/checkout/AddressForm";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { useShopper } from "@/components/marketplace/ShopperProvider";
import type { CartSummary } from "@/lib/cart";
import { addressLine, type Address } from "@/lib/checkout";
import { formatDateWindow, useToday } from "@/lib/delivery";

/** Who the order goes to, decided on the delivery step and carried to payment. */
export type Recipient = {
  address: Omit<Address, "id" | "isDefault"> & { id?: string };
  email: string;
  createAccount: boolean;
};

type DeliveryStepProps = {
  summary: CartSummary;
  /** Signed-in email, or null for a guest. */
  accountEmail: string | null;
  initial: Recipient | null;
  onContinue: (recipient: Recipient) => void;
};

export default function DeliveryStep({
  summary,
  accountEmail,
  initial,
  onContinue,
}: DeliveryStepProps) {
  const { market } = useMarket();
  const shopper = useShopper();
  const today = useToday();

  // Only addresses in the ship-to country can take this order.
  const saved = shopper.addresses.filter((address) => address.country === market.code);
  const fallback = saved.find((address) => address.isDefault) ?? saved[0];
  const [chosen, setChosen] = useState<string | undefined>(initial?.address.id ?? fallback?.id);
  const [editing, setEditing] = useState<Address | "new" | null>(saved.length ? null : "new");

  const parcels = summary.parcels.filter((parcel) => parcel.orderable);
  const count = parcels.length;

  // --- Guest -------------------------------------------------------------------
  if (!accountEmail) {
    return (
      <>
        <p className="text-sm text-forest/55">Step 1 of 2</p>
        <h1 className="mt-1 font-display text-4xl text-forest">Checking out as a guest</h1>
        <p className="mb-7 mt-2 text-forest/70">
          No account needed. Already have one?{" "}
          <Link href="/login?next=/checkout" className="font-medium text-clay underline">
            Sign in
          </Link>{" "}
          and your saved addresses fill this in.
        </p>
        <AddressForm
          mode="guest"
          initial={initial ? { ...initial.address, email: initial.email } : undefined}
          submitLabel="Continue to payment"
          onSubmit={(result) =>
            onContinue({
              // A guest has no saved labels, so the address goes by their name.
              address: { ...result.draft, label: result.draft.name.trim().split(/\s+/)[0] },
              email: result.email ?? "",
              createAccount: result.createAccount ?? false,
            })
          }
        />
      </>
    );
  }

  // --- Adding or editing a saved address ----------------------------------------
  if (editing) {
    const existing = editing === "new" ? null : editing;
    const done = (result: AddressFormResult) => {
      const id = existing?.id ?? `addr-${Date.now().toString(36)}`;
      const address: Address = {
        ...result.draft,
        id,
        label: result.draft.label.trim() || (saved.length === 0 ? "Home" : `Address ${saved.length + 1}`),
        isDefault: Boolean(result.makeDefault) || saved.length === 0,
      };
      if (result.save || existing) shopper.saveAddress(address);
      setChosen(id);
      setEditing(null);
      // An address used once without saving goes straight on to payment.
      if (!result.save && !existing) {
        onContinue({ address, email: accountEmail, createAccount: false });
      }
    };

    return (
      <>
        {saved.length > 0 && (
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="text-sm text-forest/60 hover:text-forest"
          >
            ← Saved addresses
          </button>
        )}
        <h1 className="mb-6 mt-1 font-display text-4xl text-forest">
          {existing ? `Edit ${existing.label}` : "Add a new address"}
        </h1>
        <AddressForm
          key={existing?.id ?? "new"}
          mode="saved"
          initial={existing ?? undefined}
          submitLabel={existing ? "Save changes" : "Use this address"}
          onSubmit={done}
        />
      </>
    );
  }

  // --- Choosing a saved address ---------------------------------------------------
  const selected = saved.find((address) => address.id === chosen) ?? fallback;

  return (
    <>
      <h1 className="font-display text-4xl text-forest">Where should it go?</h1>
      <p className="mt-2 text-forest/65">
        Shipping to {market.placeName}.{" "}
        {count === 2
          ? "Both parcels go to the same address."
          : count > 2
            ? `All ${inWords(count)} parcels go to the same address.`
            : ""}
      </p>

      <div role="radiogroup" aria-label="Delivery address" className="mt-6 space-y-3">
        {saved.map((address) => {
          const active = address.id === selected?.id;
          return (
            <div
              key={address.id}
              className={`flex items-start gap-4 rounded-2xl border bg-white px-5 py-4 transition-colors ${
                active ? "border-2 border-clay" : "border-forest/10"
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setChosen(address.id)}
                className="flex min-w-0 flex-1 items-start gap-4 text-left"
              >
                <span
                  aria-hidden
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? "border-clay" : "border-forest/30"
                  }`}
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-clay" />}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2.5 text-lg font-semibold text-forest">
                    {address.label}
                    {address.isDefault && (
                      <span className="rounded bg-sage px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-forest">
                        Default
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-forest/70">
                    {address.name} · {addressLine(address)} · {address.phone}
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setEditing(address)}
                className="text-sm font-medium text-clay hover:text-clay-deep"
              >
                Edit<span className="sr-only"> {address.label}</span>
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="block w-full rounded-2xl border-2 border-dashed border-forest/20 px-5 py-4 text-left font-medium text-forest transition-colors hover:border-forest/40"
        >
          <span className="mr-2 text-clay">+</span>Add a new address
        </button>
      </div>

      {count > 0 && (
        <>
          <h2 className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest/55">
            {count === 1 ? "One parcel" : `${inWords(count)} parcels, ${inWords(count)} dates`}
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {parcels.map((parcel) => (
              <li key={parcel.creator.slug} className="rounded-2xl bg-white px-5 py-4">
                <p className="font-semibold text-forest">
                  From {parcel.creator.shortName} · {parcel.creator.city}
                </p>
                <p className="text-sm text-forest/65">
                  {parcel.lines.some((item) => !item.blocker && item.product.delivery)
                    ? "Made to order"
                    : "Ready to ship"}{" "}
                  · DHL
                  {parcel.arrives && today && (
                    <>
                      {" · "}
                      <strong className="font-semibold text-forest">
                        arrives {formatDateWindow(parcel.arrives, today)}
                      </strong>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        type="button"
        disabled={!selected}
        onClick={() =>
          selected && onContinue({ address: selected, email: accountEmail, createAccount: false })
        }
        className="mt-8 h-14 w-full rounded-full bg-clay text-lg font-semibold text-cream transition-colors hover:bg-clay-deep disabled:bg-clay/45 sm:w-80"
      >
        Continue to payment
      </button>
    </>
  );
}

/** Parcel counts read as words: "Two parcels, two dates". */
function inWords(count: number) {
  return ["zero", "one", "two", "three", "four", "five", "six"][count] ?? String(count);
}
