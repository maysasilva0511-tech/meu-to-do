"use client";

import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/tasks";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    tasks = [],
    isLoading,
    error,
    createTask,
    refetch,
  } = useTasks();

  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const pendingCount = tasks.filter((t) => !t.is_completed).length;

  const stats = {
    total: tasks.length,
    completed: completedCount,
    pending: pendingCount,
    inProgress: 0,
  };

  const handleCreateTask = async (data: { title: string }) => {
    await createTask.mutateAsync({ title: data.title });
    setIsTaskModalOpen(false);
    refetch();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader
        onCreateTask={() => setIsTaskModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Meu To Do
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Organize suas tarefas com segurança
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Sua lista mostra apenas as tarefas criadas pelo usuário
                autenticado. Ao salvar uma nova tarefa, ela aparece imediatamente
                na Home.
              </p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed bg-white">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <p className="text-sm text-muted-foreground">
                Carregando dashboard...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed bg-white">
            <div className="max-w-md text-center">
              <p className="text-sm font-medium text-destructive">
                Não foi possível carregar suas tarefas.
              </p>
              <button
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />
            <TaskList tasks={tasks} onCreateTask={() => setIsTaskModalOpen(true)} />
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