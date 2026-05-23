import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import AddTaskForm from "@/components/AddTaskForm";
import TaskDoneButton from "@/components/TaskDoneButton";
import { supabase } from "@/lib/supabase";

export default async function TasksPage() {

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#020817] text-white flex">

      <Sidebar />

      <section className="flex-1 p-10">

        <h1 className="text-5xl font-bold mb-10">
          Store Tasks
        </h1>

        <AddTaskForm />

        <div className="space-y-4">

          {tasks?.map((task) => (

            <div
              key={task.id}
              className="bg-[#111827] border border-white/10 rounded-3xl p-6"
            >

              <h2 className="text-3xl font-bold">
                {task.title}
              </h2>

              <p className="text-gray-400 mt-3">
                {task.description}
              </p>

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

              {task.status !== "done" && (

                <div className="mt-5">

                  <TaskDoneButton taskId={task.id} />

                </div>

              )}

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}