'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { mapSupabaseError } from '@/lib/supabase/errors';

export interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  const [supabase] = useState(() => {
    if (typeof window !== 'undefined') {
      return createClient();
    }
    return null;
  });

  // Check initial session on mount
  useEffect(() => {
    if (!supabase) return;
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setState(prev => ({ ...prev, user: session?.user ?? null }));
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({ ...prev, user: session?.user ?? null }));
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = useCallback(async (email: string, password: string) => {
    if (!supabase) return false;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState(prev => ({ ...prev, isLoading: false, error: mapSupabaseError(error.message) }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: false, user: data.user }));
    return true;
  }, [supabase]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    if (!supabase) return false;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setState(prev => ({ ...prev, isLoading: false, error: mapSupabaseError(error.message) }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: false, user: data.user }));
    return true;
  }, [supabase]);

  const logout = useCallback(async () => {
    if (!supabase) return false;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      setState(prev => ({ ...prev, isLoading: false, error: mapSupabaseError(error.message) }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: false, user: null }));
    router.push('/login');
    return true;
  }, [supabase, router]);

  const checkEmailVerification = useCallback(async () => {
    if (!supabase) return false;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return false;
    }

    if (!session?.user) {
      setState(prev => ({ ...prev, isLoading: false, error: 'No session found' }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: false, user: session.user }));
    return true;
  }, [supabase]);

  const verifyEmail = useCallback(async (token_hash: string) => {
    if (!supabase) return false;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // verifyOtp verifica el email y automáticamente crea sesión (login)
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'email',
    });

    if (error) {
      setState(prev => ({ ...prev, isLoading: false, error: mapSupabaseError(error.message) }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: false }));
    return true;
  }, [supabase]);

  return {
    ...state,
    login,
    register,
    logout,
    checkEmailVerification,
    verifyEmail,
  };
}
