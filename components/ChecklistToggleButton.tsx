"use client";

import { supabase } from "@/lib/supabase";

export default function ChecklistToggleButton({
  itemId,
  completed,
}: {
  itemId: string;
  completed: boolean;
}) {
  async function toggle() {
    const { error } = await supabase
      .from("checklist_items")
      .update({ completed: !completed })
      .eq("id", itemId);

    if (error) return alert(error.message);

    window.location.reload();
  }

  return (
    <button
      onClick={toggle}
      className={
        completed
          ? "bg-gray-600 px-4 py-2 rounded-xl font-bold"
          : "bg-green-500 px-4 py-2 rounded-xl font-bold"
      }
    >
      {completed ? "Undo" : "✓ Done"}
    </button>
  );
}