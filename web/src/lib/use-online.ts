"use client";

import { useEffect, useState } from "react";

/**
 * Tracks connectivity for the offline state in the designs. Starts optimistic so
 * the server and first client render agree, then corrects on mount.
 */
export function useOnline() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return online;
}
