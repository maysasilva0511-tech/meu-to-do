# Backend Architecture - Meu To Do

## Supabase Setup

### Database Schema
```sql
-- Tabela de tarefas (renomeada de todos para tasks)
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);
```

### Authentication Setup
- Email/password authentication
- Session management with Supabase
- Protected routes for authenticated users

### Storage Setup
- Avatar storage bucket (optional)

### Realtime Setup
- Enable Realtime for tasks table for live updates
</dyad-file>
<dyad-write path="docs/frontend.md">
# Frontend Architecture - Meu To Do

## Estrutura de Componentes

### 1. Autenticação (`src/components/auth/`)
- `LoginForm.tsx` - Formulário de login com email/senha
- `RegisterForm.tsx` - Formulário de cadastro
- `AuthLayout.tsx` - Layout para páginas de autenticação

### 2. Tarefas (`src/components/tasks/`)
- `TaskList.tsx` - Lista de tarefas com filtros
- `TaskItem.tsx` - Item individual de tarefa
- `TaskForm.tsx` - Formulário de criação/edição

### 3. Dashboard (`src/components/dashboard/`)
- `DashboardHeader.tsx` - Cabeçalho com busca e ações
- `StatsCards.tsx` - Cards de estatísticas

### 4. Layout (`src/components/layout/`)
- `Sidebar.tsx` - Menu lateral
- `Header.tsx` - Cabeçalho principal

## Services Layer

### Supabase Service (`src/services/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Hooks Customizados

### Auth Hooks (`src/hooks/auth.ts`)
```typescript
export const useAuth = () => {
  // Retorna usuário autenticado e status de loading
}

export const useAuthActions = () => {
  // Funções: login, signup, logout, loginWithOAuth
}
```

### Task Hooks (`src/hooks/tasks.ts`)
```typescript
export const useTasks = () => {
  // Retorna tarefas do usuário logado
  // Funções: createTask, updateTask, deleteTask
}
```

## Pages

### Auth Pages (`src/pages/auth/`)
- `Login.tsx` - Página de login
- `Register.tsx` - Página de cadastro

### Dashboard Page (`src/pages/Dashboard.tsx`)
- Dashboard principal com estatísticas
- Lista de tarefas recentes

## Types

### Database Types (`src/types/database.ts`)
```typescript
export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  user_id: string
  created_at: string
  updated_at: string
}
```
</dyad-file>
</tool_call>
<think>
Now let me update the services and hooks to work with the real Supabase client and the tasks table.
</think>
## Step 2: Update Services and Hooks
<dyad-write path="src/services/supabase.ts">
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ummevejrrrkeczyclqsu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbWV2ZWpycnJrZWN6eWNscXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDgwNzYsImV4cCI6MjA5NjU4NDA3Nn0.nzbgWQchOhEr7Z8rOTiDJcrmfR9q9tyoOLzjZwgEeC8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos para as tarefas
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Serviços de autenticação
export const authService = {
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

// Serviços de tarefas
export const taskService = {
  getTasks: async (userId: string) => {
    const { data, error } = await supabase
      .from<Task>('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createTask: async (task: { title: string; description?: string; priority?: string; user_id: string }) => {
    const { data, error } = await supabase
      .from<Task>('tasks')
      .insert([task])
      .select();
    return { data, error };
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from<Task>('tasks')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  deleteTask: async (id: string) => {
    const { error } = await supabase
      .from<Task>('tasks')
      .delete()
      .eq('id', id);
    return { error };
  }
};