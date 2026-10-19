"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  defaultMarket,
  getMarket,
  type Market,
  type MarketCode,
} from "@/data/markets";

const STORAGE_KEY = "fits.market";

type MarketContextValue = {
  market: Market;
  setMarket: (code: MarketCode) => void;
  /** True until the visitor has confirmed or changed the detected country. */
  detected: boolean;
  confirmDetected: () => void;
  /**
   * False until a stored choice has been read. Prices rendered before then are
   * in the default currency and may be about to change, so lists wait for it.
   */
  ready: boolean;
  /** The header's ship-to menu, opened from elsewhere ("Change ship-to"). */
  pickerOpen: boolean;
  setPickerOpen: (open: boolean) => void;
};

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarketState] = useState<Market>(defaultMarket);
  const [detected, setDetected] = useState(false);
  const [ready, setReady] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // A real build would geolocate here. Restoring a prior choice stands in, and
  // runs after mount so server and client agree on the first render.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private mode or blocked storage — fall back to the detected default.
    }

    if (stored) {
      setMarketState(getMarket(stored as MarketCode));
    } else {
      setDetected(true);
    }
    setReady(true);
  }, []);

  const setMarket = useCallback((code: MarketCode) => {
    setMarketState(getMarket(code));
    setDetected(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Not persisting is survivable; the choice still applies to this visit.
    }
  }, []);

  const confirmDetected = useCallback(() => {
    setDetected(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, defaultMarket.code);
    } catch {
      // As above.
    }
  }, []);

  const value = useMemo(
    () => ({
      market,
      setMarket,
      detected,
      confirmDetected,
      ready,
      pickerOpen,
      setPickerOpen,
    }),
    [market, setMarket, detected, confirmDetected, ready, pickerOpen],
  );

  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarket must be used inside a MarketProvider");
  }
  return context;
}
