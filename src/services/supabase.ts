// Serviço Supabase Mockado - Para desenvolvimento sem SDK real
// Isso permite testar a UI e fluxo de autenticação sem configuração do Supabase

// Estado de autenticação global (simula o estado do Supabase)
let authState = {
  isAuthenticated: false,
  currentUser: null as any,
  session: null as any
};

// Função para atualizar o estado de autenticação global
const updateAuthState = (newState: typeof authState) => {
  authState = newState;
  // Dispara evento para atualizar componentes que escutam mudanças
  window.dispatchEvent(new CustomEvent('authStateChange', { detail: authState }));
};

// Simula o estado de autenticação
const mockAuth = {
  // Função para simular login bem sucedido
  login: (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newState = {
          isAuthenticated: true,
          currentUser: {
            id: 'mock-user-id',
            email: email,
            full_name: 'Usuário Mock',
            avatar_url: null
          },
          session: {
            access_token: 'mock-token',
            expires_in: 3600
          }
        };
        updateAuthState(newState);
        resolve({ data: { user: newState.currentUser }, error: null });
      }, 1000); // Simula delay de rede
    });
  },

  // Função para simular logout
  logout: () => {
    const newState = {
      isAuthenticated: false,
      currentUser: null,
      session: null
    };
    updateAuthState(newState);
    return Promise.resolve({ error: null });
  },

  // Função para simular cadastro
  signup: (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newState = {
          isAuthenticated: true,
          currentUser: {
            id: 'mock-user-id',
            email: email,
            full_name: 'Usuário Mock',
            avatar_url: null
          },
          session: {
            access_token: 'mock-token',
            expires_in: 3600
          }
        };
        updateAuthState(newState);
        resolve({ data: { user: newState.currentUser }, error: null });
      }, 1000); // Simula delay de rede
    });
  },

  // Função para simular login OAuth
  signInWithOAuth: (provider: 'google' | 'github') => {
    console.log(`Simulando login com ${provider}`);
    // Em um ambiente real, isso redirecionaria para o provedor OAuth
    return Promise.resolve({ error: null });
  },

  // Função para obter usuário atual
  getCurrentUser: () => {
    return Promise.resolve({ data: { user: authState.currentUser }, error: null });
  },

  // Função para simular mudança de estado de autenticação
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // Adiciona listener para mudanças de estado
    const handleAuthStateChange = (event: CustomEvent) => {
      callback('SIGNED_IN', event.detail.session);
    };
    
    window.addEventListener('authStateChange', handleAuthStateChange);
    
    return { data: { subscription: { unsubscribe: () => window.removeEventListener('authStateChange', handleAuthStateChange) } } };
  },

  // Função para obter estado atual (para fins de desenvolvimento)
  getAuthState: () => authState
};

// Interface compatível com o SDK real, mas usando as funções mockadas
export const supabase = {
  auth: {
    signUp: (params: any) => mockAuth.signup(params.email, params.password),
    signInWithPassword: (params: any) => mockAuth.login(params.email, params.password),
    signOut: () => mockAuth.logout(),
    signInWithOAuth: (params: any) => mockAuth.signInWithOAuth(params.provider),
    getUser: () => mockAuth.getCurrentUser(),
    onAuthStateChange: (callback: any) => mockAuth.onAuthStateChange(callback)
  }
};

// Exporta as funções mockadas para uso direto quando necessário
export { mockAuth, updateAuthState };