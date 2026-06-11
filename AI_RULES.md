# AI_RULES.md - Meu To Do

## Visão Geral
"Meu To Do" é um aplicativo de gerenciamento de tarefas personalizável com autenticação nativa do Supabase. O aplicativo permite que os usuários criem, gerenciem e personalizem suas listas de tarefas com diferentes categorias, prioridades e status.

## Stack Tecnológica
- **Frontend**: React 19 com TypeScript
- **Backend**: Supabase (autenticação, banco de dados, storage)
- **UI**: Tailwind CSS + shadcn/ui
- **Gerenciamento de Estado**: React Query
- **Roteamento**: React Router
- **Banco de Dados**: PostgreSQL (via Supabase)

## Estrutura de Arquivos
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes shadcn/ui
│   ├── auth/           # Componentes de autenticação
│   ├── tasks/          # Componentes de tarefas
│   └── layout/         # Componentes de layout
├── pages/              # Páginas principais
│   ├── Auth/           # Páginas de autenticação
│   ├── Dashboard/      # Dashboard principal
│   └── Settings/       # Configurações
├── hooks/              # Custom hooks
├── services/           # Serviços (Supabase)
├── utils/              # Funções utilitárias
└── types/              # Tipos TypeScript
```

## Autenticação com Supabase
O aplicativo utiliza a autenticação nativa do Supabase:
- **Cadastro/login** com email/senha
- **Login com provedores OAuth** (Google, GitHub)
- **Gerenciamento de sessão**
- **Funções de usuário** (admin, user)

## Componentes Necessários
### Autenticação
- `LoginForm` - Formulário de login
- `RegisterForm` - Formulário de cadastro
- `AuthButtons` - Botões de login OAuth
- `ProtectedRoute` - Rota protegida

### Tarefas
- `TaskList` - Lista de tarefas
- `TaskItem` - Item individual de tarefa
- `TaskForm` - Formulário de criação/edição
- `CategoryFilter` - Filtro por categoria
- `PriorityFilter` - Filtro por prioridade
- `StatusFilter` - Filtro por status

### Dashboard
- `DashboardHeader` - Cabeçalho do dashboard
- `StatsCards` - Cards de estatísticas
- `TaskChart` - Gráfico de progresso
- `QuickActions` - Ações rápidas

## Estado e Dados
- **React Query** para gerenciamento de estado
- **Caching** de dados offline
- **Sincronização** em tempo real
- **Otimistic updates**

## Design System
- **Cores**: Primária azul, secundária cinza, alerta vermelho
- **Tipografia**: Inter para títulos, Roboto para corpo
- **Espaçamento**: Base 4px (padrão Tailwind)
- **Bordas**: Radius 8px (md)
- **Sombras**: Sistemas de sombras consistentes

## Rotas
- `/` - Dashboard (protegido)
- `/auth/login` - Login
- `/auth/register` - Cadastro
- `/settings` - Configurações (protegido)

## Variáveis de Ambiente
- `VITE_SUPABASE_URL` - URL do Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase