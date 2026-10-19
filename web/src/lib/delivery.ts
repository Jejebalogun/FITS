"use client";

import { useEffect, useState } from "react";

import type { Creator, Product } from "@/data/marketplace";

export type DayWindow = { minDays: number; maxDays: number };

/**
 * Door to door. A made-to-order piece carries the window its creator commits
 * to; a ready one only has the journey.
 */
export function arrivalWindow(product: Product, creator: Creator): DayWindow {
  return product.delivery ?? creator.transitDays;
}

function addDays(from: Date, days: number) {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return next;
}

function monthOf(date: Date) {
  return date.toLocaleString("en-GB", { month: "short" });
}

/** "14–18 Oct", or "30 Oct – 2 Nov" when the window crosses a month. */
export function formatDateWindow(window: DayWindow, from: Date) {
  const start = addDays(from, window.minDays);
  const end = addDays(from, window.maxDays);

  if (window.minDays === window.maxDays) {
    return `${start.getDate()} ${monthOf(start)}`;
  }
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.getDate()} ${monthOf(end)}`;
  }
  return `${start.getDate()} ${monthOf(start)} – ${end.getDate()} ${monthOf(end)}`;
}

/** The widest window across several pieces, for a parcel that waits for all of them. */
export function combineWindows(windows: DayWindow[]): DayWindow | null {
  if (windows.length === 0) return null;
  return {
    minDays: Math.max(...windows.map((window) => window.minDays)),
    maxDays: Math.max(...windows.map((window) => window.maxDays)),
  };
}

/**
 * Today, but only after mount. Product pages are rendered at build time, so a
 * date in the server markup would be the build date and would not match the
 * browser's.
 */
export function useToday() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  return today;
}
