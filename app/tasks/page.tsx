import DeleteTaskButton from "@/components/DeleteTaskButton";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import AddTaskForm from "@/components/AddTaskForm";
import TaskPhotoUpload from "@/components/TaskPhotoUpload";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  Circle,
  Clock3,
  UserRound,
} from "lucide-react";

export const dynamic = "force-dynamic";

type TaskStatus = "pending" | "in_progress" | "completed" | "done";

function getNormalizedStatus(status?: string | null) {
  if (status === "done" || status === "completed") {
    return "completed";
  }

  if (status === "in_progress") {
    return "in_progress";
  }

  return "pending";
}

function formatDate(value?: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function TasksPage() {
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(`
      *,
      workers (
        name
      )
    `)
    .order("created_at", { ascending: false });

  const { data: workers, error: workersError } = await supabase
    .from("workers")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <main className="flex min-h-screen bg-[#020817] text-white">
      <Sidebar />

      <section className="flex-1 p-10 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-green-400">
              Task management
            </p>

            <h1 className="text-5xl font-bold">
              Store Tasks
            </h1>

            <p className="mt-3 text-gray-400">
              Assign work and track each worker&apos;s progress.
            </p>
          </div>

          {workersError && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              Failed to load workers: {workersError.message}
            </div>
          )}

          <AddTaskForm workers={workers || []} />

          {tasksError && (
            <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              Failed to load tasks: {tasksError.message}
            </div>
          )}

          {!tasksError && tasks?.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-white/20 bg-[#111827] px-6 py-14 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-gray-600" />

              <h2 className="text-xl font-semibold">
                No tasks created
              </h2>

              <p className="mt-2 text-gray-400">
                Assign a new task using the form above.
              </p>
            </div>
          )}

          <div className="mt-8 space-y-5">
            {tasks?.map((task) => {
              const status = getNormalizedStatus(
                task.status as TaskStatus
              );

              const isPending = status === "pending";
              const isInProgress = status === "in_progress";
              const isCompleted = status === "completed";

              return (
                <article
                  key={task.id}
                  className={`rounded-3xl border p-6 transition ${
                    isCompleted
                      ? "border-green-500/30 bg-green-500/5"
                      : isInProgress
                        ? "border-blue-500/30 bg-[#111827]"
                        : "border-white/10 bg-[#111827]"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2
                          className={`text-3xl font-bold ${
                            isCompleted
                              ? "text-gray-400 line-through"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h2>

                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/15 px-3 py-1 text-sm font-semibold text-yellow-300">
                            <Circle className="h-4 w-4" />
                            Pending
                          </span>
                        )}

                        {isInProgress && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-sm font-semibold text-blue-300">
                            <Clock3 className="h-4 w-4" />
                            In Progress
                          </span>
                        )}

                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-sm font-semibold text-green-300">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-blue-400">
                        <UserRound className="h-5 w-5" />

                        <p className="text-lg font-semibold">
                          Assigned to:{" "}
                          {task.workers?.name || "Unassigned"}
                        </p>
                      </div>

                      {task.description && (
                        <p className="mt-4 whitespace-pre-line leading-7 text-gray-400">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Started
                      </p>

                      <p className="mt-1 font-medium text-gray-200">
                        {formatDate(task.started_at) || "Not started"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Completed
                      </p>

                      <p
                        className={`mt-1 font-medium ${
                          task.completed_at
                            ? "text-green-300"
                            : "text-gray-200"
                        }`}
                      >
                        {formatDate(task.completed_at) || "Not completed"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <TaskPhotoUpload taskId={task.id} />
                  </div>

                  {task.photo_url && (
                    <img
                      src={task.photo_url}
                      alt={`${task.title} task`}
                      className="mt-5 h-64 w-full rounded-2xl border border-white/10 object-cover"
                    />
                  )}

                  {task.completion_note && (
                    <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Worker completion note
                      </p>

                      <p className="mt-2 whitespace-pre-line text-gray-200">
                        {task.completion_note}
                      </p>
                    </div>
                  )}

                  {task.completion_photo_url && (
                    <div className="mt-5">
                      <p className="mb-2 text-sm font-medium text-gray-400">
                        Worker completion photo
                      </p>

                      <img
                        src={task.completion_photo_url}
                        alt={`${task.title} completion`}
                        className="h-64 w-full rounded-2xl border border-green-500/20 object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <DeleteTaskButton taskId={task.id} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}