"use client";

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TaskChart } from '@/components/dashboard/TaskChart';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';
import { useTasks } from '@/hooks/tasks';
import { useCategories } from '@/hooks/categories';
import { Task } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { categories } = useCategories();
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Converter tarefas para o formato correto
  const formattedTasks = tasks?.map(task => ({
    ...task,
    dueDate: task.due_date ? new Date(task.due_date) : undefined,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
    category: categories?.find(cat => cat.id === task.category_id)
  })) || [];

  // Calcular estatísticas
  const stats = {
    total: formattedTasks.length,
    completed: formattedTasks.filter(t => t.status === 'completed').length,
    pending: formattedTasks.filter(t => t.status === 'pending').length,
    inProgress: formattedTasks.filter(t => t.status === 'in_progress').length,
  };

  // Dados para o gráfico
  const chartData = [
    { name: 'Concluídas', value: stats.completed, color: '#10B981' },
    { name: 'Em Progresso', value: stats.inProgress, color: '#3B82F6' },
    { name: 'Pendentes', value: stats.pending, color: '#F59E0B' },
  ];

  const handleCreateTask = async (taskData: any) => {
    await createTask.mutateAsync({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: 'pending',
      due_date: taskData.dueDate,
      category_id: taskData.categoryId,
      user_id: 'mock-user-id', // Obter do usuário autenticado
    });
  };

  const handleTaskUpdate = (id: string, updates: Partial<Task>) => {
    updateTask.mutateAsync({ id, ...updates });
  };

  const handleTaskDelete = (id: string) => {
    deleteTask.mutateAsync(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader 
        onCreateTask={() => setShowTaskModal(true)}
        onLogout={() => { console.log('Logout será implementado'); }}
      />
      
      {/* Botão de teste de login */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/auth/login'}
            className="flex items-center space-x-2 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            <span>Testar Tela de Login</span>
          </Button>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seção de Estatísticas */}
        <StatsCards stats={stats} />
        
        {/* Seção de Gráfico e Lista de Tarefas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TaskChart data={chartData} />
          <div className="lg:col-span-2">
            <TaskList
              tasks={formattedTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          </div>
        </div>
        
        {/* Botão flutuante para criar tarefa */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Nova Tarefa</span>
          </button>
        </div>
      </main>

      {/* Modal de criação de tarefas */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleCreateTask}
        categories={categories || []}
      />
    </div>
  );
};