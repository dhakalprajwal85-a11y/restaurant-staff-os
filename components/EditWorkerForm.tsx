"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Worker = {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
};

export default function EditWorkerForm({ worker }: { worker: Worker }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(worker.name);
  const [role, setRole] = useState(worker.role || "");
  const [phone, setPhone] = useState(worker.phone || "");

  async function updateWorker() {
    const { error } = await supabase
      .from("workers")
      .update({
        name,
        role,
        phone,
      })
      .eq("id", worker.id);

    if (error) {
      alert(error.message);
      return;
    }

    setIsEditing(false);
    window.location.reload();
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 mr-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl font-bold"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <input
        className="w-full bg-[#020817] border border-white/10 rounded-xl p-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full bg-[#020817] border border-white/10 rounded-xl p-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <input
        className="w-full bg-[#020817] border border-white/10 rounded-xl p-3"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={updateWorker}
        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-bold"
      >
        Save
      </button>

      <button
        onClick={() => setIsEditing(false)}
        className="ml-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl font-bold"
      >
        Cancel
      </button>
    </div>
  );
}