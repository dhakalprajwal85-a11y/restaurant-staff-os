"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddWorkerForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");

  async function addWorker() {
    if (!name) {
      alert("Name is required");
      return;
    }

    const { error } = await supabase
      .from("workers")
      .insert({
        name,
        role,
        phone,
        status,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setRole("");
    setPhone("");

    window.location.reload();
  }

  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-8">
      
      <h2 className="text-2xl font-bold mb-4">
        Add Worker
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <input
          placeholder="Name"
          className="bg-[#020817] border border-white/10 rounded-xl p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Role"
          className="bg-[#020817] border border-white/10 rounded-xl p-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          placeholder="Phone"
          className="bg-[#020817] border border-white/10 rounded-xl p-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

      </div>
      <select
  className="bg-[#020817] border border-white/10 rounded-xl p-3 mt-4"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
  <option value="on_leave">On Leave</option>
</select>

      <button
        onClick={addWorker}
        className="mt-4 bg-green-500 px-6 py-3 rounded-xl font-bold"
      >
        Save Worker
      </button>

    </div>
  );
}