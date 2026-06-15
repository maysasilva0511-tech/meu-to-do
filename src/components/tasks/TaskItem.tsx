"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Trash2 } from "lucide-react";
import { Todo } from "@/services/supabase";

interface TaskItemProps {
  task: Todo;
  onStatusChange: (isCompleted: boolean) => void;
  onDelete: (id: number) => void;
}

export const TaskItem = ({ task, onStatusChange, onDelete }: TaskItemProps) => {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(task.created_at));

  return (
    <Card className="group border border-slate-200 bg-white transition hover:border-blue-200 hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full"
          onClick={() => onStatusChange(!task.is_completed)}
          aria-label={
            task.is_completed ? "Marcar tarefa como pendente" : "Concluir tarefa"
          }
        >
          {task.is_completed ? (
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          ) : (
            <Circle className="h-5 w-5 text-slate-400" />
          )}
        </Button>

        <div className="min-w-0 flex-1">
          <h3
            className={[
              "truncate text-base font-semibold transition",
              task.is_completed
                ? "text-muted-foreground line-through"
                : "text-slate-900",
            ].join(" ")}
          >
            {task.title ?? "Sem título"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Criada em {formattedDate}
          </p>
        </div>

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