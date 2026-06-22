# Frontend Architecture - Meu To Do

## Estrutura de Componentes

### 1. Autenticação (`src/components/auth/`)
- `LoginForm.tsx` - Formulário de login com email/senha
- `RegisterForm.tsx` - Formulário de cadastro
- `SocialAuthButtons.tsx` - Botões de login OAuth
- `AuthLayout.tsx` - Layout genérico para páginas de autenticação

### 2. Tarefas (`src/components/tasks/`)
- `TaskList.tsx` - Lista de tarefas com filtros
- `TaskItem.tsx` - Item de tarefa individual
- `TaskForm.tsx` - Formulário de criação/edição
- `TaskFilters.tsx` - Componente de filtros integrado
- `TaskPriorityBadge.tsx` - Badge de prioridade
- `TaskStatusBadge.tsx` - Badge de status

### 3. Dashboard (`src/components/dashboard/`)
- `DashboardHeader.tsx` - Cabeçalho com título e ações
- `StatsCards.tsx` - Cards de estatísticas
- `TaskChart.tsx` - Gráfico de progresso
- `QuickActions.tsx` - Ações rápidas

### 4. Layout (`src/components/layout/`)
- `Sidebar.tsx` - Menu lateral (mobile-first)
- `Header.tsx` - Cabeçalho principal
- `Footer.tsx` - Rodapé
- `LoadingSpinner.tsx` - Indicador de carregamento

### 5. UI Components (`src/components/ui/`)
- Utilizar componentes shadcn/ui existentes
- Criar customizações conforme necessário

## Services Layer

### Supabase Service (`src/services/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### API Service (`src/services/api.ts`)
```typescript
import { supabase } from './supabase'

// Auth
export const authService = {
  signUp: (email: string, password: string) => supabase.auth.signUp({ email, password }),
  signIn: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getCurrentUser: () => supabase.auth.getUser()
}

// Tasks
export const taskService = {
  getTasks: () => supabase.from('tasks').select('*'),
  createTask: (task: any) => supabase.from('tasks').insert([task]),
  updateTask: (id: string, task: any) => supabase.from('tasks').update(task).eq('id', id),
  deleteTask: (id: string) => supabase.from('tasks').delete().eq('id', id)
}

// Categories
export const categoryService = {
  getCategories: () => supabase.from('categories').select('*'),
  createCategory: (category: any) => supabase.from('categories').insert([category]),
  updateCategory: (id: string, category: any) => supabase.from('categories').update(category).eq('id', id),
  deleteCategory: (id: string) => supabase.from('categories').delete().eq('id', id)
}
```

## Hooks Customizados

### Auth Hooks (`src/hooks/auth.ts`)
```typescript
export const useAuth = () => {
  const { data, error } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    }
  })
  
  return { user: data, error }
}
```

### Task Hooks (`src/hooks/tasks.ts`)
```typescript
export const useTasks = () => {
  const { data, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tasks').select('*')
      return data
    }
  })
  
  const createTask = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })
  
  return { tasks: data, error, createTask }
}
```

## Pages

### Auth Pages (`src/pages/auth/`)
- `Login.tsx` - Página de login
- `Register.tsx` - Página de cadastro
- `ForgotPassword.tsx` - Recuperação de senha

### Dashboard Page (`src/pages/Dashboard.tsx`)
- Dashboard principal com estatísticas
- Lista de tarefas recentes
- Gráficos de progresso

### Settings Page (`src/pages/Settings.tsx`)
- Configurações de perfil
- Preferências do app
- Gerenciamento de categorias

## Types

### Database Types (`src/types/database.ts`)
```typescript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          user_id: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          status: 'pending' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          due_date: string
          category_id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          status?: 'pending' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string
          category_id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
```

### App Types (`src/types/app.ts`)
```typescript
export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  category?: Category
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
}
```

## Estilo e Design

### Tema Global
- **Cores principais**: Azul primário (#3B82F6), cinza neutro
- **Tipografia**: Inter (Google Fonts)
- **Border radius**: 0.5rem (md)
- **Sombras**: Sistema de sombras consistente

### Componentes Styling
- **Mobile-first**: Design responsivo com breakpoints
- **Spacing**: Sistema de spacing baseado em 4px
- **Transitions**: Suaves para melhor UX

## Fluxo de Autenticação

1. **Usuário não autenticado**:
   - Redirecionado para página de login
   - Opção de cadastro ou login OAuth

2. **Login bem sucedido**:
   - Armazenar sessão no localStorage
   - Redirecionar para dashboard
   - Carregar dados do usuário

3. **Sessão ativa**:
   - Verificar periodicamente validade
   - Refresh token automático
   - Logout automático expirado

## Gerenciamento de Estado

- **React Query** para dados do servidor
- **React Context** para estado global (tema, notificações)
- **localStorage** para preferências locais