import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Todo, todoService } from '@/services/supabase';
import { useAuth } from './auth';

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], error, isLoading, refetch } = useQuery<Todo[]>({
    queryKey: ['todos', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await todoService.list(user.id);
      if (error) throw error;

      return data ?? [];
    },
    enabled: !!user,
  });

  const createTask = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await todoService.create({
        title,
        user_id: user.id,
        is_completed: false,
      });

      if (error) throw error;

      return data?.[0];
    },
    onSuccess: () => {
      toast.success('Tarefa criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar tarefa: ' + error.message);
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: number; isCompleted: boolean }) => {
      const { data, error } = await todoService.update(id, {
        is_completed: isCompleted,
      });

      if (error) throw error;

      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar tarefa: ' + error.message);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await todoService.delete(id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Tarefa deletada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
    onError: (error: Error) => {
      toast.error('Erro ao deletar tarefa: ' + error.message);
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