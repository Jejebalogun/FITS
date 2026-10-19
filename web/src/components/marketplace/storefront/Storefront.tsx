"use client";

import { useEffect, useState } from "react";

import { formatFollowers } from "@/components/marketplace/CreatorResultCard";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { useShopper } from "@/components/marketplace/ShopperProvider";
import CatalogueTab from "@/components/marketplace/storefront/CatalogueTab";
import ReviewsTab from "@/components/marketplace/storefront/ReviewsTab";
import StoryTab from "@/components/marketplace/storefront/StoryTab";
import {
  isOpenForOrders,
  productsByCreator,
  type Creator,
} from "@/data/marketplace";
import { arrivalWindow } from "@/lib/delivery";

type Tab = "catalogue" | "story" | "reviews";

export default function Storefront({ creator }: { creator: Creator }) {
  const [tab, setTab] = useState<Tab>("catalogue");
  const products = productsByCreator(creator.name);
  const open = isOpenForOrders(creator);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "catalogue", label: "Catalogue", count: creator.pieceCount },
    { key: "story", label: "Story" },
    { key: "reviews", label: "Reviews", count: creator.reviews },
  ];

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Cover — the creator's own photo once uploads exist */}
      <div aria-hidden className={`relative h-56 overflow-hidden sm:h-72 ${creator.tone}`}>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_28px,rgba(255,255,255,0.07)_28px_56px)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <span
            aria-hidden
            className={`relative -mt-20 h-36 w-36 shrink-0 rounded-full border-[6px] border-cream sm:h-44 sm:w-44 ${creator.tone}`}
          />

          <div className="min-w-0 flex-1 lg:pt-3">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="font-display text-4xl text-forest sm:text-5xl">
                {creator.name}
              </h1>
              <StatusBadge creator={creator} />
            </div>
            <p className="mt-2 text-forest/65">
              {creator.craft} · {creator.city}, {creator.country} ·{" "}
              {creator.joinedDaysAgo !== undefined
                ? `joined ${creator.joinedDaysAgo} ${
                    creator.joinedDaysAgo === 1 ? "day" : "days"
                  } ago`
                : `on FITS since ${creator.memberSince} · ${formatFollowers(
                    creator.followers,
                  )} followers`}
            </p>
          </div>

          <div className="flex gap-3 lg:pt-5">
            <FollowButton creator={creator} />
            <ShareButton name={creator.name} />
          </div>
        </div>
      </div>

      {/* Tabs and the numbers buyers check first */}
      <div className="mt-10 border-b border-forest/15">
        <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-end justify-between gap-x-10 gap-y-4 px-6">
          <div role="tablist" aria-label={`${creator.name}'s shop`} className="flex gap-10">
            {tabs.map((item) => {
              const active = item.key === tab;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.key)}
                  className={`-mb-px border-b-[3px] pb-4 text-lg font-semibold transition-colors ${
                    active
                      ? "border-clay text-forest"
                      : "border-transparent text-forest/45 hover:text-forest/70"
                  }`}
                >
                  {item.label}
                  {item.count !== undefined && (
                    <span className={active ? "" : "font-medium"}> ·{item.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <ShopStats creator={creator} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-6 pt-8">
        {tab === "catalogue" && (
          <CatalogueTab creator={creator} products={products} open={open} />
        )}
        {tab === "story" && <StoryTab creator={creator} products={products} />}
        {tab === "reviews" && <ReviewsTab creator={creator} />}
      </div>
    </div>
  );
}

function StatusBadge({ creator }: { creator: Creator }) {
  if (!isOpenForOrders(creator)) {
    return (
      <span className="rounded-full border border-clay/40 bg-clay-wash px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-clay-deep">
        Verification in progress
      </span>
    );
  }
  if (!creator.verified) return null;
  return (
    <span className="rounded-full bg-forest px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-cream">
      ✓ Verified
    </span>
  );
}

function FollowButton({ creator }: { creator: Creator }) {
  const { isFollowing, toggleFollow } = useShopper();
  const following = isFollowing(creator.slug);

  return (
    <button
      type="button"
      onClick={() => toggleFollow(creator.slug)}
      aria-pressed={following}
      className={`h-14 w-44 rounded-full border-2 border-forest text-lg font-semibold transition-colors ${
        following
          ? "bg-forest text-cream hover:bg-forest-deep"
          : "text-forest hover:bg-forest/5"
      }`}
    >
      {following ? "Following" : "Follow"}
      <span className="sr-only"> {creator.name}</span>
    </button>
  );
}

/** The system share sheet where there is one, otherwise the link is copied. */
function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${name} on FITS`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Dismissing the share sheet lands here too, and needs no message.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="h-14 w-32 rounded-full border border-forest/25 text-lg font-semibold text-forest transition-colors hover:border-forest/50"
    >
      <span aria-live="polite">{copied ? "Copied" : "Share"}</span>
    </button>
  );
}

/** "4.9 rating · 96% on time · < 4h reply time · Ships to the UK in 12–18 days" */
function ShopStats({ creator }: { creator: Creator }) {
  const { market, ready } = useMarket();
  const pieces = productsByCreator(creator.name);
  const reaching = pieces.filter((product) => product.shipsTo.includes(market.code));

  const windows = reaching.map((product) => arrivalWindow(product, creator));
  const fastest = Math.min(...windows.map((window) => window.minDays));
  const slowest = Math.max(...windows.map((window) => window.maxDays));

  return (
    <dl className="flex flex-wrap gap-x-9 gap-y-2 pb-4 text-forest/70">
      <Stat value={creator.reviews > 0 ? creator.rating.toFixed(1) : "New"} label="rating" />
      <Stat
        value={creator.onTimeRate !== undefined ? `${creator.onTimeRate}%` : "—"}
        label="on time"
      />
      <Stat
        value={creator.replyHours !== undefined ? `< ${creator.replyHours}h` : "—"}
        label="reply time"
      />
      {ready && (
        <div>
          <dt className="sr-only">Delivery</dt>
          <dd>
            {reaching.length === 0 ? (
              <>Doesn&rsquo;t ship to {market.placeName} yet</>
            ) : (
              <>
                Ships to {market.placeName} in{" "}
                <strong className="font-semibold text-forest">
                  {fastest === slowest ? fastest : `${fastest}–${slowest}`} days
                </strong>
              </>
            )}
          </dd>
        </div>
      )}
    </dl>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="order-2">{label}</dt>
      <dd className="order-1 font-semibold text-forest">{value}</dd>
    </div>
  );
}
