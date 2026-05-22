"use client";

import { supabase } from "@/lib/supabase";

export default function DeleteWorkerButton({ workerId }: { workerId: string }) {
  async function deleteWorker() {
    const confirmDelete = confirm("Delete this worker?");

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("workers")
      .delete()
      .eq("id", workerId);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={deleteWorker}
      className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-bold"
    >
      Delete
    </button>
  );
}