"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Task } from "@/services/supabase";
import { useTasks } from "@/hooks/tasks";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks?: Task[];
  onCreateTask?: () => void;
}

export const TaskList = ({ tasks, onCreateTask }: TaskListProps) => {
  const {
    tasks: fetchedTasks = [],
    error,
    isLoading,
    updateTaskStatus,
    deleteTask,
  } = useTasks();

  const displayedTasks = tasks ?? fetchedTasks;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<
    "all" | "completed" | "pending"
  >("all");

  const filteredTasks = React.useMemo(() => {
    return displayedTasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && task.is_completed) ||
        (filterStatus === "pending" && !task.is_completed);

      return matchesSearch && matchesStatus;
    });
  }, [displayedTasks, searchTerm, filterStatus]);

  const pendingCount = displayedTasks.filter((t) => !t.is_completed).length;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="flex min-h-[240px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Carregando suas tarefas...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="flex min-h-[240px] items-center justify-center">
          <div className="max-w-md text-center">
            <p className="text-sm font-medium text-destructive">
              Não foi possível carregar suas tarefas.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="space-y-4 pb-4">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Suas tarefas
          </CardTitle>
          <CardDescription className="mt-1">
            Apenas tarefas vinculadas ao seu usuário são exibidas.
          </CardDescription>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "completed" | "pending")
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Todas</option>
            <option value="pending">Pendentes ({pendingCount})</option>
            <option value="completed">Concluídas</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed bg-slate-50 p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Nenhuma tarefa encontrada
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Crie sua primeira tarefa ou ajuste os filtros de busca.
            </p>
            {onCreateTask && (
              <Button className="mt-5" onClick={onCreateTask}>
                Criar tarefa
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={(isCompleted) =>
                  updateTaskStatus.mutate({ id: task.id, isCompleted })
                }
                onDelete={(id) => deleteTask.mutate(id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};