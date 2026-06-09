import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/api'
import { toast } from 'sonner'

export const useTasks = () => {
  const queryClient = useQueryClient()
  
  const { data: tasks, error, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await taskService.getTasks()
      if (error) throw error
      return data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  const createTask = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      toast.success('Tarefa criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast.error('Erro ao criar tarefa: ' + error.message)
    }
  })
  
  const updateTask = useMutation({
    mutationFn: ({ id, ...task }: { id: string; [key: string]: any }) => 
      taskService.updateTask(id, task),
    onSuccess: () => {
      toast.success('Tarefa atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast.error('Erro ao atualizar tarefa: ' + error.message)
    }
  })
  
  const deleteTask = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      toast.success('Tarefa deletada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast.error('Erro ao deletar tarefa: ' + error.message)
    }
  })
  
  return { 
    tasks, 
    error, 
    isLoading, 
    createTask, 
    updateTask, 
    deleteTask 
  }
}