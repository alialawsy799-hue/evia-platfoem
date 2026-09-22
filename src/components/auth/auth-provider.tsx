"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginWithPassword, registerStudent } from "@/lib/auth/actions";
import type { Profile, UserRole } from "@/lib/types";

type AuthContextValue = {
  user: Profile | null;
  loading: boolean;
  signInDemo: (role: UserRole) => void;
  signInEmail: (email: string, password: string) => Promise<Profile>;
  signUpEmail: (email: string, password: string, fullName?: string) => Promise<Profile>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function withJoinedAt(profile: Profile): Profile {
  if (profile.joinedAt) return profile;
  return { ...profile, joinedAt: new Date().toISOString() };
}

function nextAfterLogin() {
  const path = window.location.pathname;
  if (path === "/" || path.startsWith("/auth")) return "/dashboard";
  return `${path}${window.location.search}`;
}

async function fetchSessionUser() {
  const response = await fetch("/api/auth/me", { credentials: "include" });
  if (!response.ok) return null;
  const data = (await response.json()) as { user: Profile | null };
  return data.user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      try {
        const next = await fetchSessionUser();
        if (!cancelled) setUser(next ? withJoinedAt(next) : null);
      } catch {
        if (!cancelled) setUser(null);
      }
    }

    void sync().finally(() => {
      if (!cancelled) setLoading(false);
    });

    const onFocus = () => {
      void sync();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const timer = window.setInterval(() => {
      void sync();
    }, 15000);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.clearInterval(timer);
    };
  }, []);

  const signInDemo = useCallback((_role: UserRole) => {
    /* Demo accounts are disabled so each email stays exclusive. */
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    const profile = withJoinedAt(await loginWithPassword(email, password));
    setUser(profile);
    return profile;
  }, []);

  const signUpEmail = useCallback(async (email: string, password: string, fullName?: string) => {
    const profile = withJoinedAt(await registerStudent(email, password, fullName));
    setUser(profile);
    return profile;
  }, []);

  const signInGoogle = useCallback(async () => {
    window.location.assign(`/auth/google?next=${encodeURIComponent(nextAfterLogin())}`);
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      /* cookie clear is best-effort */
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signInDemo, signInEmail, signUpEmail, signInGoogle, signOut }),
    [user, loading, signInDemo, signInEmail, signUpEmail, signInGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
