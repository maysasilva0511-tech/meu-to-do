import { supabase } from './supabase'

// Auth
export const authService = {
  signUp: (email: string, password: string) => 
    supabase.auth.signUp({ email, password }),
    
  signIn: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),
    
  signInWithOAuth: (provider: 'google' | 'github') => 
    supabase.auth.signInWithOAuth({ provider }),
    
  signOut: () => 
    supabase.auth.signOut(),
    
  getCurrentUser: () => 
    supabase.auth.getUser(),
    
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback)
}

// Tasks
export const taskService = {
  getTasks: () => 
    supabase.from('tasks').select('*'),
    
  createTask: (task: any) => 
    supabase.from('tasks').insert([task]),
    
  updateTask: (id: string, task: any) => 
    supabase.from('tasks').update(task).eq('id', id),
    
  deleteTask: (id: string) => 
    supabase.from('tasks').delete().eq('id', id),
    
  updateTaskStatus: (id: string, status: any) => 
    supabase.from('tasks').update({ status }).eq('id', id)
}

// Categories
export const categoryService = {
  getCategories: () => 
    supabase.from('categories').select('*'),
    
  createCategory: (category: any) => 
    supabase.from('categories').insert([category]),
    
  updateCategory: (id: string, category: any) => 
    supabase.from('categories').update(category).eq('id', id),
    
  deleteCategory: (id: string) => 
    supabase.from('categories').delete().eq('id', id)
}