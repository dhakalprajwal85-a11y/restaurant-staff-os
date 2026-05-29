"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Worker = {
  id: string;
  name: string;
};

export default function AddTaskForm({ workers }: { workers: Worker[] }) {
  const [workerId, setWorkerId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function addTask() {
    if (!title) {
      alert("Task title is required");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      worker_id: workerId || null,
      title,
      description,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setWorkerId("");
    setTitle("");
    setDescription("");

    window.location.reload();
  }

  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 mb-8">
      <h2 className="text-3xl font-bold mb-6">Add Store Task</h2>

      <select
        className="w-full bg-[#020817] border border-white/10 rounded-xl p-4 mb-4"
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
      >
        <option value="">Assign to worker</option>

        {workers.map((worker) => (
          <option key={worker.id} value={worker.id}>
            {worker.name}
          </option>
        ))}
      </select>

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