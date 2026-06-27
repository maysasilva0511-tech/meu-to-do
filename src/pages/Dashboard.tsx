"use client";

import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/tasks";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    tasks = [],
    isLoading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    restoreTask,
    refetch,
  } = useTasks();

  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

  const activeTasks = tasks.filter((t) => t.status !== "deleted");
  const completedCount = activeTasks.filter((t) => t.status === "completed").length;
  const pendingCount = activeTasks.filter((t) => t.status === "pending").length;
  const inProgressCount = activeTasks.filter(
    (t) => t.status === "in_progress",
  ).length;

  const stats = {
    total: activeTasks.length,
    completed: completedCount,
    pending: pendingCount,
    inProgress: inProgressCount,
  };

  const handleCreateTask = async (data: any) => {
    await createTask.mutateAsync(data);
    setIsTaskModalOpen(false);
    refetch();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth/login");
  };

  const handleConfirmDelete = (id: string) => {
    const certeza = window.confirm("Tem certeza que deseja mover esta tarefa para a lixeira?");
    if (certeza) {
      deleteTask.mutate(id);
    }
  };

  const handleConfirmEdit = (id: string, textoAtual: string) => {
    const novoTexto = window.prompt("Altere o título da tarefa:", textoAtual);
    
    if (novoTexto !== null && novoTexto.trim() !== "") {
      const certeza = window.confirm(`Confirma a alteração para: "${novoTexto}"?`);
      if (certeza) {
        updateTaskStatus.mutate({ id, title: novoTexto });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <DashboardHeader
        onCreateTask={() => setIsTaskModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8 dark:bg-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex flex-col items-center gap-2">
              <Calendar className="h-8 w-8 text-emerald-500" />
              <h1 className="text-3xl font-bold tracking-tight text-emerald-500">
                Meu To Do
              </h1>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed bg-gray-800">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <p className="text-sm text-gray-300">
                Carregando dashboard...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed bg-gray-800">
            <div className="max-w-md text-center">
              <p className="text-sm font-medium text-red-400">
                Não foi possível carregar suas tarefas.
              </p>
              <button
                className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />
            <TaskList
              tasks={tasks}
              onCreateTask={() => setIsTaskModalOpen(true)}
              onStatusChange={(id, status) =>
                updateTaskStatus.mutate({ id, status })
              }
              onDelete={handleConfirmDelete}
              onEdit={handleConfirmEdit}
              onRestore={(id) => restoreTask.mutate(id)}
            />
          </>
        )}
      </main>

      {isTaskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setIsTaskModalOpen(false)}
              isSubmitting={createTask.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};