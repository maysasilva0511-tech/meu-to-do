import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/api";
import { toast } from "sonner";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories, error, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await categoryService.getCategories();
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createCategory = useMutation({
    mutationFn: async (category: any) => {
      const { data, error } = await categoryService.createCategory(category);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao criar categoria: " + error.message);
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...category }: { id: string; [key: string]: any }) => {
      const { data, error } = await categoryService.updateCategory(id, category);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar categoria: " + error.message);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await categoryService.deleteCategory(id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Categoria deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar categoria: " + error.message);
    },
  });

  return {
    categories,
    error,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};