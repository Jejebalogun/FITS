"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { useMarket } from "@/components/marketplace/MarketProvider";
import { formatMoney } from "@/data/markets";
import { creatorOf } from "@/data/marketplace";
import {
  searchCreators,
  searchProducts,
  suggestPhrases,
  tokenize,
} from "@/lib/search";
import { useDismiss } from "@/lib/use-dismiss";

const MIN_CHARS = 2;

export function searchHref(query: string) {
  return `/search?q=${encodeURIComponent(query.trim())}`;
}

/**
 * The header search box. Typing offers phrases, creators and pieces as it
 * goes; Enter or "See all results" opens the full results page.
 */
export default function HeaderSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const { market } = useMarket();
  const listId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // A new search from elsewhere on the page (a "try instead" chip) lands here.
  useEffect(() => setValue(initialQuery), [initialQuery]);

  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
  }, []);
  useDismiss(wrapper, open, close);

  const query = value.trim();
  const suggestions = useMemo(() => {
    if (query.length < MIN_CHARS) return null;
    const pieces = searchProducts(query);
    return {
      phrases: suggestPhrases(query),
      creators: searchCreators(query, []).slice(0, 2),
      pieces: pieces.slice(0, 3),
    };
  }, [query]);

  // Every row the arrow keys can reach, in the order they appear.
  const options = suggestions
    ? [
        ...suggestions.phrases.map((item) => searchHref(item.phrase)),
        ...suggestions.creators.map((creator) => `/creator/${creator.slug}`),
        ...suggestions.pieces.map((product) => `/product/${product.id}`),
        searchHref(query),
      ]
    : [];

  const showList = open && suggestions !== null;
  const optionId = (index: number) => `${listId}-option-${index}`;

  function go(href: string) {
    close();
    input.current?.blur();
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList || options.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index <= 0 ? options.length - 1 : index - 1));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      go(options[active]);
    } else if (event.key === "Escape") {
      close();
    }
  }

  // Where each group starts in `options`.
  const creatorStart = suggestions?.phrases.length ?? 0;
  const pieceStart = creatorStart + (suggestions?.creators.length ?? 0);
  const allIndex = options.length - 1;

  return (
    <div ref={wrapper} className="relative hidden max-w-md flex-1 md:block">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (query) go(searchHref(query));
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/45"
        >
          ○
        </span>
        <input
          ref={input}
          type="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search pieces or creators"
          aria-label="Search pieces or creators"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          className={`w-full rounded-full border bg-forest px-11 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-cream/45 [&::-webkit-search-cancel-button]:hidden ${
            showList ? "border-clay" : "border-cream/20 focus:border-cream/50"
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              input.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/55 transition-colors hover:text-cream"
          >
            ✕
          </button>
        )}
      </form>

      {showList && (
        <div
          id={listId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-1/2 top-full z-50 mt-2 w-[37rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-3xl bg-cream p-3 shadow-xl"
        >
          {suggestions.phrases.map((item, i) => (
            <SuggestionRow
              key={item.phrase}
              id={optionId(i)}
              active={active === i}
              href={options[i]}
              onPick={go}
            >
              <span aria-hidden className="text-forest/50">
                ○
              </span>
              <span className="flex-1 truncate text-forest">
                <Highlighted text={item.phrase} query={query} />
              </span>
              <span className="text-xs text-forest/45">in {item.where}</span>
            </SuggestionRow>
          ))}

          {suggestions.creators.length > 0 && (
            <div role="group" aria-label="Creators">
              <GroupHeading>Creators</GroupHeading>
              {suggestions.creators.map((creator, n) => {
                const i = creatorStart + n;
                return (
                  <SuggestionRow
                    key={creator.slug}
                    id={optionId(i)}
                    active={active === i}
                    href={options[i]}
                    onPick={go}
                  >
                    <span
                      aria-hidden
                      className={`h-9 w-9 shrink-0 rounded-full ${creator.tone}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-forest">
                        {creator.name}
                        {creator.verified && <span className="text-moss"> ✓</span>}
                      </span>
                      <span className="block truncate text-xs text-forest/55">
                        {creator.craft} · {creator.country} · {creator.pieceCount}{" "}
                        pieces
                      </span>
                    </span>
                  </SuggestionRow>
                );
              })}
            </div>
          )}

          {suggestions.pieces.length > 0 && (
            <div role="group" aria-label="Pieces">
              <GroupHeading>Pieces</GroupHeading>
              <div className="grid grid-cols-3 gap-3 px-3 pb-2">
                {suggestions.pieces.map((product, n) => {
                  const i = pieceStart + n;
                  return (
                    <Link
                      key={product.id}
                      id={optionId(i)}
                      role="option"
                      aria-selected={active === i}
                      tabIndex={-1}
                      href={options[i]}
                      onClick={(event) => {
                        event.preventDefault();
                        go(options[i]);
                      }}
                      className={`rounded-xl p-1 transition-colors ${
                        active === i ? "bg-sand" : "hover:bg-sand/60"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`block aspect-[16/10] rounded-lg ${product.tone}`}
                      />
                      <span className="mt-1.5 block truncate text-xs font-medium text-forest">
                        {product.name}
                      </span>
                      <span className="block text-xs font-semibold text-forest">
                        {formatMoney(product.priceGBP, market)}
                      </span>
                      <span className="sr-only">by {creatorOf(product).name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-1 border-t border-forest/10 pt-1">
            <SuggestionRow
              id={optionId(allIndex)}
              active={active === allIndex}
              href={options[allIndex]}
              onPick={go}
            >
              <span className="text-sm font-medium text-clay">
                See all results for &ldquo;{query}&rdquo; →
              </span>
            </SuggestionRow>
          </div>
        </div>
      )}
    </div>
  );
}

function SuggestionRow({
  id,
  active,
  href,
  onPick,
  children,
}: {
  id: string;
  active: boolean;
  href: string;
  onPick: (href: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      id={id}
      role="option"
      aria-selected={active}
      tabIndex={-1}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onPick(href);
      }}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        active ? "bg-sand" : "hover:bg-sand/60"
      }`}
    >
      {children}
    </Link>
  );
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-forest/50">
      {children}
    </p>
  );
}

/** Sets the words already typed in the heavier weight. */
function Highlighted({ text, query }: { text: string; query: string }) {
  const typed = tokenize(query).join(" ");
  if (!text.startsWith(typed)) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold">{typed}</strong>
      {text.slice(typed.length)}
    </>
  );
}
