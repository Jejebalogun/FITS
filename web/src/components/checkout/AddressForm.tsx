"use client";

import Link from "next/link";
import { useState } from "react";

import { useMarket } from "@/components/marketplace/MarketProvider";
import {
  lookupPostcode,
  postcodeRules,
  tidyPostcode,
  validateAddress,
  type AddressDraft,
  type AddressErrors,
} from "@/lib/checkout";

const PHONE_HINT: Record<string, string> = {
  GB: "+44 7700 900412",
  NG: "+234 803 123 4567",
  GH: "+233 24 123 4567",
  US: "+1 212 555 0142",
  CA: "+1 416 555 0142",
};

export type AddressFormResult = {
  draft: AddressDraft;
  email?: string;
  /** Saved-address mode. */
  save?: boolean;
  makeDefault?: boolean;
  /** Guest mode. */
  createAccount?: boolean;
  marketing?: boolean;
};

type AddressFormProps = {
  mode: "saved" | "guest";
  initial?: Partial<AddressDraft> & { email?: string; isDefault?: boolean };
  submitLabel: string;
  onSubmit: (result: AddressFormResult) => void;
};

export default function AddressForm({ mode, initial, submitLabel, onSubmit }: AddressFormProps) {
  const { market } = useMarket();
  const rule = postcodeRules[market.code];

  const [draft, setDraft] = useState<AddressDraft>({
    label: initial?.label ?? "",
    name: initial?.name ?? "",
    phone: initial?.phone ?? "",
    country: market.code,
    postcode: initial?.postcode ?? "",
    street: initial?.street ?? "",
    flat: initial?.flat ?? "",
    town: initial?.town ?? "",
  });
  const [email, setEmail] = useState(initial?.email ?? "");
  const [save, setSave] = useState(true);
  const [makeDefault, setMakeDefault] = useState(initial?.isDefault ?? false);
  const [createAccount, setCreateAccount] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [typingStreet, setTypingStreet] = useState(Boolean(initial?.street));

  const errors = validateAddress(draft, mode === "guest" ? email : undefined);
  const valid = Object.keys(errors).length === 0;
  const shown = (field: keyof AddressErrors) => (touched.has(field) ? errors[field] : undefined);

  // Offer the street list once a known postcode is in, until one is picked.
  const matches =
    market.code === "GB" && !errors.postcode && !typingStreet ? lookupPostcode(draft.postcode) : [];

  function set<K extends keyof AddressDraft>(field: K, value: AddressDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function touch(field: string) {
    setTouched((current) => new Set(current).add(field));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) {
      setTouched(new Set(["email", "name", "phone", "postcode", "street", "town"]));
      return;
    }
    onSubmit({
      draft: { ...draft, postcode: tidyPostcode(draft.postcode, market.code) },
      email: mode === "guest" ? email.trim() : undefined,
      save,
      makeDefault,
      createAccount,
      marketing,
    });
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {mode === "guest" && (
        <Field label="Email, for your receipt and tracking" error={shown("email")}>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => touch("email")}
            className={inputClass(shown("email"))}
          />
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={shown("name")}>
          <input
            autoComplete="name"
            value={draft.name}
            onChange={(event) => set("name", event.target.value)}
            onBlur={() => touch("name")}
            className={inputClass(shown("name"))}
          />
        </Field>
        <Field label="Phone, for the courier" error={shown("phone")}>
          <input
            type="tel"
            autoComplete="tel"
            value={draft.phone}
            placeholder={PHONE_HINT[market.code]}
            onChange={(event) => set("phone", event.target.value)}
            onBlur={() => touch("phone")}
            className={inputClass(shown("phone"))}
          />
        </Field>
      </div>

      <div>
        <p className="text-sm font-medium text-forest">Country</p>
        <p className="mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sand/70 px-4 py-3.5 text-forest">
          <span>
            <span aria-hidden>{market.flag} </span>
            {market.country}
          </span>
          <span className="text-sm text-forest/55">
            Matches your ship-to ·{" "}
            <Link href="/cart" className="underline hover:text-forest">
              change it from your cart
            </Link>
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[14rem_minmax(0,1fr)]">
        <Field
          label={rule.required ? rule.label : `${rule.label} — optional`}
          error={shown("postcode")}
        >
          <input
            autoComplete="postal-code"
            value={draft.postcode}
            placeholder={rule.example}
            onChange={(event) => {
              set("postcode", event.target.value.toUpperCase());
              setTypingStreet(false);
            }}
            onBlur={() => touch("postcode")}
            className={inputClass(shown("postcode"))}
          />
        </Field>

        <div className="relative">
          {/* No street error while the list is open: picking from it is the fix. */}
          <Field label="Street address" error={matches.length ? undefined : shown("street")}>
            <input
              autoComplete="address-line1"
              value={draft.street}
              placeholder={matches.length ? "Pick from the list" : undefined}
              onChange={(event) => {
                set("street", event.target.value);
                setTypingStreet(true);
              }}
              onBlur={() => touch("street")}
              className={inputClass(matches.length ? undefined : shown("street"))}
            />
          </Field>
          {matches.length > 0 && (
            <ul
              aria-label="Addresses at this postcode"
              className="absolute inset-x-0 top-full z-30 mt-2 rounded-2xl border border-forest/10 bg-white p-1.5 shadow-lg"
            >
              {matches.map((match) => {
                const label = `${match.flat ? `${match.flat}, ` : ""}${match.street}, ${match.town} ${tidyPostcode(draft.postcode, "GB")}`;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft((current) => ({
                          ...current,
                          street: match.street,
                          flat: match.flat ?? current.flat,
                          town: match.town,
                          postcode: tidyPostcode(current.postcode, "GB"),
                        }));
                        setTypingStreet(true);
                      }}
                      className="block w-full rounded-xl px-3 py-2.5 text-left text-forest hover:bg-sand/60 focus:bg-sand/60 focus:outline-none"
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => setTypingStreet(true)}
                  className="block w-full rounded-xl px-3 py-2.5 text-left text-clay hover:bg-sand/60"
                >
                  I can&rsquo;t see my address — type it in
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Flat, floor or building" optional>
          <input
            autoComplete="address-line2"
            value={draft.flat}
            onChange={(event) => set("flat", event.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Town or city" error={shown("town")}>
          <input
            autoComplete="address-level2"
            value={draft.town}
            onChange={(event) => set("town", event.target.value)}
            onBlur={() => touch("town")}
            className={inputClass(shown("town"))}
          />
        </Field>
      </div>

      {mode === "saved" && (
        <Field label="Call it" optional>
          <input
            value={draft.label}
            placeholder="Home, Work, Mum's…"
            maxLength={24}
            onChange={(event) => set("label", event.target.value)}
            className={`${inputClass()} sm:max-w-xs`}
          />
        </Field>
      )}

      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {mode === "saved" ? (
          <>
            <Check checked={save} onChange={setSave}>
              Save to my addresses
            </Check>
            <Check checked={makeDefault} onChange={setMakeDefault}>
              Make this my default
            </Check>
          </>
        ) : (
          <>
            <Check checked={createAccount} onChange={setCreateAccount}>
              Create an account from this so I can track orders
            </Check>
            <Check checked={marketing} onChange={setMarketing}>
              Send me new pieces from creators I buy from
            </Check>
          </>
        )}
      </div>

      <button
        type="submit"
        aria-disabled={!valid}
        className={`h-14 w-full rounded-full text-lg font-semibold text-cream transition-colors sm:w-80 ${
          valid ? "bg-clay hover:bg-clay-deep" : "bg-clay/45"
        }`}
      >
        {submitLabel}
      </button>
    </form>
  );
}

export function inputClass(error?: string) {
  return `mt-1.5 w-full rounded-xl border bg-white px-4 py-3.5 text-forest outline-none transition-colors placeholder:text-forest/35 focus:border-forest ${
    error ? "border-clay" : "border-forest/15"
  }`;
}

export function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={`text-sm font-medium ${error ? "text-clay-deep" : "text-forest"}`}>
        {label}
        {optional && <span className="font-normal text-forest/50"> — optional</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-sm text-clay-deep">
          <span aria-hidden>! </span>
          {error}
        </span>
      )}
    </label>
  );
}

function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-forest">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-forest"
      />
      {children}
    </label>
  );
}
