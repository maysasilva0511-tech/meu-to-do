"use client";

import { AuthButtons } from '@/components/auth/AuthButtons';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuthActions } from '@/hooks/auth';
import { toast } from 'sonner';

export const Register = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <RegisterForm />
        <div className="pt-6">
          <AuthButtons onLoginWithOAuth={handleOAuth} />
        </div>
      </div>
    </div>
  );
};