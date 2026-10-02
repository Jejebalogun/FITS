"use client";

import { useEffect, type RefObject } from "react";

/** Closes a popover on an outside click or Escape. */
export function useDismiss(
  ref: RefObject<HTMLElement>,
  open: boolean,
  close: () => void,
) {
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) close();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, open, close]);
}
