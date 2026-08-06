"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = { name: string; role: "admin" | "customer" } | null;

type AuthContextType = {
  loading: boolean;
  loggedIn: boolean;
  email: string | null;
  profile: Profile;
};

const AuthContext = createContext<AuthContextType>({
  loading: true,
  loggedIn: false,
  email: null,
  profile: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthContextType>({
    loading: true,
    loggedIn: false,
    email: null,
    profile: null,
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(userId: string, email: string | null, metaName?: string) {
      const { data } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", userId)
        .maybeSingle();
      const fallbackName = metaName || email?.split("@")[0] || "";
      setState({
        loading: false,
        loggedIn: true,
        email,
        profile: { name: data?.name || fallbackName, role: data?.role || "customer" },
      });
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) loadProfile(user.id, user.email || null, user.user_metadata?.name);
      else setState({ loading: false, loggedIn: false, email: null, profile: null });
    });

    // Fires instantly on login, logout, sign-up, or token refresh — anywhere in the app,
    // including other tabs — so the header never shows a stale logged-out state.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email || null, session.user.user_metadata?.name);
      } else {
        setState({ loading: false, loggedIn: false, email: null, profile: null });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
