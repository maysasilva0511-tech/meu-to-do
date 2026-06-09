"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TaskItem } from './TaskItem';
import { useTasks } from '@/hooks/tasks';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/lib/supabaseClient';

interface TaskListProps {
  onCreateTask: (title: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onCreateTask }) => {
  const { tasks, error, isLoading } = useTasks();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'completed' | 'pending'>('all');
  
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && task.is_completed) ||
      (filterStatus === 'pending' && !task.is_completed);
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted ? 
      'bg-green-100 text-green-800 border border-green-200' : 
      'bg-orange-100 text-orange-800 border border-orange-200';
  };

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? 'Concluída' : 'Pendente';
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando tarefas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <p>Erro ao carregar tarefas: {error.message}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">Minhas Tarefas</span>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 border border-gray-300 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídas</option>
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg mb-2">Nenhuma tarefa encontrada</div>
            <p className="text-sm">Crie sua primeira tarefa ou ajuste os filtros</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={(isCompleted) => {
                  // Atualizar status da tarefa
                  supabase
                    .from('todos')
                    .update({ is_completed: isCompleted })
                    .eq('id', task.id);
                }}
                onDelete={(id) => {
                  // Deletar tarefa
                  supabase
                    .from('todos')
                    .delete()
                    .eq('id', id);
                }}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};