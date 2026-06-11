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
  onLogout?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onCreateTask, 
  onLogout 
}) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    console.log('Logout button clicked, onLogout prop:', typeof onLogout);
    
    // Se onLogout foi passado pelo pai, usa ele
    if (onLogout) {
      try {
        console.log('Calling parent onLogout...');
        await onLogout();
        console.log('Parent onLogout completed');
        navigate('/');
      } catch (error) {
        console.error('Error in parent onLogout:', error);
        // Fallback
        try {
          await supabase.auth.signOut();
          navigate('/auth/login');
        } catch (fallbackError) {
          console.error('Fallback logout error:', fallbackError);
        }
      }
      return;
    }
    
    // Fallback: lógica local caso não tenha prop
    try {
      console.log('Using fallback logout...');
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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