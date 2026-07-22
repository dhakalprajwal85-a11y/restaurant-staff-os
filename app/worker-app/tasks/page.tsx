"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  Play,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Worker = {
  id: string;
  name?: string;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status?: "pending" | "in_progress" | "completed" | null;
  worker_id: string;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
};

export default function WorkerTasksPage() {
  const router = useRouter();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (workerId: string) => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("worker_id", workerId)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Task fetch error:", fetchError);
      setError(fetchError.message);
      setTasks([]);
    } else {
      setTasks((data as Task[]) ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const savedWorker = localStorage.getItem("worker");

    if (!savedWorker) {
      router.replace("/worker-login");
      return;
    }

    try {
      const parsedWorker = JSON.parse(savedWorker) as Worker;

      if (!parsedWorker.id) {
        localStorage.removeItem("worker");
        router.replace("/worker-login");
        return;
      }

      setWorker(parsedWorker);
      loadTasks(parsedWorker.id);
    } catch {
      localStorage.removeItem("worker");
      router.replace("/worker-login");
    }
  }, [loadTasks, router]);

  useEffect(() => {
    if (!worker?.id) return;

    const channel = supabase
      .channel(`worker-tasks-${worker.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `worker_id=eq.${worker.id}`,
        },
        () => {
          loadTasks(worker.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTasks, worker?.id]);

  async function updateTaskStatus(
    taskId: string,
    newStatus: "in_progress" | "completed"
  ) {
    setUpdatingTaskId(taskId);
    setError("");

    const updateData =
      newStatus === "in_progress"
        ? {
            status: "in_progress",
            started_at: new Date().toISOString(),
            completed_at: null,
          }
        : {
            status: "completed",
            completed_at: new Date().toISOString(),
          };

    const { error: updateError } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", taskId);

    if (updateError) {
      console.error("Task update error:", updateError);
      setError(updateError.message);
    } else if (worker?.id) {
      await loadTasks(worker.id);
    }

    setUpdatingTaskId(null);
  }

  function getStatusDetails(status?: Task["status"]) {
    if (status === "completed") {
      return {
        label: "Completed",
        classes: "bg-green-100 text-green-700",
        icon: CheckCircle2,
      };
    }

    if (status === "in_progress") {
      return {
        label: "In Progress",
        classes: "bg-blue-100 text-blue-700",
        icon: Clock3,
      };
    }

    return {
      label: "Pending",
      classes: "bg-amber-100 text-amber-700",
      icon: Circle,
    };
  }

  function formatDate(value?: string | null) {
    if (!value) return "";

    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 px-4 pb-28 pt-6">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Assigned work</p>

        <h1 className="text-2xl font-bold text-gray-900">
          My Tasks
        </h1>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />

          <h2 className="font-semibold text-gray-800">
            No assigned tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            New tasks assigned by your manager will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const status = task.status || "pending";
            const statusDetails = getStatusDetails(status);
            const StatusIcon = statusDetails.icon;
            const isUpdating = updatingTaskId === task.id;

            return (
              <article
                key={task.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2
                      className={`text-lg font-semibold ${
                        status === "completed"
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h2>

                    {task.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusDetails.classes}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusDetails.label}
                  </span>
                </div>

                {task.started_at && (
                  <p className="mt-4 text-xs text-gray-500">
                    Started: {formatDate(task.started_at)}
                  </p>
                )}

                {task.completed_at && (
                  <p className="mt-1 text-xs text-green-700">
                    Completed: {formatDate(task.completed_at)}
                  </p>
                )}

                {status === "pending" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() =>
                      updateTaskStatus(task.id, "in_progress")
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}

                    Start Task
                  </button>
                )}

                {status === "in_progress" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() =>
                      updateTaskStatus(task.id, "completed")
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}

                    Complete Task
                  </button>
                )}

                {status === "completed" && (
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 font-semibold text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    Task Completed
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}