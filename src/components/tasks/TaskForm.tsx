"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const taskFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormValues) => Promise<void> | void;
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
    setValue,
    watch,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      priority: "medium",
    },
  });

  const handleFormSubmit = async (data: TaskFormValues) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      toast.error(
        "Erro ao criar tarefa: " +
          (error instanceof Error ? error.message : "Erro desconhecido"),
      );
    }
  };

  return (
    <Card className="w-full border-0 shadow-2xl bg-gray-800 text-gray-100 rounded-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-100">
          Nova Tarefa
        </CardTitle>
        <CardDescription className="text-sm text-gray-400">
          A tarefa será vinculada automaticamente ao usuário logado.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-300">
              Título *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Estudar React"
              disabled={isSubmitting}
              {...register("title")}
              className="bg-gray-700 text-gray-100 border-gray-600"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-300">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Detalhes da tarefa..."
              rows={3}
              disabled={isSubmitting}
              {...register("description")}
              className="bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium text-gray-300">
                Prioridade
              </Label>
              <Select
                value={watch("priority")}
                onValueChange={(value) => setValue("priority", value as "low" | "medium" | "high")}
              >
                <SelectTrigger className="border border-input bg-gray-700 text-gray-100">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-100">
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium text-gray-300">
                Data de Vencimento
              </Label>
              <Input
                id="dueDate"
                type="date"
                disabled={isSubmitting}
                {...register("dueDate")}
                className="bg-gray-700 text-gray-100 border-gray-600"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
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