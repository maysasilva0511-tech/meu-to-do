"use client";

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TaskList } from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/tasks';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { tasks, isLoading, error } = useTasks();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const navigate = useNavigate();
  
  // Converter tarefas para o formato correto
  const formattedTasks = tasks?.map(task => ({
    ...task,
    created_at: task.created_at,
    updatedAt: task.updated_at || task.created_at,
  })) || [];

  // Calcular estatísticas
  const stats = {
    total: formattedTasks.length,
    completed: formattedTasks.filter(t => t.is_completed).length,
    pending: formattedTasks.filter(t => !t.is_completed).length,
  };

  const handleCreateTask = (title: string) => {
    // Criar tarefa via hook
    // O hook já lida com o sucesso/erro e invalidação
  };

  const handleLogout = async () => {
    try {
      console.log('Dashboard: Starting logout...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Dashboard: Logout error:', error);
        return;
      }
      console.log('Dashboard: Logout successful, redirecting to /auth/login');
      navigate('/auth/login');
    } catch (err) {
      console.error('Dashboard: Unexpected error during logout:', err);
      navigate('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader 
        onCreateTask={() => setShowTaskModal(true)}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seção de Estatísticas */}
        <StatsCards stats={stats} />
        
        {/* Seção de Lista de Tarefas */}
        <div className="mb-8">
          <TaskList 
            onCreateTask={handleCreateTask}
          />
        </div>
        
        {/* Modal de criação de tarefas será adicionado em outro momento */}
        {/* Por enquanto, vamos criar a tarefa diretamente */}
        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Criar Nova Tarefa</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Digite o título da tarefa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      // Criar tarefa
                      supabase
                        .from('todos')
                        .insert([{
                          title: e.currentTarget.value.trim(),
                          user_id: 'mock-user-id', // Será obtido do usuário autenticado
                          is_completed: false,
                          created_at: new Date().toISOString()
                        }]);
                      setShowTaskModal(false);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
</dyad-summary>
Fixed the logout function in `Dashboard.tsx` to use async/await and ensure the redirect to `/auth/login` happens after successful signOut.
<dyad-write path="src/components/dashboard/DashboardHeader.tsx">
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Plus, User, LogOut, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onCreateTask: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onCreateTask, 
  onLogout }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Meu To Do</h1>
            <Badge variant="secondary" className="ml-3">Beta</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar tarefas..."
                className="pl-10 w-64"
              />
            </div>
            
            <Button onClick={onCreateTask} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nova Tarefa</span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};