import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

const IS_DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";

const DEV_USER = {
  id: "dev-user",
  email: "dev@soluv.com",
  app_metadata: {},
  user_metadata: { full_name: "Dev User" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
} as unknown as User;

export function useAuth() {
  const [user, setUser] = useState<User | null>(IS_DEV_MODE ? DEV_USER : null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!IS_DEV_MODE);

  useEffect(() => {
    if (IS_DEV_MODE) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (IS_DEV_MODE) return;
    await supabase.auth.signOut();
  };

  return { user, session, loading, signOut, isDevMode: IS_DEV_MODE };
}
