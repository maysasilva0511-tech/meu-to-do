"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const taskFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSubmit: (title: string) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleFormSubmit = async (data: TaskFormValues) => {
    try {
      await onSubmit(data.title);
      reset();
    } catch (error) {
      toast.error(
        "Erro ao criar tarefa: " +
          (error instanceof Error ? error.message : "Erro desconhecido")
      );
    }
  };

  return (
    <Card className="w-full border-0 shadow-2xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Nova Tarefa
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          A tarefa será vinculada automaticamente ao usuário logado.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Estudar React"
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Criar Tarefa"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};