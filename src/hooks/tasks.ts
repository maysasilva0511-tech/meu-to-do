import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/api'
import { toast } from 'sonner'

export const useTasks = () => {
  const queryClient = useQueryClient()
  
  const { data: tasks, error, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // Adicionando dados simulados para desenvolvimento
      const mockTasks = [
        {
          id: '1',
          title: 'Concluir projeto de design',
          description: 'Finalizar o layout da dashboard principal',
          status: 'in_progress',
          priority: 'high',
          due_date: '2024-12-25',
          user_id: 'mock-user-id',
          created_at: '2024-12-01T10:00:00Z',
          updated_at: '2024-12-01T10:00:00Z'
        },
        {
          id: '2',
          title: 'Revisar documentação',
          description: 'Atualizar a documentação da API',
          status: 'pending',
          priority: 'medium',
          due_date: '2024-12-20',
          user_id: 'mock-user-id',
          created_at: '2024-12-01T08:00:00Z',
          updated_at: '2024-12-01T08:00:00Z'
        },
        {
          id: '3',
          title: 'Implementar testes unitários',
          description: 'Criar testes para os componentes principais',
          status: 'completed',
          priority: 'low',
          due_date: '2024-12-15',
          user_id: 'mock-user-id',
          created_at: '2024-11-30T14:00:00Z',
          updated_at: '2024-12-01T16:00:00Z'
        },
        {
          id: '4',
          title: 'Configurar CI/CD',
          description: 'Configurar pipeline de integração contínua',
          status: 'pending',
          priority: 'high',
          due_date: '2024-12-30',
          user_id: 'mock-user-id',
          created_at: '2024-12-02T09:00:00Z',
          updated_at: '2024-12-02T09:00:00Z'
        }
      ]
      
      return mockTasks
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