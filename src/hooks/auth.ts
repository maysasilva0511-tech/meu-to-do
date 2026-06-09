import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { toast } from 'sonner'
import { useRouter } from 'react-router-dom'

export const useAuth = () => {
  const router = useRouter()
  const { data, error, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  return { user: data, error, isLoading }
}

export const useAuthActions = () => {
  const router = useRouter()
  
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Login falhou: ' + error.message)
      throw error
    }
    toast.success('Login realizado com sucesso!')
    // Redireciona para a dashboard após login
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }
  
  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast.error('Cadastro falhou: ' + error.message)
      throw error
    }
    toast.success('Cadastro realizado! Verifique seu e-mail.')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Logout falhou: ' + error.message)
      throw error
    }
    toast.success('Logout realizado com sucesso!')
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
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