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
import { Task } from "@/hooks/tasks";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onCreateTask?: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export const TaskList = ({
  tasks = [],
  onCreateTask,
  onStatusChange,
  onDelete,
  onEdit,
}: TaskListProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<
    "all" | "completed" | "pending" | "in_progress"
  >("all");

  const filteredTasks = React.useMemo(() => {
    return (tasks || []).filter((task) => {
      const matchesSearch = (task.title ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, filterStatus]);

  const pendingCount = (tasks || []).filter((task) => task.status === "pending").length;
  const inProgressCount = (tasks || []).filter((task) => task.status === "in_progress").length;
  const completedCount = (tasks || []).filter((task) => task.status === "completed").length;

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
              setFilterStatus(
                e.target.value as "all" | "completed" | "pending" | "in_progress",
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Todas ({tasks?.length || 0})</option>
            <option value="pending">Pendentes ({pendingCount})</option>
            <option value="in_progress">Em Progresso ({inProgressCount})</option>
            <option value="completed">Concluídas ({completedCount})</option>
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
                onStatusChange={(status) => onStatusChange(task.id, status)}
                onDelete={(id) => onDelete(id)}
                onEdit={(title) => onEdit(task.id, title)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};