"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    is_completed: boolean;
    created_at: string;
  };
  onStatusChange: (isCompleted: boolean) => void;
  onDelete: (id: string) => void;
  getStatusColor: (isCompleted: boolean) => string;
  getStatusText: (isCompleted: boolean) => string;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onStatusChange, 
  onDelete,
  getStatusColor,
  getStatusText 
}) => {
  const isOverdue = false; // A tabela `todos` não tem data de vencimento

  return (
    <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              <Badge className={getStatusColor(task.is_completed)}>
                {getStatusText(task.is_completed)}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {task.created_at && (
                <div className="flex items-center space-x-1">
                  <span>Criado em: {new Date(task.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {task.is_completed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(false)}
              >
                <Circle className="h-4 w-4 mr-1" />
                Reabrir
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(true)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Concluir
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