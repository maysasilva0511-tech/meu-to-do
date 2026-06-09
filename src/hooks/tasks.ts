import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/api'
import { toast } from 'sonner'
import { useAuth } from './auth'

export const useTasks = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const { data: tasks, error, isLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },
    enabled: !!user, // Só buscar se usuário estiver logado
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  const createTask = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error('Usuário não autenticado')
      
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          title, 
          user_id: user.id, 
          is_completed: false,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      toast.success('Tarefa criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
    onError: (error: any) => {
      toast.error('Erro ao criar tarefa: ' + error.message)
    }
  })
  
  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ 
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      toast.success('Tarefa atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar tarefa: ' + error.message)
    }
  })
  
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Tarefa deletada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
    onError: (error: any) => {
      toast.error('Erro ao deletar tarefa: ' + error.message)
    }
  })
  
  return { 
    tasks, 
    error, 
    isLoading, 
    createTask, 
    updateTaskStatus, 
    deleteTask 
  }
}