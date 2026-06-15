import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ummevejrrrkeczyclqsu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbWV2ZWpycnJrZWN6eWNscXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDgwNzYsImV4cCI6MjA5NjU4NDA3Nn0.nzbgWQchOhEr7Z8rOTiDJcrmfR9q9tyoOLzjZwgEeC8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Todo {
  id: number;
  title: string | null;
  is_completed: boolean | null;
  user_id: string | null;
  created_at: string;
}

export interface TodoInsert {
  title: string;
  user_id: string;
  is_completed?: boolean;
}

export interface TodoUpdate {
  title?: string;
  is_completed?: boolean;
}

export const todoService = {
  list: (userId: string) =>
    supabase
      .from<Todo>('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),

  create: (todo: TodoInsert) =>
    supabase
      .from<Todo>('todos')
      .insert([todo])
      .select(),

  update: (id: number, updates: TodoUpdate) =>
    supabase
      .from<Todo>('todos')
      .update(updates)
      .eq('id', id)
      .select(),

  delete: (id: number) =>
    supabase
      .from<Todo>('todos')
      .delete()
      .eq('id', id),
};