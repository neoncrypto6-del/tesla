import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

export type CustomerProfile = {
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  state: string;
  zipcode: string;
};

export type SignUpInput = CustomerProfile & {password: string;};

type AuthContextValue = {
  user: User | null;
  profile: CustomerProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: SignUpInput) => Promise<{needsConfirmation: boolean;user: User | null;}>;
  signOut: () => Promise<void>;
  verifyAdmin: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (current: User | null) => {
    if (!current) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.
    from('customers').
    select('full_name, email, phone, delivery_address, state, zipcode').
    eq('id', current.id).
    maybeSingle();
    if (data) {
      setProfile(data as CustomerProfile);
    } else {
      const meta = current.user_metadata ?? {};
      setProfile({
        full_name: meta.full_name ?? '',
        email: current.email ?? '',
        phone: meta.phone ?? '',
        delivery_address: meta.delivery_address ?? '',
        state: meta.state ?? '',
        zipcode: meta.zipcode ?? ''
      });
    }
  }, []);

  const loadAdmin = useCallback(async (current: User | null) => {
    if (!current) {
      setIsAdmin(false);
      return false;
    }
    const { data } = await supabase.rpc('is_admin');
    const value = data === true;
    setIsAdmin(value);
    return value;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const current = data.session?.user ?? null;
      setUser(current);
      Promise.all([loadProfile(current), loadAdmin(current)]).finally(() => setLoading(false));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const current = session?.user ?? null;
      setUser(current);
      // Defer Supabase calls to avoid blocking the auth callback
      setTimeout(() => {
        loadProfile(current);
        loadAdmin(current);
      }, 0);
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile, loadAdmin]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  };

  const signUp = async ({ password, ...details }: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: details.email,
      password,
      options: {
        data: {
          full_name: details.full_name,
          phone: details.phone,
          delivery_address: details.delivery_address,
          state: details.state,
          zipcode: details.zipcode
        }
      }
    });
    if (error) throw error;
    return { needsConfirmation: !data.session, user: data.user };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const verifyAdmin = async () => {
    const { data } = await supabase.auth.getUser();
    return loadAdmin(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, signIn, signUp, signOut, verifyAdmin }}>
      {children}
    </AuthContext.Provider>);

}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}