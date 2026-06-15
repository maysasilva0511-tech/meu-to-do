"use client";

import { Button } from "@/components/ui/button";
import { Bell, LogOut, Plus, User } from "lucide-react";

interface DashboardHeaderProps {
  onCreateTask: () => void;
  onLogout?: () => void;
}

export const DashboardHeader = ({
  onCreateTask,
  onLogout,
}: DashboardHeaderProps) => {
  return (
    <header className="flex h-14 items-center gap-3 border-b bg-white/80 px-4 sm:px-6 lg:h-[60px]">
      <div className="hidden sm:block">
        <p className="text-sm font-semibold text-muted-foreground">
          Meu To Do
        </p>
      </div>

      <Button size="sm" onClick={onCreateTask} className="ml-auto gap-1">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Nova Tarefa</span>
      </Button>

      <Button variant="outline" size="icon" className="h-8 w-8">
        <Bell className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" className="h-8 w-8">
        <User className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onLogout}
        title="Sair"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
};