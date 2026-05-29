import DeleteTaskButton from "@/components/DeleteTaskButton";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import AddTaskForm from "@/components/AddTaskForm";
import TaskDoneButton from "@/components/TaskDoneButton";
import TaskPhotoUpload from "@/components/TaskPhotoUpload";
import { supabase } from "@/lib/supabase";

export default async function TasksPage() {
  const { data: tasks } = await supabase
  .from("tasks")
  .select(`
    *,
    workers (
      name
    )
  `)
  .order("created_at", { ascending: false });
  const { data: workers } = await supabase
  .from("workers")
  .select("id, name");

  return (
    <main className="min-h-screen bg-[#020817] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10 pb-24">
        <h1 className="text-5xl font-bold mb-10">
          Store Tasks
        </h1>

        <AddTaskForm workers={workers || []} />

        <div className="space-y-4">
  {tasks?.map((task) => (
    <div
      key={task.id}
      className="bg-[#111827] border border-white/10 rounded-3xl p-6"
    >
      <h2 className="text-3xl font-bold">{task.title}
        <p className="text-blue-400 mt-2">
           Assigned to: {task.workers?.name || "Unassigned"}
        </p>
      </h2>

      <p className="text-gray-400 mt-3">{task.description}</p>

      <p className="mt-4">
        Status:
        <span
          className={
            task.status === "done"
              ? "text-green-400 ml-2"
              : "text-yellow-400 ml-2"
          }
        >
          {task.status}
        </span>
      </p>

      <TaskPhotoUpload taskId={task.id} />

      {task.photo_url && (
        <img
          src={task.photo_url}
          alt="Task"
          className="mt-4 rounded-xl w-full h-48 object-cover"
        />
      )}

      <div className="mt-5 flex gap-3">
        {task.status !== "done" && (
          <TaskDoneButton taskId={task.id} />
        )}

        <DeleteTaskButton taskId={task.id} />
      </div>
    </div>
  ))}
</div>
</section>

<BottomNav />
</main>
);
}