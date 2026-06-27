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
import { RotateCcw, Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onCreateTask?: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onRestore: (id: string) => void;
}

export const TaskList = ({
  tasks = [],
  onCreateTask,
  onStatusChange,
  onDelete,
  onEdit,
  onRestore,
}: TaskListProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<
    "all" | "completed" | "pending" | "in_progress"
  >("all");
  const [showDeleted, setShowDeleted] = React.useState(false);

  const activeTasks = React.useMemo(() => {
    return (tasks || []).filter((task) => task.status !== "deleted");
  }, [tasks]);

  const deletedTasks = React.useMemo(() => {
    return (tasks || []).filter((task) => task.status === "deleted");
  }, [tasks]);

  const filteredActiveTasks = React.useMemo(() => {
    return activeTasks.filter((task) => {
      const matchesSearch = (task.title ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [activeTasks, searchTerm, filterStatus]);

  const pendingCount = activeTasks.filter((task) => task.status === "pending").length;
  const inProgressCount = activeTasks.filter((task) => task.status === "in_progress").length;
  const completedCount = activeTasks.filter((task) => task.status === "completed").length;

  return (
    <div className="space-y-8">
      {/* Active Tasks Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                Tarefas Ativas
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full">
                  {activeTasks.length}
                </span>
              </CardTitle>
              <CardDescription className="mt-1">
                Apenas tarefas vinculadas ao seu usuário são exibidas.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleted(!showDeleted)}
              className="gap-1"
            >
              {showDeleted ? "Ocultar Lixeira" : "Ver Lixeira"}
              <RotateCcw className="h-4 w-4" />
            </Button>
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
              <option value="all">Todas ({activeTasks.length})</option>
              <option value="pending">Pendentes ({pendingCount})</option>
              <option value="in_progress">Em Progresso ({inProgressCount})</option>
              <option value="completed">Concluídas ({completedCount})</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredActiveTasks.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed bg-slate-50 p-8 text-center dark:bg-gray-800">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
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
              {filteredActiveTasks.map((task) => (
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

      {/* Deleted Tasks Section */}
      {showDeleted && deletedTasks.length > 0 && (
        <Card className="border-0 shadow-sm border-red-200 dark:border-red-900">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2 text-red-600 dark:text-red-400">
                  Lixeira
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-300">
                    {deletedTasks.length}
                  </span>
                </CardTitle>
                <CardDescription className="mt-1">
                  Tarefas deletadas podem ser restauradas ou excluídas permanentemente.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {deletedTasks.map((task) => (
                <Card
                  key={task.id}
                  className="group border border-red-200 bg-red-50 dark:bg-red-900/20 text-gray-100 rounded-xl transition hover:border-red-400 hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-gray-500 line-through">
                        {task.title ?? "Sem título"}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                        <span>Deletada em {new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(task.updated_at))}</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                      onClick={() => onRestore(task.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restaurar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};