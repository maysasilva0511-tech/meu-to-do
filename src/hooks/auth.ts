import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Estado global de autenticação
let globalAuthState = {
  isAuthenticated: false,
  currentUser: null as any
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(globalAuthState.isAuthenticated);
  const [currentUser, setCurrentUser] = useState(globalAuthState.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        globalAuthState = {
          isAuthenticated: true,
          currentUser: user
        };
        setIsAuthenticated(true);
        setCurrentUser(user);
      } else {
        globalAuthState = {
          isAuthenticated: false,
          currentUser: null
        };
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setIsLoading(false);
    };

    checkSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        globalAuthState = {
          isAuthenticated: true,
          currentUser: session?.user ?? null
        };
        setIsAuthenticated(true);
        setCurrentUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        globalAuthState = {
          isAuthenticated: false,
          currentUser: null
        };
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { 
    user: currentUser, 
    isAuthenticated, 
    isLoading,
    refetch: () => window.location.reload()
  };
};

export const useAuthActions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error('Login falhou: ' + error.message);
      throw error;
    }
    toast.success('Login realizado com sucesso!');
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    navigate('/');
  };

  const signup = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error('Cadastro falhou: ' + error.message);
      throw error;
    }
    toast.success('Cadastro realizado! Verifique seu e-mail.');
    navigate('/auth/login');
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout falhou: ' + error.message);
      throw error;
    }
    toast.success('Logout realizado com sucesso!');
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    navigate('/auth/login');
  };

  const loginWithOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      toast.error('Login falhou: ' + error.message);
      throw error;
    }
  };

  return { login, signup, logout, loginWithOAuth };
};