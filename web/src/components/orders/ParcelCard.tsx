"use client";

import Link from "next/link";
import { useState } from "react";

import { useShopper } from "@/components/marketplace/ShopperProvider";
import { formatMoney } from "@/data/markets";
import { products, type Product } from "@/data/marketplace";
import type { Stage } from "@/data/orders";
import { blockerFor, type Parcel } from "@/lib/cart";
import {
  ACCEPT_HOURS,
  AUTO_CONFIRM_DAYS,
  LATE_ANSWER_DAYS,
  dateOf,
  daysAgo,
  dueWindow,
  formatDay,
  formatWhen,
  formatWindow,
  isCustom,
  isMadeToOrder,
  money,
  parcelTotal,
  refundTo,
  type TrackedOrder,
} from "@/lib/orders";

type CardProps = {
  order: TrackedOrder;
  parcel: Parcel;
  stage: Stage;
  now: Date;
};

const DAY_MS = 86_400_000;

export default function ParcelCard({ order, parcel, stage, now }: CardProps) {
  const { creator } = parcel;
  const made = isMadeToOrder(parcel);
  const refunded = stage.kind === "declined" || stage.kind === "cancelled";
  const urgent = stage.kind === "delivered" || stage.kind === "late";

  return (
    <article
      className={`overflow-hidden rounded-3xl bg-white ${
        urgent ? "border-2 border-clay" : refunded ? "border border-clay/40" : ""
      }`}
    >
      <header className="flex items-center gap-3 border-b border-forest/10 px-5 py-4">
        <span aria-hidden className={`h-10 w-10 shrink-0 rounded-full ${creator.tone}`} />
        <div className="min-w-0 flex-1">
          <Link href={`/creator/${creator.slug}`} className="font-semibold text-forest hover:text-clay">
            {creator.name}
            {creator.verified && <span className="text-moss"> ✓</span>}
          </Link>
          <p className="text-sm text-forest/55">
            {creator.city}, {creator.country} · {made ? "made to order" : "ready to ship"}
          </p>
        </div>
        <StatusBadge stage={stage} custom={isCustom(parcel)} />
      </header>

      <div className="space-y-5 p-5">
        <ul className="space-y-4">
          {parcel.lines.map(({ line, product }, index) => (
            <li key={line.key} className="flex gap-4">
              <Link
                href={`/product/${product.id}`}
                aria-label={product.name}
                className={`h-20 w-16 shrink-0 rounded-xl ${product.tone} ${refunded ? "opacity-60" : ""}`}
              />
              <div className="min-w-0">
                <p className="font-semibold text-forest">
                  {product.name}
                  {line.qty > 1 && <span className="font-normal text-forest/60"> × {line.qty}</span>}
                </p>
                <p className="text-sm text-forest/60">
                  {[
                    line.measurements ? "Custom measurements" : line.size ? `Size ${line.size}` : null,
                    line.colour?.toLowerCase(),
                    formatMoney(product.priceGBP * line.qty, order.market),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {index === parcel.lines.length - 1 && (
                  <Headline order={order} parcel={parcel} stage={stage} now={now} />
                )}
              </div>
            </li>
          ))}
        </ul>

        <Timeline order={order} parcel={parcel} stage={stage} now={now} />
        <StagePanel order={order} parcel={parcel} stage={stage} now={now} />
      </div>
    </article>
  );
}

// --- Status ------------------------------------------------------------------

export function statusLabel(stage: Stage, custom: boolean) {
  switch (stage.kind) {
    case "confirming":
      return custom ? "Confirming your size" : "Awaiting acceptance";
    case "packing":
      return "Accepted";
    case "making":
      return "Being made";
    case "late":
      return "Running late";
    case "shipped":
      return "On its way";
    case "delivered":
    case "confirmed":
      return "Delivered";
    case "problem":
      return "Problem reported";
    default:
      return "Refunded";
  }
}

function StatusBadge({ stage, custom }: { stage: Stage; custom: boolean }) {
  const tone =
    stage.kind === "shipped"
      ? "bg-forest text-cream"
      : stage.kind === "declined" || stage.kind === "cancelled" || stage.kind === "problem"
        ? "bg-clay text-cream"
        : stage.kind === "delivered" || stage.kind === "confirmed" || stage.kind === "packing"
          ? "bg-sage text-forest"
          : "bg-clay-wash text-clay-deep";
  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${tone}`}>
      {statusLabel(stage, custom)}
    </span>
  );
}

function Headline({ order, parcel, stage, now }: CardProps) {
  const { creator } = parcel;
  const window = formatWindow(order, dueWindow(parcel, stage));
  const refund = money(order, parcelTotal(order, parcel));
  const clay = "mt-2 font-semibold text-clay-deep";
  const plain = "mt-2 font-semibold text-forest";

  switch (stage.kind) {
    case "late":
      return <p className={clay}>New date: {window}</p>;
    case "making":
      return (
        <p className={plain}>
          Arrives {window} · {stage.newWindow ? "new date" : "on schedule"}
        </p>
      );
    case "shipped":
      return <p className={plain}>Arrives {formatDay(dateOf(order, stage.eta), true)}</p>;
    case "delivered": {
      const at = dateOf(order, stage.milestones.delivered!);
      const today = formatWhen(at, now).startsWith("Today");
      return (
        <p className={plain}>
          Delivered {today ? `today, ${at.toTimeString().slice(0, 5)}` : formatDay(at)}
        </p>
      );
    }
    case "confirmed":
      return <p className={plain}>Delivered {formatDay(dateOf(order, stage.milestones.delivered!))}</p>;
    case "problem":
      return <p className={clay}>Problem reported · payment on hold</p>;
    case "declined":
      return (
        <p className={clay}>
          {stage.message ? `Declined by ${creator.shortName}` : "Not accepted in time"} · {refund} refunded
        </p>
      );
    case "cancelled":
      return <p className={clay}>Cancelled · {refund} refunded</p>;
    default:
      return <p className={plain}>Arrives {window}</p>;
  }
}

// --- Timeline ------------------------------------------------------------------

type Step = { label: string; sub: string; state: "done" | "current" | "late" | "upcoming" };

function steps({ order, parcel, stage, now }: CardProps): Step[] {
  const day = (stamp?: { day: number; time?: string }) => (stamp ? formatDay(dateOf(order, stamp)) : "");

  if (stage.kind === "declined" || stage.kind === "cancelled") {
    return [
      { label: stage.kind === "declined" ? "Declined" : "Cancelled", sub: day(stage.at), state: "late" },
      { label: "Refunded", sub: day(stage.at), state: "done" },
    ];
  }

  const m = stage.milestones;
  const made = isMadeToOrder(parcel);
  const delivered = m.delivered ? dateOf(order, m.delivered) : null;
  const deliveredSub = delivered
    ? formatWhen(delivered, now).startsWith("Today")
      ? "Today"
      : formatDay(delivered)
    : stage.kind === "shipped"
      ? formatDay(dateOf(order, stage.eta), true)
      : formatWindow(order, dueWindow(parcel, stage));

  const all: Omit<Step, "state">[] = [
    { label: "Accepted", sub: day(m.accepted) || formatDay(order.placedOn) },
    made
      ? { label: "Being made", sub: "with photos" }
      : { label: "Packed", sub: day(m.done) || (stage.kind === "packing" ? day(stage.pickup.at) : "") },
    { label: "Shipped", sub: day(m.shipped) || "DHL" },
    { label: "Delivered", sub: deliveredSub },
  ];

  const current = {
    confirming: 0,
    packing: 1,
    making: 1,
    late: 1,
    shipped: 2,
    delivered: 3,
    problem: 3,
    confirmed: 4,
  }[stage.kind];

  return all.map((step, index) => ({
    ...step,
    state:
      index < current
        ? "done"
        : index === current
          ? stage.kind === "late" || stage.kind === "problem"
            ? "late"
            : "current"
          : "upcoming",
  }));
}

function Timeline(props: CardProps) {
  const list = steps(props);
  return (
    <ol className="flex">
      {list.map((step, index) => {
        const next = list[index + 1];
        const reached = step.state === "done" && next && next.state !== "upcoming";
        return (
          <li key={step.label} className="min-w-0 flex-1">
            <div className="flex items-center">
              <span
                aria-hidden
                className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                  step.state === "done"
                    ? "border-forest bg-forest"
                    : step.state === "current"
                      ? "border-clay bg-white ring-2 ring-clay/25"
                      : step.state === "late"
                        ? "border-clay bg-clay"
                        : "border-forest/25 bg-white"
                }`}
              />
              {next && <span aria-hidden className={`h-0.5 flex-1 ${reached ? "bg-forest" : "bg-forest/15"}`} />}
            </div>
            <p
              className={`mt-2 truncate pr-2 text-sm ${
                step.state === "current" || step.state === "late"
                  ? "font-semibold text-clay-deep"
                  : step.state === "done"
                    ? "text-forest"
                    : "text-forest/50"
              }`}
            >
              {step.label}
              <span className="sr-only">
                {step.state === "done" ? ", done" : step.state === "upcoming" ? ", not yet" : ", now"}
              </span>
            </p>
            <p className="truncate pr-2 text-xs text-forest/50">{step.sub}</p>
          </li>
        );
      })}
    </ol>
  );
}

// --- The panel under the timeline: what is happening, and what the buyer can do ---

function StagePanel(props: CardProps) {
  const { order, parcel, stage, now } = props;
  const { creator } = parcel;
  const shopper = useShopper();
  const update = (patch: Parameters<typeof shopper.updateParcel>[2]) =>
    shopper.updateParcel(order.id, creator.slug, patch);
  const refund = money(order, parcelTotal(order, parcel));
  const piece =
    parcel.lines.length === 1 ? parcel.lines[0].product.name.split(",")[0].toLowerCase() : "order";

  switch (stage.kind) {
    case "confirming": {
      const elapsed = (now.getTime() - order.placedAt.getTime()) / 3_600_000;
      const left = Math.max(1, Math.ceil(ACCEPT_HOURS - elapsed));
      const custom = isCustom(parcel);
      const made = isMadeToOrder(parcel);
      return (
        <Panel
          title={
            custom
              ? `${creator.shortName} is checking your measurements`
              : made
                ? `${creator.shortName} is checking your order`
                : `${creator.shortName} is accepting your order`
          }
          footer={`${left} ${left === 1 ? "hour" : "hours"} left to accept · if it isn't accepted, you're refunded automatically`}
          progress={Math.min(1, elapsed / ACCEPT_HOURS)}
        >
          {custom
            ? `${creator.shortName} confirms the piece can be made to your sizes, or messages you with a question. Nothing is made until it's accepted.`
            : made
              ? `${creator.shortName} confirms it can be made in time, or messages you with a question. Nothing is made until it's accepted.`
              : `${creator.shortName} confirms it's in stock, then FITS books the courier.`}
        </Panel>
      );
    }

    case "packing": {
      const pickup = dateOf(order, stage.pickup.at);
      const tomorrow =
        Math.round((pickup.setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / DAY_MS) === 1;
      return (
        <Panel
          title={`${creator.shortName} is packing your ${piece}`}
          footer={`Pickup booked for ${formatDay(dateOf(order, stage.pickup.at))}, ${stage.pickup.window}`}
          progress={0.7}
        >
          FITS has booked DHL to collect from the studio in {creator.city}{" "}
          {tomorrow ? "tomorrow morning" : `on ${formatDay(dateOf(order, stage.pickup.at))}`}.
        </Panel>
      );
    }

    case "making":
      return <MakingPanel {...props} stage={stage} />;

    case "late": {
      const original = dueWindow(parcel, { ...stage, kind: "confirming" });
      const extra = stage.newWindow.maxDays - original.maxDays;
      const answerBy = new Date(dateOf(order, stage.noticeAt).getTime() + LATE_ANSWER_DAYS * DAY_MS);
      return (
        <section className="rounded-2xl border border-clay/40 bg-clay-wash/30 p-5">
          <h3 className="text-lg font-semibold text-forest">
            {creator.shortName} needs {extra} more {extra === 1 ? "day" : "days"}
          </h3>
          <p className="mt-1.5 text-forest/80">
            &ldquo;{stage.reason}&rdquo; New arrival:{" "}
            <strong className="font-semibold">{formatWindow(order, stage.newWindow)}</strong>, instead of{" "}
            {formatWindow(order, original)}.
          </p>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => update({ waited: true })}
              className="h-12 w-full rounded-full bg-clay font-semibold text-cream transition-colors hover:bg-clay-deep"
            >
              That&rsquo;s fine, I&rsquo;ll wait
            </button>
            <button
              type="button"
              onClick={() => update({ cancelledAt: new Date().toISOString() })}
              className="h-12 w-full rounded-full border border-forest/25 font-semibold text-forest transition-colors hover:border-forest/50"
            >
              Cancel and refund {refund}
            </button>
          </div>
          <p className="mt-3 text-sm text-forest/55">
            If you don&rsquo;t choose by {formatDay(answerBy)}, we&rsquo;ll assume you&rsquo;re happy to wait.
          </p>
        </section>
      );
    }

    case "shipped":
      return <TrackingPanel {...props} stage={stage} />;

    case "delivered":
      return <ConfirmPanel {...props} stage={stage} />;

    case "problem":
      return (
        <Panel title={`Payment to ${creator.shortName} is on hold`}>
          You told us: {stage.reason.toLowerCase()}. FITS replies by email within a day, and{" "}
          {creator.shortName} isn&rsquo;t paid until it&rsquo;s sorted.
        </Panel>
      );

    case "confirmed":
      return <ReviewPanel {...props} stage={stage} />;

    case "declined":
    case "cancelled": {
      const others = order.summary.parcels
        .filter((other) => other.creator.slug !== creator.slug)
        .flatMap((other) => other.lines.map((item) => item.product.name.split(",")[0].toLowerCase()));
      const unaffected = others.length
        ? ` The ${others.join(" and ")} ${others.length === 1 ? "is" : "are"} unaffected.`
        : "";
      return (
        <section className="rounded-2xl border border-clay/40 bg-clay-wash/25 p-5">
          <h3 className="text-lg font-semibold text-forest">
            {stage.kind === "cancelled"
              ? "You cancelled — you've been refunded"
              : stage.message
                ? `${creator.shortName} can't make this one — you've been refunded`
                : `${creator.shortName} didn't accept in time — you've been refunded`}
          </h3>
          <p className="mt-1.5 text-forest/80">
            {stage.kind === "declined" && stage.message && <>&ldquo;{stage.message}&rdquo; </>}
            Your <strong className="font-semibold">{refund}</strong> (piece, delivery and duty) is{" "}
            {refundTo(order.paidWith)} in 3–5 working days.{unaffected}
          </p>
          <Similar product={parcel.lines[0].product} order={order} />
        </section>
      );
    }
  }
}

function Panel({
  title,
  children,
  footer,
  progress,
}: {
  title: string;
  children: React.ReactNode;
  footer?: string;
  progress?: number;
}) {
  return (
    <section className="rounded-2xl bg-cream p-5">
      <h3 className="font-semibold text-forest">{title}</h3>
      <p className="mt-1.5 text-forest/75">{children}</p>
      {progress !== undefined && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-forest/10">
          <div className="h-full rounded-full bg-clay-soft" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
      {footer && <p className="mt-2.5 text-sm text-forest/55">{footer}</p>}
    </section>
  );
}

function MakingPanel({ order, parcel, stage, now }: CardProps & { stage: Extract<Stage, { kind: "making" }> }) {
  const { creator } = parcel;
  const [all, setAll] = useState(false);
  const [writing, setWriting] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const latest = stage.updates[stage.updates.length - 1];

  if (!latest) {
    return (
      <Panel title={`${creator.shortName} is making your piece`}>
        Progress photos appear here as {creator.shortName} posts them.
      </Panel>
    );
  }

  const at = dateOf(order, latest.at);
  return (
    <section>
      <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest/55">
        Latest from {creator.shortName} · {daysAgo(at, now)}
      </h3>
      <div aria-hidden className="mt-3 grid h-40 grid-cols-[1.3fr_1fr] gap-2.5">
        {latest.tones.slice(0, 2).map((tone, index) => (
          <span key={index} className={`rounded-xl ${tone}`} />
        ))}
      </div>
      <p className="mt-3 text-forest/85">&ldquo;{latest.text}&rdquo;</p>

      {all && (
        <ol className="mt-4 space-y-3 border-l-2 border-forest/10 pl-4">
          {[...stage.updates].reverse().slice(1).map((item) => (
            <li key={item.text}>
              <p className="text-xs text-forest/50">{formatWhen(dateOf(order, item.at), now)}</p>
              <p className="text-forest/80">&ldquo;{item.text}&rdquo;</p>
            </li>
          ))}
        </ol>
      )}

      {writing && !sent && (
        <form
          className="mt-4 space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (message.trim()) setSent(true);
          }}
        >
          <textarea
            autoFocus
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            aria-label={`Message to ${creator.shortName}`}
            placeholder={`Ask ${creator.shortName} anything about your piece`}
            className="w-full rounded-xl border border-forest/20 px-4 py-3 text-forest outline-none focus:border-forest"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream disabled:opacity-40"
          >
            Send
          </button>
        </form>
      )}
      {sent && (
        <p role="status" className="mt-4 text-sm font-medium text-forest">
          Sent.{" "}
          {creator.replyHours
            ? `${creator.shortName} usually replies within ${creator.replyHours} hours.`
            : `${creator.shortName} replies here.`}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setWriting((value) => !value);
            setSent(false);
            setMessage("");
          }}
          className="rounded-full bg-forest px-5 py-2.5 font-semibold text-cream hover:bg-forest-deep"
        >
          Message {creator.shortName}
        </button>
        {stage.updates.length > 1 && (
          <button
            type="button"
            onClick={() => setAll((value) => !value)}
            aria-expanded={all}
            className="rounded-full border border-forest/20 px-5 py-2.5 font-semibold text-forest hover:border-forest/50"
          >
            {all ? "Latest only" : `All updates (${stage.updates.length})`}
          </button>
        )}
      </div>
    </section>
  );
}

function TrackingPanel({ order, stage, now }: CardProps & { stage: Extract<Stage, { kind: "shipped" }> }) {
  const [copied, setCopied] = useState(false);
  const events = [...stage.events].reverse();
  return (
    <section className="rounded-2xl bg-cream p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold text-forest">
          DHL Express <span className="font-mono font-normal text-forest/70">{stage.tracking}</span>
        </p>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(stage.tracking.replace(/\s/g, ""));
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
          className="text-sm font-medium text-clay hover:text-clay-deep"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <ol className="mt-3 space-y-3">
        {events.map((event, index) => (
          <li key={event.text} className="flex gap-3">
            <span
              aria-hidden
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${index === 0 ? "bg-clay" : "bg-forest/25"}`}
            />
            <div>
              <p className={index === 0 ? "font-semibold text-forest" : "text-forest/80"}>{event.text}</p>
              <p className="text-sm text-forest/50">{formatWhen(dateOf(order, event.at), now)}</p>
            </div>
          </li>
        ))}
      </ol>
      <a
        href={`https://www.dhl.com/gb-en/home/tracking.html?tracking-id=${stage.tracking.replace(/\s/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block font-medium text-clay hover:text-clay-deep"
      >
        Full tracking on DHL →
      </a>
    </section>
  );
}

const PROBLEMS = [
  "It hasn't arrived",
  "It arrived damaged",
  "It isn't as described",
  "It doesn't fit",
];

function ConfirmPanel({ order, parcel, stage, now }: CardProps & { stage: Extract<Stage, { kind: "delivered" }> }) {
  const { creator } = parcel;
  const shopper = useShopper();
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const at = dateOf(order, stage.milestones.delivered!);
  const today = formatWhen(at, now).startsWith("Today");
  const when = today
    ? `${at.getHours() < 12 ? "this morning" : "today"} at ${at.toTimeString().slice(0, 5)}`
    : `on ${formatDay(at)}`;
  const autoOn = new Date(at.getTime() + AUTO_CONFIRM_DAYS * DAY_MS);

  return (
    <section className="rounded-2xl bg-forest-deep p-5 text-cream">
      <h3 className="text-lg font-semibold">Did it arrive as described?</h3>
      <p className="mt-1.5 text-cream/75">
        DHL delivered it {when}. Confirming releases payment to {creator.shortName}. If
        something&rsquo;s wrong, tell us first — your money stays held.
      </p>

      {reporting ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!reason) return;
            shopper.updateParcel(order.id, creator.slug, {
              problem: { reason, note: note.trim(), at: new Date().toISOString() },
            });
          }}
        >
          <fieldset>
            <legend className="text-sm font-semibold">What&rsquo;s wrong?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {PROBLEMS.map((item) => (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${
                    reason === item ? "border-cream bg-forest" : "border-cream/25"
                  }`}
                >
                  <input
                    type="radio"
                    name={`problem-${order.id}-${creator.slug}`}
                    checked={reason === item}
                    onChange={() => setReason(item)}
                    className="accent-clay"
                  />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            aria-label="Tell us more"
            placeholder="Tell us more — photos can follow by email"
            className="w-full rounded-xl border border-cream/25 bg-forest px-4 py-3 text-cream outline-none placeholder:text-cream/40 focus:border-cream"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!reason}
              className="h-12 flex-1 rounded-full bg-clay font-semibold text-cream hover:bg-clay-deep disabled:opacity-50"
            >
              Report it and hold payment
            </button>
            <button
              type="button"
              onClick={() => setReporting(false)}
              className="h-12 rounded-full border border-cream/40 px-5 font-semibold"
            >
              Back
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() =>
              shopper.updateParcel(order.id, creator.slug, { confirmedAt: new Date().toISOString() })
            }
            className="h-12 w-full rounded-full bg-clay font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            Yes, it&rsquo;s arrived and it&rsquo;s right
          </button>
          <button
            type="button"
            onClick={() => setReporting(true)}
            className="h-12 w-full rounded-full border border-cream/40 font-semibold transition-colors hover:border-cream"
          >
            There&rsquo;s a problem
          </button>
        </div>
      )}
      <p className="mt-3 text-sm text-cream/55">
        Confirms itself on {formatDay(autoOn)} if you don&rsquo;t choose.
      </p>
    </section>
  );
}

function ReviewPanel({ order, parcel, stage, now }: CardProps & { stage: Extract<Stage, { kind: "confirmed" }> }) {
  const { creator } = parcel;
  const shopper = useShopper();
  const [stars, setStars] = useState(0);
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState("");

  const confirmed = dateOf(order, stage.confirmedAt);
  const recent = now.getTime() - confirmed.getTime() < 2 * DAY_MS;
  const name = parcel.lines[0].product.name.split(",")[0].toLowerCase();

  if (stage.review) {
    return (
      <Panel title="You confirmed it arrived">
        {creator.shortName} has been paid. Thanks for reviewing — {stage.review.stars}{" "}
        {stage.review.stars === 1 ? "star" : "stars"}
        {stage.review.text && <>, &ldquo;{stage.review.text}&rdquo;</>}
      </Panel>
    );
  }

  return (
    <section className="rounded-2xl bg-cream p-5">
      <h3 className="font-semibold text-forest">
        {recent ? `Thanks — ${creator.shortName} is being paid` : "You confirmed it arrived"}
      </h3>
      <p className="mt-1.5 text-forest/75">
        {!recent && `${creator.shortName} has been paid. `}How did the {name} turn out? Your review
        helps other buyers trust {isMadeToOrder(parcel) ? "made-to-order pieces" : "this shop"}.
      </p>
      <div role="radiogroup" aria-label="Your rating" className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={stars === value}
            aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
            onClick={() => {
              setStars(value);
              setWriting(true);
            }}
            className={`text-3xl leading-none transition-colors ${
              value <= stars ? "text-clay-soft" : "text-forest/20 hover:text-clay-soft/60"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {writing && (
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          maxLength={500}
          aria-label="Your review"
          placeholder="What should the next buyer know?"
          className="mt-3 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-forest outline-none focus:border-forest"
        />
      )}
      <button
        type="button"
        disabled={writing && stars === 0}
        onClick={() => {
          if (!writing) return setWriting(true);
          shopper.updateParcel(order.id, creator.slug, { review: { stars, text: text.trim() } });
        }}
        className="mt-4 h-12 w-full rounded-full bg-clay font-semibold text-cream transition-colors hover:bg-clay-deep disabled:opacity-50 sm:w-56"
      >
        {writing ? "Post review" : "Write a review"}
      </button>
    </section>
  );
}

/** Three ready-to-ship pieces from the same craft, to replace what was refunded. */
function Similar({ product, order }: { product: Product; order: TrackedOrder }) {
  const ready = (item: Product) =>
    item.id !== product.id && !item.delivery && !blockerFor(item, order.market);
  const same = products.filter((item) => ready(item) && item.category === product.category);
  const picks = [...same, ...products.filter((item) => ready(item) && !same.includes(item))].slice(0, 3);
  if (picks.length === 0) return null;

  return (
    <>
      <h4 className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest/55">
        Similar, ready to ship
      </h4>
      <ul className="mt-2 grid grid-cols-3 gap-2.5">
        {picks.map((item) => (
          <li key={item.id}>
            <Link
              href={`/product/${item.id}`}
              className={`block aspect-[4/3] rounded-xl ${item.tone} transition-opacity hover:opacity-90`}
            >
              <span className="sr-only">
                {item.name}, {formatMoney(item.priceGBP, order.market)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
