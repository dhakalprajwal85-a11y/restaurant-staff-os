"use client";

import { supabase } from "@/lib/supabase";

export default function TaskDoneButton({
  taskId,
}: {
  taskId: string;
}) {

  async function markDone() {

    const { error } = await supabase
      .from("tasks")
      .update({
        status: "done",
      })
      .eq("id", taskId);

    if (error) {
      return alert(error.message);
    }

    window.location.reload();
  }

  return (
    <button
      onClick={markDone}
      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-bold"
    >
      ✓ Done
    </button>
  );
}