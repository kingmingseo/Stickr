import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(initialSession);

      const { data } = supabase.auth.onAuthStateChange((_e, next) => {
        if (!isMounted) return;
        setSession(next);
      });
      unsubscribe = data.subscription.unsubscribe;
    })();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return {
    session,
    user: (session?.user as User) ?? null,
    isAuthenticated: !!session,
  };
}

export default useSupabaseSession;
