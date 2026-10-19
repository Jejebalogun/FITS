"use client";

import { useEffect, useRef, useState } from "react";

import { Field, inputClass } from "@/components/checkout/AddressForm";
import type { Recipient } from "@/components/checkout/DeliveryStep";
import { pause } from "@/data/accounts";
import { formatAmount, getMarket, type Market } from "@/data/markets";
import {
  addressLine,
  cardBrand,
  cardOutcome,
  formatCardNumber,
  formatExpiry,
  transferAccount,
  ussdCode,
  validateCard,
  type CardDraft,
  type CardErrors,
} from "@/lib/checkout";

export type Payment = { paidWith: string; paid: string };

type Method = "card" | "apple" | "paypal" | "naira";
type NairaRoute = "transfer" | "card" | "ussd";
type Phase =
  | "ready"
  | "confirming"
  | "bank"
  | "declined"
  | "cancelled"
  | "transfer"
  | "ussd";

const NAIRA = getMarket("NG");
const TRANSFER_MINUTES = 30;

type PaymentStepProps = {
  market: Market;
  /** Total in the market's own currency. */
  total: number;
  recipient: Recipient;
  orderId: string;
  onChangeAddress: () => void;
  onMethodChange: (paysInNaira: boolean) => void;
  onPaid: (payment: Payment) => void;
};

export default function PaymentStep({
  market,
  total,
  recipient,
  orderId,
  onChangeAddress,
  onMethodChange,
  onPaid,
}: PaymentStepProps) {
  // A buyer in Nigeria pays through Paystack in naira by default.
  const home = market.code === "NG";
  const [method, setMethodState] = useState<Method>(home ? "naira" : "card");
  const [route, setRoute] = useState<NairaRoute>("transfer");
  const [phase, setPhase] = useState<Phase>("ready");
  const [card, setCard] = useState<CardDraft>({ number: "", expiry: "", cvc: "", name: "" });
  const [touched, setTouched] = useState<Set<keyof CardDraft>>(new Set());

  const nairaTotal = home ? total : Math.round((total / market.rate) * NAIRA.rate);
  const inNaira = method === "naira";
  const payMarket = inNaira ? NAIRA : market;
  const amount = inNaira ? nairaTotal : total;
  const amountLabel = formatAmount(amount, payMarket, { cents: !inNaira });

  const cardErrors = validateCard(card, new Date());
  const cardValid = Object.keys(cardErrors).length === 0;
  const digits = card.number.replace(/\D/g, "");
  const busy = phase === "confirming" || phase === "bank";
  const usesCard = method === "card" || (inNaira && route === "card");

  function setMethod(next: Method) {
    setMethodState(next);
    setPhase("ready");
    onMethodChange(next === "naira" && !home);
  }

  async function finish(paidWith: string) {
    setPhase("confirming");
    await pause(1200);
    onPaid({ paidWith, paid: amountLabel });
  }

  async function payByCard() {
    if (!cardValid) {
      setTouched(new Set<keyof CardDraft>(["number", "expiry", "cvc", "name"]));
      return;
    }
    setPhase("confirming");
    await pause(1200);
    if (cardOutcome(digits) === "declined") {
      setPhase("declined");
      return;
    }
    setPhase("bank");
  }

  function pay() {
    if (usesCard) return payByCard();
    if (method === "apple") return finish("Apple Pay");
    if (method === "paypal") return finish("PayPal");
    if (route === "transfer") return setPhase("transfer");
    return setPhase("ussd");
  }

  const cardLabel = `${brandName(cardBrand(digits))} ending ${digits.slice(-4)}`;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-5 py-3.5">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-moss text-xs text-cream"
        >
          ✓
        </span>
        <p className="min-w-0 flex-1 text-forest">
          <strong className="font-semibold">Delivering to {recipient.address.label}</strong>
          <span className="text-forest/70"> · {addressLine(recipient.address)}</span>
        </p>
        <button
          type="button"
          onClick={onChangeAddress}
          disabled={busy}
          className="text-sm font-medium text-clay hover:text-clay-deep disabled:opacity-40"
        >
          Change
        </button>
      </div>

      <h1 className="mt-7 font-display text-4xl text-forest">How would you like to pay?</h1>

      {phase === "declined" && (
        <Notice>
          <strong className="font-semibold">Your bank declined this card. Nothing was taken.</strong>
          <br />
          Your cart and address are saved. Try another card, or pay with Apple Pay or
          PayPal instead.
        </Notice>
      )}
      {phase === "cancelled" && (
        <Notice>
          <strong className="font-semibold">You stopped the check with your bank. Nothing was taken.</strong>
          <br />
          Pay again when you&rsquo;re ready, or choose another way to pay.
        </Notice>
      )}

      <div className={`mt-6 space-y-3 ${busy ? "pointer-events-none opacity-60" : ""}`} aria-busy={busy}>
        {/* The chosen method opens out; the others sit underneath as one-line options. */}
        {method === "card" && (
          <section className="rounded-2xl border-2 border-clay bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <Radio checked label="Card" />
              <BrandBadges />
            </div>
            <CardFields
              card={card}
              onChange={(next) => {
                setCard(next);
                if (phase === "declined" || phase === "cancelled") setPhase("ready");
              }}
              errors={cardErrors}
              touched={touched}
              onTouch={(field) => setTouched((current) => new Set(current).add(field))}
            />
          </section>
        )}

        {method === "naira" && (
          <section className="rounded-2xl border-2 border-clay bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-forest">Pay in naira</h2>
                <p className="text-forest/65">
                  <strong className="font-display font-normal text-forest">
                    {formatAmount(nairaTotal, NAIRA)}
                  </strong>{" "}
                  {!home && "· rate locked for 15 minutes "}· processed by Paystack
                </p>
              </div>
              {!home && (
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className="text-sm font-medium text-clay hover:text-clay-deep"
                >
                  ← Pay in {market.moneyName} instead
                </button>
              )}
            </div>

            {phase === "transfer" ? (
              <TransferDetails
                orderId={orderId}
                name={recipient.address.name}
                amount={formatAmount(nairaTotal, NAIRA)}
                onRestart={() => setPhase("ready")}
              />
            ) : phase === "ussd" ? (
              <div className="mt-5 rounded-xl bg-sand/60 p-5 text-forest">
                <p>Dial this from the phone linked to your bank account:</p>
                <p className="mt-2 font-mono text-2xl font-bold tracking-wider">
                  {ussdCode(nairaTotal)}
                </p>
                <p className="mt-2 text-sm text-forest/65">
                  Your bank asks for your PIN to approve {formatAmount(nairaTotal, NAIRA)}. No
                  data connection needed.
                </p>
              </div>
            ) : (
              <>
                <div role="radiogroup" aria-label="How to pay in naira" className="mt-5 grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      ["transfer", "Bank transfer", "From any Nigerian bank app"],
                      ["card", "Nigerian card", "Verve, Visa or Mastercard"],
                      ["ussd", "USSD", "Dial a code, no data needed"],
                    ] as const
                  ).map(([key, title, sub]) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={route === key}
                      onClick={() => setRoute(key)}
                      className={`rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                        route === key ? "border-forest" : "border-forest/10 hover:border-forest/30"
                      }`}
                    >
                      <span className="block font-semibold text-forest">{title}</span>
                      <span className="block text-sm text-forest/60">{sub}</span>
                    </button>
                  ))}
                </div>
                {route === "card" && (
                  <CardFields
                    card={card}
                    onChange={setCard}
                    errors={cardErrors}
                    touched={touched}
                    onTouch={(field) => setTouched((current) => new Set(current).add(field))}
                  />
                )}
              </>
            )}
          </section>
        )}

        {(method === "apple" || method === "paypal") && (
          <section className="rounded-2xl border-2 border-clay bg-white p-6">
            <Radio checked label={method === "apple" ? "Apple Pay" : "PayPal"} />
            <p className="mt-3 text-forest/70">
              {method === "apple"
                ? `You'll confirm ${amountLabel} with Face ID or Touch ID. FITS never sees your card number.`
                : `You'll log in to PayPal to approve ${amountLabel}, then come straight back here.`}
            </p>
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          {(
            [
              ["card", "Card", null],
              ["apple", "Apple Pay", null],
              ["paypal", "PayPal", null],
              ["naira", home ? "Paystack" : "Pay in naira", "card, transfer or USSD"],
            ] as const
          )
            .filter(([key]) => key !== method && !(home && key === "card"))
            .map(([key, label, sub]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMethod(key)}
                className={`flex min-w-[11rem] items-center gap-3 rounded-2xl border border-forest/10 bg-white px-5 py-4 text-left transition-colors hover:border-forest/30 ${
                  sub ? "flex-[1.7]" : "flex-1"
                }`}
              >
                <Radio checked={false} label={label} paypal={key === "paypal"} />
                {sub && <span className="whitespace-nowrap text-sm text-forest/55">· {sub}</span>}
              </button>
            ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {phase === "transfer" || phase === "ussd" ? (
          <button
            type="button"
            onClick={() =>
              finish(phase === "transfer" ? "Bank transfer in naira" : "USSD in naira")
            }
            className="h-14 w-full rounded-full bg-forest text-lg font-semibold text-cream transition-colors hover:bg-forest-deep sm:w-80"
          >
            {phase === "transfer" ? "I’ve sent it" : "I’ve dialled it"}
          </button>
        ) : busy ? (
          <span
            role="status"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-forest text-lg font-semibold text-cream sm:w-80"
          >
            <span aria-hidden className="h-5 w-5 rounded-full border-2 border-cream/40 border-t-cream motion-safe:animate-spin" />
            {phase === "bank" ? "Waiting for your bank…" : "Confirming with your bank…"}
          </span>
        ) : (
          <button
            type="button"
            onClick={pay}
            aria-disabled={usesCard && !cardValid}
            className={`h-14 w-full rounded-full text-lg font-semibold text-cream transition-colors sm:w-80 ${
              method === "apple"
                ? "bg-black hover:bg-black/85"
                : usesCard && !cardValid
                  ? "bg-clay/45"
                  : "bg-clay hover:bg-clay-deep"
            }`}
          >
            {method === "apple"
              ? `Pay ${amountLabel} with Apple Pay`
              : method === "paypal"
                ? "Continue to PayPal"
                : phase === "declined"
                  ? `Try again · ${amountLabel}`
                  : `Pay ${amountLabel}`}
          </button>
        )}
        <p className="max-w-sm text-sm text-forest/60">
          {busy
            ? "Please keep this tab open. This usually takes a few seconds."
            : phase === "transfer" || phase === "ussd"
              ? "Optional — tap once you’ve paid. We also detect it automatically when it lands."
              : inNaira
                ? "You’ll finish in your bank app or by dialling a code."
                : `Charged in ${market.moneyName}. Your bank may ask you to approve it in their app.`}
        </p>
      </div>

      {phase === "bank" && (
        <BankApproval
          amount={amountLabel}
          card={inNaira ? `Card ending ${digits.slice(-4)}` : cardLabel}
          onApproved={() => finish(inNaira ? `Nigerian card ending ${digits.slice(-4)}` : cardLabel)}
          onCancel={() => setPhase("cancelled")}
        />
      )}
    </>
  );
}

function brandName(brand: ReturnType<typeof cardBrand>) {
  switch (brand) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "Amex";
    case "verve":
      return "Verve";
    default:
      return "Card";
  }
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="mt-6 flex gap-3 rounded-2xl border border-clay/40 bg-clay-wash/60 px-5 py-4 text-forest">
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-clay text-xs font-bold text-cream"
      >
        !
      </span>
      <p>{children}</p>
    </div>
  );
}

function Radio({ checked, label, paypal }: { checked: boolean; label: string; paypal?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? "border-clay" : "border-forest/30"
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-clay" />}
      </span>
      <span className={`font-semibold ${paypal ? "text-[#1F3C88]" : "text-forest"}`}>
        {paypal ? (
          <>
            Pay<span className="text-[#179BD7]">Pal</span>
          </>
        ) : (
          label
        )}
      </span>
    </span>
  );
}

function BrandBadges() {
  return (
    <span aria-label="Visa, Mastercard and Amex accepted" className="flex gap-1.5">
      {["VISA", "MC", "AMEX"].map((brand) => (
        <span
          key={brand}
          className="rounded-md border border-forest/15 px-2 py-1 text-[10px] font-bold tracking-wide text-[#1F3C88]"
        >
          {brand}
        </span>
      ))}
    </span>
  );
}

function CardFields({
  card,
  onChange,
  errors,
  touched,
  onTouch,
}: {
  card: CardDraft;
  onChange: (card: CardDraft) => void;
  errors: CardErrors;
  touched: Set<keyof CardDraft>;
  onTouch: (field: keyof CardDraft) => void;
}) {
  const [numberFocused, setNumberFocused] = useState(false);
  const digits = card.number.replace(/\D/g, "");
  const brand = cardBrand(digits);
  const shown = (field: keyof CardDraft) => (touched.has(field) ? errors[field] : undefined);

  // Once a valid number is in and the field is left, only the last four show.
  const masked =
    !numberFocused && !errors.number && digits.length > 4
      ? `${digits.slice(0, 4)} •••• •••• ${digits.slice(-4)}`
      : formatCardNumber(digits);

  return (
    <div className="mt-5 space-y-4">
      <Field label="Card number" error={shown("number")}>
        <span className="relative block">
          <input
            inputMode="numeric"
            autoComplete="cc-number"
            value={masked}
            onFocus={() => setNumberFocused(true)}
            onBlur={() => {
              setNumberFocused(false);
              onTouch("number");
            }}
            onChange={(event) =>
              onChange({ ...card, number: event.target.value.replace(/\D/g, "").slice(0, 19) })
            }
            className={`${inputClass(shown("number"))} pr-20 font-mono tracking-wider`}
          />
          {brand && (
            <span className="absolute right-4 top-1/2 mt-[3px] -translate-y-1/2 text-xs font-bold uppercase text-[#1F3C88]">
              {brandName(brand)}
            </span>
          )}
        </span>
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Expiry" error={shown("expiry")}>
          <input
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            value={card.expiry}
            onChange={(event) => onChange({ ...card, expiry: formatExpiry(event.target.value) })}
            onBlur={() => onTouch("expiry")}
            className={`${inputClass(shown("expiry"))} font-mono`}
          />
        </Field>
        <Field label="Security code" error={shown("cvc")}>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={card.cvc}
            onChange={(event) =>
              onChange({ ...card, cvc: event.target.value.replace(/\D/g, "").slice(0, 4) })
            }
            onBlur={() => onTouch("cvc")}
            className={`${inputClass(shown("cvc"))} font-mono`}
          />
        </Field>
        <Field label="Name on card" error={shown("name")}>
          <input
            autoComplete="cc-name"
            value={card.name}
            onChange={(event) => onChange({ ...card, name: event.target.value.toUpperCase() })}
            onBlur={() => onTouch("name")}
            className={inputClass(shown("name"))}
          />
        </Field>
      </div>
    </div>
  );
}

/** A Paystack virtual account for one transfer, valid for half an hour. */
function TransferDetails({
  orderId,
  name,
  amount,
  onRestart,
}: {
  orderId: string;
  name: string;
  amount: string;
  onRestart: () => void;
}) {
  const [left, setLeft] = useState(TRANSFER_MINUTES * 60);
  const [copied, setCopied] = useState(false);
  const account = transferAccount(orderId);

  useEffect(() => {
    const timer = window.setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <dl className="space-y-3 rounded-xl bg-sand/60 p-5 text-forest">
        <Detail label="Bank" value="Wema Bank" />
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-forest/70">Account number</dt>
          <dd className="flex items-baseline gap-3">
            <span className="font-mono text-lg font-bold">{account}</span>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(account.replace(/\s/g, ""));
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
              className="text-sm font-medium text-clay hover:text-clay-deep"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </dd>
        </div>
        <Detail label="Account name" value={`FITS / ${name}`} />
        <Detail label="Exact amount" value={amount} />
      </dl>
      <div className="flex flex-col items-center justify-center rounded-xl border border-forest/10 p-5 text-center">
        {left > 0 ? (
          <>
            <span
              aria-hidden
              className="h-9 w-9 rounded-full border-[3px] border-clay/25 border-t-clay motion-safe:animate-spin"
            />
            <p className="mt-3 font-semibold text-forest">Waiting for your transfer</p>
            <p className="text-sm text-forest/60">
              Account expires in <span className="font-semibold text-clay">{clock}</span>
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-forest">This account has expired</p>
            <p className="mt-1 text-sm text-forest/60">
              Anything you sent comes back within a day.
            </p>
            <button
              type="button"
              onClick={onRestart}
              className="mt-3 text-sm font-medium text-clay hover:text-clay-deep"
            >
              Start a new transfer
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-forest/70">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

/**
 * The bank's own check (3-D Secure). The stand-in approves after a few
 * seconds, as if the buyer tapped Approve in their banking app.
 */
function BankApproval({
  amount,
  card,
  onApproved,
  onCancel,
}: {
  amount: string;
  card: string;
  onApproved: () => void;
  onCancel: () => void;
}) {
  const [bySms, setBySms] = useState(false);
  const [code, setCode] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  // Held in a ref so a parent re-render does not restart the approval timer.
  const approve = useRef(onApproved);
  approve.current = onApproved;

  useEffect(() => {
    dialog.current?.focus();
    if (bySms) return;
    const timer = window.setTimeout(() => approve.current(), 4000);
    return () => window.clearTimeout(timer);
  }, [bySms]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/40 px-4">
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-title"
        tabIndex={-1}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between bg-[#0B2A5B] px-6 py-4 text-white">
          <span className="font-semibold">Your bank</span>
          <span className="text-xs text-white/75">Secure verification</span>
        </div>
        <div className="p-7">
          <h2 id="bank-title" className="text-xl font-bold text-[#111]">
            {bySms ? "Enter the code we texted you" : "Approve this payment in your banking app"}
          </h2>
          <p className="mt-2 text-sm text-[#333]">
            {bySms
              ? "We sent a 6-digit code to the phone number your bank has for you."
              : "We've sent a request to your phone. Open your bank's app and tap Approve."}
          </p>
          <dl className="mt-5 space-y-2 rounded-xl bg-[#F3F4F6] p-4 text-sm text-[#333]">
            <Detail label="Merchant" value="FITS MARKETPLACE" />
            <Detail label="Amount" value={amount} />
            <Detail label="Card" value={card} />
          </dl>

          {bySms ? (
            <form
              className="mt-5 flex gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (code.length === 6) onApproved();
              }}
            >
              <input
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label="6-digit code"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="min-w-0 flex-1 rounded-lg border border-[#C4C8CF] px-4 py-2.5 font-mono text-lg tracking-[0.3em] text-[#111] outline-none focus:border-[#0B2A5B]"
              />
              <button
                type="submit"
                disabled={code.length !== 6}
                className="rounded-lg bg-[#0B2A5B] px-5 font-semibold text-white disabled:opacity-40"
              >
                Confirm
              </button>
            </form>
          ) : (
            <p role="status" className="mt-5 flex items-center gap-3 text-sm text-[#333]">
              <span aria-hidden className="h-5 w-5 rounded-full border-2 border-[#0B2A5B]/25 border-t-[#0B2A5B] motion-safe:animate-spin" />
              Waiting for approval…
            </p>
          )}

          <div className="mt-5 flex items-center justify-between text-sm">
            {!bySms ? (
              <button
                type="button"
                onClick={() => setBySms(true)}
                className="font-medium text-[#0B2A5B] hover:underline"
              >
                Use a text message code instead
              </button>
            ) : (
              <span />
            )}
            <button type="button" onClick={onCancel} className="text-[#555] hover:text-[#111]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
