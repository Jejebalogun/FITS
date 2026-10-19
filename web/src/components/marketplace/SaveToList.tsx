"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useShopper } from "@/components/marketplace/ShopperProvider";
import type { Product } from "@/data/marketplace";
import { useDismiss } from "@/lib/use-dismiss";

/**
 * A heart that saves, then offers lists. Pressing it again reopens the lists
 * rather than unsaving straight away, so a piece is never lost by a stray tap.
 */
export default function SaveToList({
  product,
  className = "h-12 w-12 border border-forest/20 text-xl",
  align = "right",
  placement = "above",
}: {
  product: Product;
  className?: string;
  /** Which edge of the heart the panel lines up with. */
  align?: "left" | "right";
  /** Above for a heart at the foot of a card, below for one at its top. */
  placement?: "above" | "below";
}) {
  const shopper = useShopper();
  const saved = shopper.isSaved(product.id);
  const [open, setOpen] = useState(false);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const wrapper = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setNaming(false);
    setName("");
  }, []);
  useDismiss(wrapper, open, close);

  const nameInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (naming) nameInput.current?.focus();
  }, [naming]);

  function press() {
    if (!saved) shopper.toggleSaved(product.id);
    setOpen((value) => !value || !saved);
  }

  function create(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    shopper.createList(name, false, product.id);
    setNaming(false);
    setName("");
  }

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={press}
        aria-pressed={saved}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={saved ? `${product.name} is saved — lists` : `Save ${product.name}`}
        className={`flex items-center justify-center rounded-full bg-white transition-colors ${
          saved ? "border-clay" : "hover:border-forest/50"
        } ${className}`}
      >
        <span aria-hidden className={saved ? "text-clay" : "text-forest/50"}>
          {saved ? "♥" : "♡"}
        </span>
      </button>

      {open && saved && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Add to a list"
          className={`absolute z-40 w-80 rounded-2xl border border-forest/10 bg-cream p-4 shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          } ${placement === "above" ? "bottom-full mb-3" : "top-full mt-3"}`}
        >
          <p className="flex items-center gap-2.5 font-semibold text-forest">
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center rounded-full bg-moss text-xs text-cream"
            >
              ✓
            </span>
            Saved. Add it to a list?
          </p>

          {shopper.lists.length > 0 && (
            <ul className="mt-3 space-y-1">
              {shopper.lists.map((list) => {
                const inList = list.productIds.includes(product.id);
                return (
                  <li key={list.id}>
                    <label
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-forest transition-colors ${
                        inList ? "bg-sand/70" : "hover:bg-sand/40"
                      }`}
                    >
                      {list.name}
                      <input
                        type="checkbox"
                        checked={inList}
                        onChange={() => shopper.toggleInList(list.id, product.id)}
                        className="h-5 w-5 accent-forest"
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          {naming ? (
            <form onSubmit={create} className="mt-2 flex gap-2">
              <input
                ref={nameInput}
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={40}
                placeholder="List name"
                aria-label="New list name"
                className="min-w-0 flex-1 rounded-xl border border-forest/20 bg-white px-3 py-2 text-sm text-forest outline-none focus:border-forest"
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="rounded-xl bg-forest px-3 text-sm font-semibold text-cream disabled:opacity-40"
              >
                Add
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setNaming(true)}
              className="mt-2 px-3 py-1.5 text-sm font-medium text-clay hover:text-clay-deep"
            >
              + New list
            </button>
          )}

          <div className="mt-2 border-t border-forest/10 pt-2">
            <button
              type="button"
              onClick={() => {
                shopper.toggleSaved(product.id);
                close();
              }}
              className="px-3 py-1.5 text-sm text-forest/60 hover:text-forest"
            >
              Remove from saved
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
