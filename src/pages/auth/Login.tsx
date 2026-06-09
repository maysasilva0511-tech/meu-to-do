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