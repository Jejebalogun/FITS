"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { findAccount } from "@/data/accounts";

const STORAGE_KEY = "fits.session";

export type SessionUser = {
  email: string;
  /** Creator is a privilege on the same account, never a second account. */
  isCreator: boolean;
};

type SessionContextValue = {
  user: SessionUser | null;
  /**
   * False until the stored session has been read. The server cannot know who is
   * signed in, so the first paint is always signed-out; components use this to
   * avoid announcing that as fact.
   */
  ready: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored) as SessionUser);
    } catch {
      // Blocked or corrupt storage just means signed out.
    }
    setReady(true);
  }, []);

  const signIn = useCallback((email: string) => {
    const normalised = email.trim().toLowerCase();
    const next: SessionUser = {
      email: normalised,
      isCreator: findAccount(normalised)?.isCreator ?? false,
    };
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Not persisting still leaves them signed in for this visit.
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clean up.
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signOut }),
    [user, ready, signIn, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside a SessionProvider");
  }
  return context;
}
