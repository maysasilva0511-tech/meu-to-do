"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Plus, User } from 'lucide-react';

interface DashboardHeaderProps {
  onCreateTask: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateTask }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
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
            
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};