"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddChecklistItemForm() {
  const [title, setTitle] = useState("");
  const [shift, setShift] = useState("opening");

  async function addItem() {
    if (!title) {
      alert("Checklist title is required");
      return;
    }

    const { error } = await supabase
      .from("checklist_items")
      .insert({
        title,
        shift,
        completed: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");

    window.location.reload();
  }

  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 mb-8">
      <h2 className="text-3xl font-bold mb-6">
        Add Checklist Item
      </h2>

      <input
        placeholder="Example: Clean tables"
        className="w-full bg-[#020817] border border-white/10 rounded-xl p-4 mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="w-full bg-[#020817] border border-white/10 rounded-xl p-4 mb-4"
        value={shift}
        onChange={(e) => setShift(e.target.value)}
      >
        <option value="opening">Opening</option>
        <option value="closing">Closing</option>
      </select>

      <button
        onClick={addItem}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold"
      >
        Save Item
      </button>
    </div>
  );
}