"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TaskItem } from './TaskItem';
import { Task } from '@/types/app';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onTaskDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskDelete 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em Progresso';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

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
              <option value="in_progress">Em Progresso</option>
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
                onStatusChange={(status) => onTaskUpdate(task.id, { status })}
                onDelete={onTaskDelete}
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