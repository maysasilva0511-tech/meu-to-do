"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TaskChart } from '@/components/dashboard/TaskChart';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTasks } from '@/hooks/tasks';
import { useCategories } from '@/hooks/categories';
import { Task } from '@/types/app';

export const Dashboard: React.FC = () => {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { categories } = useCategories();
  const [showTaskForm, setShowTaskForm] = useState(false);
  
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
      user_id: 'current-user-id', // TODO: Obter do usuário autenticado
    });
    setShowTaskForm(false);
  };

  const handleTaskUpdate = (id: string, updates: Partial<Task>) => {
    updateTask.mutateAsync({ id, ...updates });
  };

  const handleTaskDelete = (id: string) => {
    deleteTask.mutateAsync(id);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader onCreateTask={() => setShowTaskForm(true)} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showTaskForm ? (
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowTaskForm(false)}
              categories={categories || []}
            />
          ) : (
            <>
              <StatsCards stats={stats} />
              
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
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};