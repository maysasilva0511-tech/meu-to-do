import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ummevejrrrkeczyclqsu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbWV2ZWpycnJrZWN6eWNscXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDgwNzYsImV4cCI6MjA5NjU4NDA3Nn0.nzbgWQchOhEr7Z8rOTiDJcrmfR9q9tyoOLzjZwgEeC8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funções de autenticação
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signInWithOAuth: async (provider: 'google' | 'github') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};