"use client";

import { useState } from "react";

export default function CreateWorkerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [hourlyWage, setHourlyWage] = useState("");
  const [loading, setLoading] = useState(false);

  async function createWorker() {
    if (!name || !email || !password) {
      alert("Name, email, and password are required.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-worker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        position,
        hourlyWage,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(result.error || "Failed to create worker.");
      return;
    }

    alert("Worker account created successfully!");

    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setPosition("");
    setHourlyWage("");
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white p-8">
      <div className="max-w-xl mx-auto bg-[#111827] border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">Create Worker Account</h1>

        <div className="space-y-4">
          <input
            placeholder="Worker Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
          />

          <input
            placeholder="Worker Email / Login ID"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
          />

          <input
            placeholder="Worker Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
          />

          <input
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
          />

          <input
            placeholder="Hourly Wage"
            type="number"
            value={hourlyWage}
            onChange={(e) => setHourlyWage(e.target.value)}
            className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
          />

          <button
            onClick={createWorker}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl p-4 font-bold"
          >
            {loading ? "Creating..." : "Create Worker"}
          </button>
        </div>
      </div>
    </main>
  );
}