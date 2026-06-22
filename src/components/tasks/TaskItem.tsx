"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Trash2, Clock, Pencil } from "lucide-react"; 
import { Task } from "@/hooks/tasks";

interface TaskItemProps {
  task: Task;
  onStatusChange: (status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (title: string) => void;
}

const statusConfig = {
  pending: { label: "Pendente", icon: Circle, color: "text-slate-400", bg: "bg-slate-100" },
  in_progress: { label: "Em Progresso", icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  completed: { label: "Concluída", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
};

const priorityConfig = {
  low: { label: "Baixa", color: "text-slate-600", bg: "bg-slate-100" },
  medium: { label: "Média", color: "text-amber-600", bg: "bg-amber-100" },
  high: { label: "Alta", color: "text-red-600", bg: "bg-red-100" },
};

export const TaskItem = ({ task, onStatusChange, onDelete, onEdit }: TaskItemProps) => {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(task.created_at));

  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;

  return (
    <Card className="group border border-slate-200 bg-white transition hover:border-blue-200 hover:shadow-md">
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
          <div className="flex items-center gap-2">
            <h3
              className={[
                "truncate text-base font-semibold transition",
                task.status === "completed"
                  ? "text-muted-foreground line-through"
                  : "text-slate-900",
              ].join(" ")}
            >
              {task.title ?? "Sem título"}
            </h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priority.bg} ${priority.color}`}>
              {priority.label}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Criada em {formattedDate}</span>
            <span className={`px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
              {status.label}
            </span>
            {task.due_date && (
              <span className="text-amber-600">
                Vence:{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  day: "2-digit",
                  month: "short",
                }).format(new Date(task.due_date))}
              </span>
            )}
          </div>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
          onClick={() => onEdit(task.title ?? "")}
          aria-label="Editar tarefa"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full text-destructive opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(task.id)}
          aria-label="Excluir tarefa"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};