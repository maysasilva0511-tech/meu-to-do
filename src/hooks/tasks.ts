import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./auth";

export interface Task {
  id: string;
  title: string | null;
  description?: string | null;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], error, isLoading, refetch } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createTask = useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      priority?: string;
      dueDate?: string;
    }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: result, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: data.title,
            description: data.description,
            priority: data.priority || "medium",
            due_date: data.dueDate,
            user_id: user.id,
            status: "pending",
          },
        ])
        .select();

      if (error) throw error;
      return result?.[0];
    },
    onSuccess: () => {
      toast.success("Tarefa criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onError: (error: any) => {
      toast.error("Erro ao criar tarefa: " + error.message);
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar tarefa: " + error.message);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tarefa deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar tarefa: " + error.message);
    },
  });

  return {
    tasks,
    error,
    isLoading,
    createTask,
    updateTaskStatus,
    deleteTask,
    refetch,
  };
};