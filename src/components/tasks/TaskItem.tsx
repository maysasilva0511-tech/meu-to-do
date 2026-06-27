"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Circle,
  Trash2,
  Clock,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { Task } from "@/hooks/tasks";
import { useTasks } from "@/hooks/tasks";

interface TaskItemProps {
  task: Task;
  onStatusChange: (status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

const statusConfig = {
  pending: { label: "Pendente", icon: Circle, color: "text-slate-400", bg: "bg-slate-700" },
  in_progress: { label: "Em Progresso", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-700" },
  completed: { label: "Concluída", icon: CheckCircle, color: "text-emerald-300", bg: "bg-emerald-800" },
};

const priorityConfig = {
  low: { label: "Baixa", color: "text-slate-600", bg: "bg-slate-700" },
  medium: { label: "Média", color: "text-amber-600", bg: "bg-amber-700" },
  high: { label: "Alta", color: "text-red-600", bg: "bg-red-700" },
};

export const TaskItem = ({
  task,
  onStatusChange,
  onDelete,
  onEdit,
}: TaskItemProps) => {
  const { updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title ?? "");

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(task.created_at));

  const status = statusConfig[task.status] ?? statusConfig['pending'];
  const priority = priorityConfig[task.priority] ?? priorityConfig['medium'];
  const StatusIcon = status.icon;

  const handleSaveEdit = async () => {
    if (editTitle.trim() && editTitle !== task.title) {
      const confirmed = window.confirm(
        `Confirma a alteração do título para "${editTitle.trim()}"?`
      );
      if (confirmed) {
        try {
          await updateTask.mutateAsync({
            id: task.id,
            updates: { title: editTitle.trim() },
          });
          setIsEditing(false);
        } catch (error) {
          console.error("Erro ao atualizar tarefa:", error);
        }
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title ?? "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <Card className="group border border-slate-600 bg-gray-800 text-gray-100 rounded-xl transition hover:border-emerald-500 hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full"
          onClick={() => {
            const nextStatus =
              task.status === "completed"
                ? "pending"
                : task.status === "pending"
                  ? "in_progress"
                  : "completed";
            onStatusChange(nextStatus);
          }}
          aria-label={`Alterar status para ${status.label}`}
        >
          <StatusIcon className={`h-5 w-5 ${status.color}`} />
        </Button>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-base font-semibold text-gray-100 bg-gray-700 border-b border-emerald-500 focus:outline-none"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-emerald-600 hover:text-emerald-100"
                onClick={handleSaveEdit}
                disabled={updateTask.isPending}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-red-600 hover:text-red-100"
                onClick={handleCancelEdit}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h3
                  className={[
                    "truncate text-base font-semibold transition",
                    task.status === "completed"
                      ? "text-gray-500 line-through"
                      : "text-gray-100",
                  ].join(" ")}
                >
                  {task.title ?? "Sem título"}
                </h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priority.bg} ${priority.color}`}>
                  {priority.label}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                <span>Criada em {formattedDate}</span>
                <span className={`px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
                {task.due_date && (
                  <span className="text-amber-400">
                    Vence:{" "}
                    {new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    }).format(new Date(task.due_date))}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-gray-700 hover:text-gray-200"
              onClick={() => setIsEditing(true)}
              aria-label="Editar tarefa"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full text-red-500 opacity-0 transition group-hover:opacity-100 hover:bg-red-800 hover:text-red-200"
              onClick={() => onDelete(task.id)}
              aria-label="Excluir tarefa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};