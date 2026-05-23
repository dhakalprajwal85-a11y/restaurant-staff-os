"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddTaskForm() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function addTask() {

    if (!title) {
      return alert("Task title required");
    }

    const { error } = await supabase
      .from("tasks")
      .insert({
        title,
        description,
        status: "pending",
      });

    if (error) {
      return alert(error.message);
    }

    setTitle("");
    setDescription("");

    window.location.reload();
  }

  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 mb-8">

      <h2 className="text-3xl font-bold mb-6">
        Add Store Task
      </h2>

      <input
        placeholder="Task title"
        className="w-full bg-[#020817] border border-white/10 rounded-xl p-4 mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Task description"
        className="w-full bg-[#020817] border border-white/10 rounded-xl p-4 mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={addTask}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold"
      >
        Save Task
      </button>

    </div>
  );
}