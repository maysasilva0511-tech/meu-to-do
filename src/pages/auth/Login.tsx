"use client";

import { AuthButtons } from '@/components/auth/AuthButtons';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthActions } from '@/hooks/auth';
import { toast } from 'sonner';

export const Login = () => {
  const { loginWithOAuth } = useAuthActions();

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      await loginWithOAuth(provider);
      toast.info(`Redirecionando para ${provider === 'google' ? 'Google' : 'GitHub'}...`);
    } catch (error) {
      toast.error('Não foi possível iniciar o login social.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Meu To Do</h1>
          <p className="text-gray-300 text-lg">Organize suas tarefas com estilo</p>
        </div>

        <LoginForm />

        <div className="pt-6">
          <AuthButtons onLoginWithOAuth={handleOAuth} />
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© 2024 Meu To Do. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};