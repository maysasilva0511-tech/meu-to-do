import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key are embedded in the client
const SUPABASE_URL = "https://ummevejrrrkeczyclqsu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbWV2ZWpycnJrZWN6eWNscXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDgwNzYsImV4cCI6MjA5NjU4NDA3Nn0.nzbgWQchOhEr7Z8rOTiDJcrmfR9q9tyoOLzjZwgEeC8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Generic types for database tables
export type Todo = {
  id: number;
  title: string | null;
  is_completed: boolean | null;
  user_id: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
};

export type Task = {
  id: string;
  title: string | null;
  description?: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'deleted';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

// Services
export const taskService = {
  getTasks: () => supabase.from('tasks').select('*'),
  createTask: (task: any) => supabase.from('tasks').insert([task]),
  updateTask: (id: string, updates: any) => supabase.from('tasks').update(updates).eq('id', id),
  deleteTask: (id: string) => supabase.from('tasks').delete().eq('id', id),
  updateTaskStatus: (id: string, status: any) => supabase.from('tasks').update({ status }).eq('id', id),
};

export const categoryService = {
  getCategories: () => supabase.from('categories').select('*'),
  createCategory: (category: any) => supabase.from('categories').insert([category]),
  updateCategory: (id: string, category: any) => supabase.from('categories').update(category).eq('id', id),
  deleteCategory: (id: string) => supabase.from('categories').delete().eq('id', id),
};

export const todoService = {
  list: (userId: string) =>
    supabase.from('todos').select('*').eq('user_id', userId),
  create: (todo: any) => supabase.from('todos').insert([todo]),
  update: (id: number, updates: any) => supabase.from('todos').update(updates).eq('id', id),
  delete: (id: number) => supabase.from('todos').delete().eq('id', id),
};