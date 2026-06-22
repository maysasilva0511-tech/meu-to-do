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
    refetch,
  } = useTasks();

  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;

  const stats = {
    total: tasks.length,
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
  