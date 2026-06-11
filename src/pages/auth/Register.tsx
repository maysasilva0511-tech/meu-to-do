"use client";

import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthButtons } from '@/components/auth/AuthButtons';

export const Register: React.FC = () => {
  const [isRegisterForm, setIsRegisterForm] = React.useState(true);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {isRegisterForm ? (
          <div className="space-y-6">
            <RegisterForm 
              onSwitchToLogin={() => setIsRegisterForm(false)}
              onLoginWithOAuth={(provider) => {
                // TODO: Implementar login OAuth
                console.log('Login com:', provider);
              }}
            />
            <div className="pt-6">
              <AuthButtons 
                onLoginWithOAuth={(provider) => {
                  // TODO: Implementar login OAuth
                  console.log('Login com:', provider);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* TODO: Adicionar componente de login */}
            <div className="text-center">
              <p className="text-gray-600">Componente de login será implementado</p>
              <button 
                onClick={() => setIsRegisterForm(true)}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Voltar para cadastro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};