"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useMarket } from "@/components/marketplace/MarketProvider";
import { useShopper } from "@/components/marketplace/ShopperProvider";
import PostCard, { type PostAction } from "@/components/marketplace/feed/PostCard";
import { NEW_WITHIN_HOURS, posts, type FeedPost, type PostKind } from "@/data/feed";
import {
  creators,
  getCreatorBySlug,
  getProduct,
  productsByCreator,
  type Creator,
} from "@/data/marketplace";
import { useToday } from "@/lib/delivery";
import { useOnline } from "@/lib/use-online";

type Filter = "all" | PostKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "new-piece", label: "New pieces" },
  { key: "making-of", label: "Making of" },
];

/** What just happened to a post, kept in its place until undone or the page is left. */
type Notice = { message: string; undo: () => void };

export default function FeedView() {
  const shopper = useShopper();
  const { ready: marketReady } = useMarket();
  const today = useToday();
  const online = useOnline();

  const [filter, setFilter] = useState<Filter>("all");
  const [notices, setNotices] = useState<Record<string, Notice>>({});
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  // Someone who arrives following nobody keeps the introductions on screen
  // while they follow a few, rather than being moved on after the first.
  const [introducing, setIntroducing] = useState<boolean | null>(null);

  const ready = shopper.ready && marketReady;
  const following = shopper.following;

  const sorted = useMemo(() => [...posts].sort((a, b) => a.hoursAgo - b.hoursAgo), []);

  function shows(post: FeedPost) {
    if (!following.includes(post.creatorSlug)) return false;
    if (filter !== "all" && post.kind !== filter) return false;
    if (shopper.hiddenPosts.includes(post.id)) return false;
    if (post.kind === "making-of" && shopper.fewerMakingOf.includes(post.creatorSlug)) {
      return false;
    }
    return true;
  }

  const rows = sorted.filter((post) => notices[post.id] || shows(post));
  const visibleCount = rows.filter((post) => !notices[post.id]).length;

  function act(post: FeedPost, creator: Creator, action: PostAction) {
    const forget = () =>
      setNotices((current) => {
        const next = { ...current };
        delete next[post.id];
        return next;
      });

    let notice: Notice;
    switch (action) {
      case "hide":
        shopper.setPostHidden(post.id, true);
        notice = {
          message: "Post hidden. You'll see fewer posts like it.",
          undo: () => shopper.setPostHidden(post.id, false),
        };
        break;
      case "fewer":
        shopper.setFewerMakingOf(creator.slug, true);
        notice = {
          message: `Fewer making-of posts from ${creator.shortName}. New pieces still show.`,
          undo: () => shopper.setFewerMakingOf(creator.slug, false),
        };
        break;
      case "unfollow":
        shopper.toggleFollow(creator.slug);
        notice = {
          message: `Unfollowed ${creator.name}.`,
          undo: () => shopper.toggleFollow(creator.slug),
        };
        break;
      case "report":
        shopper.setPostHidden(post.id, true);
        notice = {
          message: "Reported. FITS reviews every report within a day.",
          undo: () => shopper.setPostHidden(post.id, false),
        };
        break;
    }
    setNotices((current) => ({
      ...current,
      [post.id]: {
        message: notice.message,
        undo: () => {
          notice.undo();
          forget();
        },
      },
    }));
  }

  if (ready && introducing === null) setIntroducing(following.length === 0);
  if (ready && (introducing || following.length === 0)) {
    return <NotFollowingYet onDone={() => setIntroducing(false)} />;
  }

  return (
    <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-6 pt-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <main className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl text-forest">Your feed</h1>
          <div role="group" aria-label="Show" className="flex gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={filter === item.key}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  filter === item.key
                    ? "border-forest bg-forest text-cream"
                    : "border-forest/20 text-forest hover:border-forest/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {ready && !online && (
          <div
            role="alert"
            className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-clay/40 bg-clay-wash/60 px-5 py-3.5 text-forest"
          >
            <p className="flex-1">
              <span aria-hidden className="mr-2 font-bold text-clay">
                !
              </span>
              <strong className="font-semibold">Couldn&rsquo;t refresh your feed.</strong>{" "}
              Showing posts from {formatSince(loadedAt)}. Check your connection.
            </p>
            <button
              type="button"
              onClick={() => {
                if (navigator.onLine) setLoadedAt(Date.now());
              }}
              className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream hover:bg-forest-deep"
            >
              Try again
            </button>
          </div>
        )}

        {!ready ? (
          <FeedSkeleton />
        ) : (
          <ol className="mt-6 space-y-5">
            {rows.map((post) => {
              const creator = getCreatorBySlug(post.creatorSlug);
              const product = getProduct(post.productId);
              if (!creator || !product) return null;
              const notice = notices[post.id];
              return (
                <li key={post.id}>
                  {notice ? (
                    <div
                      role="status"
                      className="flex items-center justify-between gap-4 rounded-full bg-forest-deep py-2.5 pl-6 pr-2.5 text-sm text-cream"
                    >
                      {notice.message}
                      <button
                        type="button"
                        onClick={notice.undo}
                        className="rounded-full bg-forest px-4 py-1.5 font-semibold text-clay-soft hover:text-cream"
                      >
                        Undo
                      </button>
                    </div>
                  ) : (
                    <PostCard
                      post={post}
                      creator={creator}
                      product={product}
                      today={today}
                      onAction={(action) => act(post, creator, action)}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {ready && (
          <CaughtUp
            followingCount={following.length}
            empty={visibleCount === 0}
            oldestHours={rows.length ? rows[rows.length - 1].hoursAgo : 0}
            today={today}
          />
        )}
      </main>

      {ready && <FeedSidebar />}
    </div>
  );
}

function formatSince(timestamp: number) {
  const minutes = Math.round((Date.now() - timestamp) / 60000);
  if (minutes < 1) return "a moment ago";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? "an hour ago" : `${hours} hours ago`;
}

function CaughtUp({
  followingCount,
  empty,
  oldestHours,
  today,
}: {
  followingCount: number;
  empty: boolean;
  oldestHours: number;
  today: Date | null;
}) {
  const since =
    today && oldestHours < 7 * 24
      ? ` since ${new Date(today.getTime() - oldestHours * 3600000).toLocaleDateString(
          "en-GB",
          { weekday: "long" },
        )}`
      : "";

  return (
    <section className="mt-5 flex flex-wrap items-center gap-6 rounded-3xl bg-forest-deep px-7 py-6 text-cream">
      <span
        aria-hidden
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage text-2xl text-forest"
      >
        ✓
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-semibold">
          {empty ? "Nothing new here" : "You're all caught up"}
        </h2>
        <p className="mt-1 text-cream/75">
          {empty
            ? "Nothing matches this view right now. Try Everything, or follow a few more creators."
            : `That's everything from the ${followingCount} ${
                followingCount === 1 ? "creator" : "creators"
              } you follow${since}.`}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/creators"
          className="rounded-full bg-clay px-5 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep"
        >
          Discover creators
        </Link>
        <Link
          href="/category/fashion"
          className="rounded-full border border-cream/40 px-5 py-3 font-semibold text-cream transition-colors hover:border-cream"
        >
          Browse Fashion
        </Link>
      </div>
    </section>
  );
}

/** Who you follow, with what is new from each, and one creator worth adding. */
function FeedSidebar() {
  const shopper = useShopper();
  const [managing, setManaging] = useState(false);

  const followed = shopper.following
    .map((slug) => getCreatorBySlug(slug))
    .filter((creator): creator is Creator => Boolean(creator))
    .map((creator) => ({
      creator,
      fresh: posts.filter(
        (post) =>
          post.creatorSlug === creator.slug &&
          post.hoursAgo <= NEW_WITHIN_HOURS &&
          !shopper.hiddenPosts.includes(post.id),
      ).length,
    }))
    .sort((a, b) => b.fresh - a.fresh);

  const shown = managing ? followed : followed.slice(0, 5);
  const suggestion = suggest(shopper.following);

  return (
    <aside className="space-y-5">
      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest/55">
          You follow {followed.length} {followed.length === 1 ? "creator" : "creators"}
        </h2>
        <ul className="mt-4 space-y-3">
          {shown.map(({ creator, fresh }) => (
            <li key={creator.slug} className="flex items-center gap-3">
              <span aria-hidden className={`h-9 w-9 shrink-0 rounded-full ${creator.tone}`} />
              <Link
                href={`/creator/${creator.slug}`}
                className="min-w-0 flex-1 truncate font-medium text-forest hover:text-clay"
              >
                {creator.name}
              </Link>
              {managing ? (
                <button
                  type="button"
                  onClick={() => shopper.toggleFollow(creator.slug)}
                  className="text-sm text-forest/60 hover:text-clay-deep"
                >
                  Unfollow
                </button>
              ) : (
                fresh > 0 && <span className="text-sm text-clay">{fresh} new</span>
              )}
            </li>
          ))}
        </ul>
        {!managing && followed.length > shown.length && (
          <p className="mt-3 text-sm text-forest/55">
            and {followed.length - shown.length} more
          </p>
        )}
        <button
          type="button"
          onClick={() => setManaging((value) => !value)}
          className="mt-4 font-medium text-clay hover:text-clay-deep"
        >
          {managing ? "Done" : "Manage who you follow →"}
        </button>
      </section>

      {suggestion && (
        <section className="rounded-3xl bg-forest-deep p-6 text-cream">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-clay-soft">
            Suggested for you
          </h2>
          <p className="mt-4 flex items-center gap-3">
            <span
              aria-hidden
              className={`h-10 w-10 shrink-0 rounded-full ${suggestion.creator.tone}`}
            />
            <span className="min-w-0">
              <Link
                href={`/creator/${suggestion.creator.slug}`}
                className="block font-semibold hover:text-clay-soft"
              >
                {suggestion.creator.name}
              </Link>
              <span className="block text-sm text-cream/65">
                {suggestion.creator.craft} · {suggestion.creator.city}
              </span>
            </span>
          </p>
          <p className="mt-4 text-sm text-cream/75">{suggestion.reason}</p>
          <button
            type="button"
            onClick={() => shopper.toggleFollow(suggestion.creator.slug)}
            className="mt-4 w-full rounded-full border border-cream/50 py-3 font-semibold transition-colors hover:border-cream"
          >
            Follow
          </button>
        </section>
      )}
    </aside>
  );
}

/** Someone unfollowed who works in a craft you already follow, else the best known. */
function suggest(following: string[]) {
  const others = creators.filter((creator) => !following.includes(creator.slug));
  if (others.length === 0) return null;

  for (const candidate of others) {
    const crafts = new Set(productsByCreator(candidate.name).map((p) => p.category));
    const shared = following
      .map((slug) => getCreatorBySlug(slug))
      .find(
        (creator) =>
          creator &&
          productsByCreator(creator.name).some((product) => crafts.has(product.category)),
      );
    if (shared) {
      return { creator: candidate, reason: `Because you follow ${shared.name}.` };
    }
  }

  const popular = [...others].sort((a, b) => b.followers - a.followers)[0];
  return { creator: popular, reason: "Popular with buyers this week." };
}

function FeedSkeleton() {
  return (
    <div aria-hidden className="mt-6 space-y-5">
      {[0, 1].map((key) => (
        <div key={key} className="rounded-3xl bg-white p-6 motion-safe:animate-pulse">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-sand/70" />
            <span className="space-y-2">
              <span className="block h-3.5 w-44 rounded-full bg-sand/70" />
              <span className="block h-3 w-28 rounded-full bg-sand/70" />
            </span>
          </div>
          <div className="mt-6 h-3.5 w-11/12 rounded-full bg-sand/70" />
          <div className="mt-3 h-3.5 w-3/5 rounded-full bg-sand/70" />
          <div className="mt-5 grid h-56 grid-cols-[1.4fr_1fr] gap-2.5 sm:h-60">
            <span className="rounded-2xl bg-sand/70" />
            <span className="rounded-2xl bg-sand/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Following nobody: the feed has nothing to show, so it introduces people. */
function NotFollowingYet({ onDone }: { onDone: () => void }) {
  const shopper = useShopper();
  const count = shopper.following.length;

  // Makers of what the visitor has saved or put in the cart come first.
  const interest = new Set(
    [...shopper.saved, ...shopper.cart.map((line) => line.productId)]
      .map((id) => getProduct(id)?.creator)
      .filter(Boolean),
  );
  const picks = [...creators]
    .sort(
      (a, b) =>
        Number(interest.has(b.name)) - Number(interest.has(a.name)) ||
        b.followers - a.followers,
    )
    .slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-[90rem] px-6 pt-10">
      <h1 className="font-display text-4xl text-forest">
        Your feed fills up when you follow creators
      </h1>
      <p className="mt-3 max-w-2xl text-forest/65">
        Their new pieces and making-of photos appear here first.{" "}
        {interest.size > 0
          ? "Here are some who make what you've been looking at."
          : "Here are some to start with."}
      </p>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((creator) => {
          const lead = productsByCreator(creator.name)[0];
          const following = shopper.isFollowing(creator.slug);
          return (
            <li key={creator.slug} className="overflow-hidden rounded-3xl bg-white">
              <Link
                href={`/creator/${creator.slug}`}
                aria-label={`${creator.name}'s shop`}
                className={`block h-48 ${lead?.tone ?? creator.tone}`}
              />
              <div className="p-5">
                <p className="flex items-center gap-2.5">
                  <span aria-hidden className={`h-8 w-8 shrink-0 rounded-full ${creator.tone}`} />
                  <Link
                    href={`/creator/${creator.slug}`}
                    className="truncate font-semibold text-forest hover:text-clay"
                  >
                    {creator.name}
                    {creator.verified && <span className="text-moss"> ✓</span>}
                  </Link>
                </p>
                <p className="mt-2 truncate text-sm text-forest/60">
                  {creator.craft} · {creator.city}, {creator.country}
                </p>
                <button
                  type="button"
                  onClick={() => shopper.toggleFollow(creator.slug)}
                  aria-pressed={following}
                  className={`mt-4 w-full rounded-full border-2 border-forest py-2.5 font-semibold transition-colors ${
                    following ? "bg-forest text-cream" : "text-forest hover:bg-forest/5"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {count > 0 && (
        <button
          type="button"
          onClick={onDone}
          className="mt-8 rounded-full bg-clay px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-clay-deep"
        >
          See your feed · {count} {count === 1 ? "creator" : "creators"}
        </button>
      )}
    </main>
  );
}
