"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Task } from '@/types/app';

interface TaskItemProps {
  task: Task;
  onStatusChange: (status: 'pending' | 'in_progress' | 'completed') => void;
  onDelete: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onStatusChange, 
  onDelete,
  getStatusColor,
  getStatusText 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              <Badge className={getStatusColor(task.status)}>
                {getStatusText(task.status)}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {getPriorityText(task.priority)}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span className={isOverdue ? 'text-red-600' : ''}>
                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(task.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {task.status === 'completed' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange('pending')}
              >
                <Circle className="h-4 w-4 mr-1" />
                Reabrir
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange('completed')}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Concluir
              </Button>
            )}
            
            {task.status !== 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange('in_progress')}
              >
                Iniciar
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};