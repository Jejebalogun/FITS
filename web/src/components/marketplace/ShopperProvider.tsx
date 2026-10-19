"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { MarketCode } from "@/data/markets";
import type { Address } from "@/lib/checkout";

const STORAGE_KEY = "fits.shopper";

/** Kept as typed so a half-entered value survives a unit switch untouched. */
export type Measurements = {
  unit: "in" | "cm";
  bust: string;
  waist: string;
  hips: string;
  length: string;
};

export type CartLine = {
  /** Same piece, same choices — the same key, so adding it again adds one. */
  key: string;
  productId: string;
  size: string | null;
  /** Set instead of a size when the piece is made to measure. */
  measurements: Measurements | null;
  colour: string | null;
  note: string;
  qty: number;
};

export type NewCartLine = Omit<CartLine, "key" | "qty">;

/** What the buyer has done about one parcel of an order. */
export type ParcelUpdate = {
  confirmedAt?: string;
  review?: { stars: number; text: string };
  /** Agreed to the creator's later date. */
  waited?: boolean;
  cancelledAt?: string;
  problem?: { reason: string; note: string; at: string };
};

/** What was bought, kept so the confirmation and order pages can show it. */
export type PlacedOrder = {
  id: string;
  placedAt: string;
  email: string;
  name: string;
  address: string;
  market: MarketCode;
  /** "Visa ending 4417", "Bank transfer in naira". */
  paidWith: string;
  /** Already formatted in the currency it was paid in: "£76.40", "₦152,800". */
  paid: string;
  lines: CartLine[];
  /** Guest asked for an account to track the order. */
  createAccount: boolean;
};

/** A named group of saved pieces: "Wedding in December". */
export type SavedList = {
  id: string;
  name: string;
  /** Anyone with the link can see it. Prices show; the owner's sizes never do. */
  shared: boolean;
  productIds: string[];
};

type ShopperState = {
  cart: CartLine[];
  saved: string[];
  /** Saved to the profile for reuse, per the bespoke ordering flow. */
  measurements: Measurements | null;
  /** Creator slugs. Not tied to an account yet, so it lives with the cart. */
  following: string[];
  /** Every list holds only saved pieces; unsaving takes a piece out of all of them. */
  lists: SavedList[];
  /** Feed preferences. */
  hiddenPosts: string[];
  /** Creators whose making-of posts the buyer wants fewer of. */
  fewerMakingOf: string[];
  addresses: Address[];
  orders: PlacedOrder[];
  /** Keyed `${orderId}/${creatorSlug}`. */
  parcelUpdates: Record<string, ParcelUpdate>;
};

const emptyState: ShopperState = {
  cart: [],
  saved: [],
  measurements: null,
  following: [],
  lists: [],
  hiddenPosts: [],
  fewerMakingOf: [],
  addresses: [],
  orders: [],
  parcelUpdates: {},
};

type ShopperContextValue = ShopperState & {
  /** False until storage has been read, so nothing announces an empty cart early. */
  ready: boolean;
  cartCount: number;
  addToCart: (line: NewCartLine) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  /** Takes the line out of the cart and keeps the piece in saved. */
  saveForLater: (key: string) => void;
  isSaved: (productId: string) => boolean;
  toggleSaved: (productId: string) => void;
  saveMeasurements: (measurements: Measurements) => void;
  isFollowing: (creatorSlug: string) => boolean;
  toggleFollow: (creatorSlug: string) => void;
  /** Returns the new list's id. A piece passed in is saved and put in it. */
  createList: (name: string, shared: boolean, productId?: string) => string;
  renameList: (listId: string, name: string) => void;
  setListShared: (listId: string, shared: boolean) => void;
  /** Adds or removes a piece from a list, saving it if it was not already. */
  toggleInList: (listId: string, productId: string) => void;
  setPostHidden: (postId: string, hidden: boolean) => void;
  setFewerMakingOf: (creatorSlug: string, fewer: boolean) => void;
  /** Adds or replaces by id. Making one the default clears the others. */
  saveAddress: (address: Address) => void;
  /** Records the order and takes its lines out of the cart. */
  placeOrder: (order: PlacedOrder) => void;
  updateParcel: (orderId: string, creatorSlug: string, patch: ParcelUpdate) => void;
};

function toggled(items: string[], item: string, on?: boolean) {
  const has = items.includes(item);
  const want = on ?? !has;
  if (want === has) return items;
  return want ? [...items, item] : items.filter((value) => value !== item);
}

export const MAX_QTY = 10;

const ShopperContext = createContext<ShopperContextValue | null>(null);

function lineKey(line: NewCartLine) {
  return [
    line.productId,
    line.size ?? "",
    line.colour ?? "",
    line.measurements ? JSON.stringify(line.measurements) : "",
    line.note.trim(),
  ].join("|");
}

export function ShopperProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ShopperState>(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setState({ ...emptyState, ...JSON.parse(stored) });
    } catch {
      // Blocked or corrupt storage starts an empty cart.
    }
    setReady(true);
  }, []);

  // Written after every change once the stored copy has been read, so the
  // first empty render never overwrites what was there.
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Not persisting still keeps the cart for this visit.
    }
  }, [state, ready]);

  const addToCart = useCallback((line: NewCartLine) => {
    const key = lineKey(line);
    setState((current) => {
      const existing = current.cart.find((item) => item.key === key);
      const cart = existing
        ? current.cart.map((item) =>
            item.key === key
              ? { ...item, qty: Math.min(item.qty + 1, MAX_QTY) }
              : item,
          )
        : [...current.cart, { ...line, note: line.note.trim(), key, qty: 1 }];
      return { ...current, cart };
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setState((current) => ({
      ...current,
      cart:
        qty < 1
          ? current.cart.filter((item) => item.key !== key)
          : current.cart.map((item) =>
              item.key === key
                ? { ...item, qty: Math.min(qty, MAX_QTY) }
                : item,
            ),
    }));
  }, []);

  const removeLine = useCallback((key: string) => {
    setState((current) => ({
      ...current,
      cart: current.cart.filter((item) => item.key !== key),
    }));
  }, []);

  const saveForLater = useCallback((key: string) => {
    setState((current) => {
      const line = current.cart.find((item) => item.key === key);
      if (!line) return current;
      return {
        ...current,
        cart: current.cart.filter((item) => item.key !== key),
        saved: current.saved.includes(line.productId)
          ? current.saved
          : [...current.saved, line.productId],
      };
    });
  }, []);

  const toggleSaved = useCallback((productId: string) => {
    setState((current) => {
      const unsaving = current.saved.includes(productId);
      return {
        ...current,
        saved: toggled(current.saved, productId),
        lists: unsaving
          ? current.lists.map((list) => ({
              ...list,
              productIds: list.productIds.filter((id) => id !== productId),
            }))
          : current.lists,
      };
    });
  }, []);

  const saveMeasurements = useCallback((measurements: Measurements) => {
    setState((current) => ({ ...current, measurements }));
  }, []);

  const toggleFollow = useCallback((creatorSlug: string) => {
    setState((current) => ({
      ...current,
      following: toggled(current.following, creatorSlug),
    }));
  }, []);

  const createList = useCallback(
    (name: string, shared: boolean, productId?: string) => {
      const id = `list-${Date.now().toString(36)}`;
      setState((current) => ({
        ...current,
        saved: productId ? toggled(current.saved, productId, true) : current.saved,
        lists: [
          ...current.lists,
          { id, name: name.trim(), shared, productIds: productId ? [productId] : [] },
        ],
      }));
      return id;
    },
    [],
  );

  const renameList = useCallback((listId: string, name: string) => {
    setState((current) => ({
      ...current,
      lists: current.lists.map((list) =>
        list.id === listId ? { ...list, name: name.trim() } : list,
      ),
    }));
  }, []);

  const setListShared = useCallback((listId: string, shared: boolean) => {
    setState((current) => ({
      ...current,
      lists: current.lists.map((list) =>
        list.id === listId ? { ...list, shared } : list,
      ),
    }));
  }, []);

  const toggleInList = useCallback((listId: string, productId: string) => {
    setState((current) => ({
      ...current,
      saved: toggled(current.saved, productId, true),
      lists: current.lists.map((list) =>
        list.id === listId
          ? { ...list, productIds: toggled(list.productIds, productId) }
          : list,
      ),
    }));
  }, []);

  const setPostHidden = useCallback((postId: string, hidden: boolean) => {
    setState((current) => ({
      ...current,
      hiddenPosts: toggled(current.hiddenPosts, postId, hidden),
    }));
  }, []);

  const setFewerMakingOf = useCallback((creatorSlug: string, fewer: boolean) => {
    setState((current) => ({
      ...current,
      fewerMakingOf: toggled(current.fewerMakingOf, creatorSlug, fewer),
    }));
  }, []);

  const saveAddress = useCallback((address: Address) => {
    setState((current) => {
      const exists = current.addresses.some((item) => item.id === address.id);
      let addresses = exists
        ? current.addresses.map((item) => (item.id === address.id ? address : item))
        : [...current.addresses, address];
      if (address.isDefault) {
        addresses = addresses.map((item) =>
          item.id === address.id ? item : { ...item, isDefault: false },
        );
      }
      return { ...current, addresses };
    });
  }, []);

  const placeOrder = useCallback((order: PlacedOrder) => {
    const bought = new Set(order.lines.map((line) => line.key));
    setState((current) => ({
      ...current,
      orders: [order, ...current.orders],
      cart: current.cart.filter((line) => !bought.has(line.key)),
    }));
  }, []);

  const updateParcel = useCallback(
    (orderId: string, creatorSlug: string, patch: ParcelUpdate) => {
      const key = `${orderId}/${creatorSlug}`;
      setState((current) => ({
        ...current,
        parcelUpdates: {
          ...current.parcelUpdates,
          [key]: { ...current.parcelUpdates[key], ...patch },
        },
      }));
    },
    [],
  );

  const value = useMemo<ShopperContextValue>(
    () => ({
      ...state,
      ready,
      cartCount: state.cart.reduce((sum, line) => sum + line.qty, 0),
      addToCart,
      setQty,
      removeLine,
      saveForLater,
      isSaved: (productId) => state.saved.includes(productId),
      toggleSaved,
      saveMeasurements,
      isFollowing: (creatorSlug) => state.following.includes(creatorSlug),
      toggleFollow,
      createList,
      renameList,
      setListShared,
      toggleInList,
      setPostHidden,
      setFewerMakingOf,
      saveAddress,
      placeOrder,
      updateParcel,
    }),
    [
      state,
      ready,
      addToCart,
      setQty,
      removeLine,
      saveForLater,
      toggleSaved,
      saveMeasurements,
      toggleFollow,
      createList,
      renameList,
      setListShared,
      toggleInList,
      setPostHidden,
      setFewerMakingOf,
      saveAddress,
      placeOrder,
      updateParcel,
    ],
  );

  return (
    <ShopperContext.Provider value={value}>{children}</ShopperContext.Provider>
  );
}

export function useShopper() {
  const context = useContext(ShopperContext);
  if (!context) {
    throw new Error("useShopper must be used inside a ShopperProvider");
  }
  return context;
}
