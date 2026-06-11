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
    console.log('Forçando logout pelo Supabase...');
    try {
      await supabase.auth.signOut();
      console.log('Logout concluído com sucesso!');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    } finally {
      navigate('/');
    }
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar tarefas..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      
      <Button size="sm" onClick={onCreateTask} className="gap-1">
        <Plus className="h-4 w-4" />
        <span>Nova Tarefa</span>
      </Button>

      <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Notificações</span>
      </Button>
      
      <Button variant="outline" size="icon" className="h-8 w-8">
        <User className="h-4 w-4" />
        <span className="sr-only">Perfil</span>
      </Button>

      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleLogout} title="Sair">
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Sair</span>
      </Button>
    </header>
  );
};