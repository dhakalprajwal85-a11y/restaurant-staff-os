"use client";

import { supabase } from "@/lib/supabase";

export default function DeleteTaskButton({ taskId }: { taskId: string }) {
  async function deleteTask() {
    const ok = confirm("Delete this task?");

    if (!ok) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={deleteTask}
      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-bold"
    >
      Delete
    </button>
  );
}