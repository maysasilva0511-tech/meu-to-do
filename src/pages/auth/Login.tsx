"use client";

import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthButtons } from '@/components/auth/AuthButtons';

export const Login: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = React.useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand e Título */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meu To Do</h1>
          <p className="text-gray-600 text-lg">Organize suas tarefas com estilo</p>
        </div>
        
        {/* Formulário de Login */}
        {isLoginForm ? (
          <div className="space-y-8">
            <LoginForm 
              onSwitchToRegister={() => setIsLoginForm(false)}
              onLoginWithOAuth={(provider) => {
                console.log('Login com:', provider);
              }}
            />
            
            {/* Divisora */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">Ou continue com</span>
              </div>
            </div>
            
            {/* Botões de Login Social */}
            <AuthButtons 
              onLoginWithOAuth={(provider) => {
                console.log('Login com:', provider);
              }}
            />
            
            {/* Botão de Login com Supabase */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Simular login com Supabase
                  console.log('Login com Supabase');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Entrar com Supabase</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* TODO: Adicionar componente de cadastro */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar Conta</h2>
              <p className="text-gray-600 mb-6">Crie sua conta para começar a gerenciar suas tarefas</p>
              <button 
                onClick={() => setIsLoginForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Voltar para Login
              </button>
            </div>
          </div>
        )}
        
        {/* Rodapé */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© 2024 Meu To Do. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};