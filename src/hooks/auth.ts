import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Estado de autenticação global
let globalAuthState = {
  isAuthenticated: false,
  currentUser: null as any
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(globalAuthState.isAuthenticated);
  const [currentUser, setCurrentUser] = useState(globalAuthState.currentUser);
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    // Atualiza o estado local quando o global mudar
    if (data) {
      globalAuthState = {
        isAuthenticated: true,
        currentUser: data
      };
      setIsAuthenticated(true);
      setCurrentUser(data);
    }
  }, [data]);
  
  return { user: currentUser, isAuthenticated, error, isLoading }
}

export const useAuthActions = () => {
  const navigate = useNavigate()
  
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Login falhou: ' + error.message)
      throw error
    }
    toast.success('Login realizado com sucesso!')
    // Atualiza estado global imediatamente
    const { data: { user } } = await supabase.auth.getUser()
    globalAuthState = {
      isAuthenticated: true,
      currentUser: user
    }
    // Redireciona para a dashboard
    navigate('/')
  }
  
  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast.error('Cadastro falhou: ' + error.message)
      throw error
    }
    toast.success('Cadastro realizado! Verifique seu e-mail.')
    // Redireciona para a dashboard
    navigate('/')
  }
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Logout falhou: ' + error.message)
      throw error
    }
    toast.success('Logout realizado com sucesso!')
    // Limpa estado global
    globalAuthState = {
      isAuthenticated: false,
      currentUser: null
    }
    // Redireciona para a tela de login
    navigate('/auth/login')
  }
  
  const loginWithOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) {
      toast.error('Login falhou: ' + error.message)
      throw error
    }
  }
  
  return { login, signup, logout, loginWithOAuth }
}