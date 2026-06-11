"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Loader2, LogOut, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

type Todo = {
  id: string | number;
  title: string;
  is_completed: boolean;
  created_at: string;
};

const LOGIN_REDIRECT_PATH = "/auth/login";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadTasks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate(LOGIN_REDIRECT_PATH, { replace: true });
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    setTasks(data ?? []);
  };

  useEffect(() => {
    void loadTasks().finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setTasks([]);
        setNewTask("");
        navigate(LOGIN_REDIRECT_PATH, { replace: true });
      }
    });

    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const handleCreateTask = async () => {
    const title = newTask.trim();

    if (!title) {
      toast("Digite o título da nova tarefa.");
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await supabase.auth.signOut();
        navigate(LOGIN_REDIRECT_PATH, { replace: true });
        return;
      }

      const { error } = await supabase.from("todos").insert([
        {
          title,
          user_id: user.id,
          is_completed: false,
        },
      ]);

      if (error) {
        throw error;
      }

      setNewTask("");
      await loadTasks();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (task: Todo) => {
    await supabase
      .from("todos")
      .update({ is_completed: !task.is_completed })
      .eq("id", task.id);

    await loadTasks();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await supabase.auth.signOut();

    setTasks([]);
    setNewTask("");
    navigate(LOGIN_REDIRECT_PATH, { replace: true });
  };

  const completedTasks = tasks.filter((task) => task.is_completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
              Painel pessoal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Gerencie suas tarefas e finalize a sessão com segurança.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center gap-2 rounded-full border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isLoggingOut ? "Saindo..." : "Sair"}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {tasks.length}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Concluídas</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {completedTasks}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Pendentes</p>
            <p className="mt-2 text-3xl font-bold text-amber-700">
              {pendingTasks}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleCreateTask();
                }
              }}
              placeholder="Adicionar uma nova tarefa..."
              className="min-h-11 flex-1 rounded-full border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            <Button
              type="button"
              onClick={handleCreateTask}
              disabled={isSubmitting || !newTask.trim()}
              className="rounded-full px-5 font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Nova Tarefa
            </Button>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando tarefas...
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Nenhuma tarefa encontrada.
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Crie sua primeira tarefa usando o campo acima.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={`${task.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => void handleToggleTask(task)}
                      className="text-indigo-600 transition hover:text-indigo-700"
                      aria-label={
                        task.is_completed
                          ? "Marcar tarefa como pendente"
                          : "Marcar tarefa como concluída"
                      }
                    >
                      {task.is_completed ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-400" />
                      )}
                    </button>
                    <span
                      className={
                        task.is_completed
                          ? "flex-1 text-sm text-slate-400 line-through"
                          : "flex-1 text-sm font-medium text-slate-800"
                      }
                    >
                      {task.title}
                    </span>
                    <time className="hidden text-xs text-slate-400 sm:block">
                      {new Date(task.created_at).toLocaleDateString("pt-BR")}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;