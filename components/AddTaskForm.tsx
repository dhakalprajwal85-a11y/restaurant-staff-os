"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type Worker = {
  id: string;
  name: string;
};

type AddTaskFormProps = {
  workers: Worker[];
};

export default function AddTaskForm({
  workers,
}: AddTaskFormProps) {
  const [workerId, setWorkerId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    setErrorMessage("");
    setSuccessMessage("");

    if (!cleanTitle) {
      setErrorMessage("Task title is required.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("tasks").insert({
        worker_id: workerId || null,
        title: cleanTitle,
        description: cleanDescription || null,
        status: "pending",
      });

      if (error) {
        throw error;
      }

      setWorkerId("");
      setTitle("");
      setDescription("");
      setSuccessMessage("Task created successfully.");

      window.location.reload();
    } catch (error) {
      console.error("Create task error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create task."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-3xl border border-white/10 bg-[#111827] p-6"
    >
      <h2 className="mb-6 text-3xl font-bold">
        Add Store Task
      </h2>

      <label className="mb-2 block font-medium">
        Assign worker
      </label>

      <select
        className="mb-4 w-full rounded-xl border border-white/10 bg-[#020817] p-4"
        value={workerId}
        onChange={(event) =>
          setWorkerId(event.target.value)
        }
        disabled={loading}
      >
        <option value="">Unassigned task</option>

        {workers.map((worker) => (
          <option key={worker.id} value={worker.id}>
            {worker.name}
          </option>
        ))}
      </select>

      <label className="mb-2 block font-medium">
        Task title
      </label>

      <input
        type="text"
        placeholder="Enter task title"
        className="mb-4 w-full rounded-xl border border-white/10 bg-[#020817] p-4"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={loading}
        required
      />

      <label className="mb-2 block font-medium">
        Description
      </label>

      <textarea
        placeholder="Enter task description"
        className="mb-4 min-h-32 w-full resize-y rounded-xl border border-white/10 bg-[#020817] p-4"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        disabled={loading}
      />

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-green-500 px-6 py-3 font-bold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
}