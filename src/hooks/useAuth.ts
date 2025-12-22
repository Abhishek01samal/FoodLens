import { useEffect, useMemo, useCallback, useState } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AppUser {
  name: string;
  email: string;
  initials: string;
  avatar?: string;
}

const SESSION_RELOAD_KEY = "foodlens_postlogin_reload";
const SESSION_RELOAD_DONE_KEY = "foodlens_postlogin_reload_done";

function toAppUser(user: SupabaseUser): AppUser {
  const email = user.email ?? "";
  const meta = (user.user_metadata ?? {}) as Record<string, any>;
  const nameRaw = (meta.full_name || meta.name || email.split("@")[0] || "User") as string;
  const name = nameRaw ? nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1) : "User";
  const initials = (name.replace(/\s+/g, "").slice(0, 2) || "U").toUpperCase();
  const avatar = (meta.avatar_url || meta.picture) as string | undefined;

  return { name, email, initials, avatar };
}

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ? toAppUser(nextSession.user) : null);
      setIsLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session: existingSession } }) => {
        setSession(existingSession);
        setUser(existingSession?.user ? toAppUser(existingSession.user) : null);
      })
      .finally(() => setIsLoading(false));

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!email || !password) return { success: false, error: "Please enter email and password" };

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      // Force a single refresh after login (requested)
      sessionStorage.setItem(SESSION_RELOAD_KEY, "1");
      sessionStorage.removeItem(SESSION_RELOAD_DONE_KEY);

      return { success: true };
    },
    [],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!email || !password) return { success: false, error: "Please enter email and password" };
      if (password.length < 6) return { success: false, error: "Password must be at least 6 characters" };

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (error) return { success: false, error: error.message };
      return { success: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    sessionStorage.removeItem(SESSION_RELOAD_KEY);
    sessionStorage.removeItem(SESSION_RELOAD_DONE_KEY);
    await supabase.auth.signOut();
  }, []);

  const isLoggedIn = useMemo(() => !!session?.user, [session]);

  return {
    user,
    session,
    isLoggedIn,
    isLoading,
    login,
    signUp,
    logout,
  };
};
