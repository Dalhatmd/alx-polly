'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

// Define auth context type with all necessary authentication state
const AuthContext = createContext<{ 
  session: Session | null;
  user: User | null;
  signOut: () => void;
  loading: boolean;
}>({ 
  session: null, 
  user: null,
  signOut: () => {},
  loading: true,
});

/**
 * Authentication provider component that manages user auth state
 * Wraps the app with authentication context for session management
 * @param children - Child components that need access to auth state
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    /**
     * Retrieves current user from Supabase auth session
     * Initializes auth state and handles authentication errors
     */
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        // Optionally, set an error state and show a user-friendly message
        setUser(null);
        setSession(null);
        setLoading(false);
        // Could show a toast or error UI here
      } else if (mounted) {
        setUser(data.user ?? null);
        setSession(null);
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Do not set loading to false here, only after initial load
      // No logging of sensitive data
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * Signs out the current user and clears authentication state
   * Calls Supabase auth signOut method to end user session
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // No logging of user/session data
  return (
    <AuthContext.Provider value={{ session, user, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication context in components
 * Provides session, user, signOut function, and loading state
 * @returns Auth context object with current authentication state
 */
export const useAuth = () => useContext(AuthContext);
