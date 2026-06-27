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
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao criar categoria: " + error.message);
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, ...category }: { id: string; [key: string]: any }) =>
      categoryService.updateCategory(id, category),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar categoria: " + error.message);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: categoryService.deleteCategory,
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