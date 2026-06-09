// Serviço Supabase Mockado - Para desenvolvimento sem SDK real
// Isso permite testar a UI e fluxo de autenticação sem configuração do Supabase

// Estado de autenticação local (simula o estado do Supabase)
let authState = {
  isAuthenticated: false,
  currentUser: null as any,
  session: null as any
};

// Simula o estado de autenticação
const mockAuth = {
  // Função para simular login bem sucedido
  login: (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        authState = {
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
        resolve({ data: { user: authState.currentUser }, error: null });
      }, 1000); // Simula delay de rede
    });
  },

  // Função para simular logout
  logout: () => {
    authState = {
      isAuthenticated: false,
      currentUser: null,
      session: null
    };
    return Promise.resolve({ error: null });
  },

  // Função para simular cadastro
  signup: (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        authState = {
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
        resolve({ data: { user: authState.currentUser }, error: null });
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
    // Simula escuta de mudanças de autenticação
    return { data: { subscription: { unsubscribe: () => {} } } };
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
export { mockAuth };