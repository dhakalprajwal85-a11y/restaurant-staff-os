"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WorkerLoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!loginId || !password) {
      alert("Please enter your Worker ID and Password.");
      return;
    }

    setLoading(true);

    const { data: worker, error } = await supabase
      .from("workers")
      .select("*")
      .eq("login_id", loginId)
      .eq("password", password)
      .eq("status", "active")
      .maybeSingle();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (!worker) {
      alert("Wrong Worker ID or Password.");
      return;
    }

    localStorage.setItem(
  "worker",
  JSON.stringify({
    id: worker.id,
    name: worker.name,
    login_id: worker.login_id,
  })
);

localStorage.setItem("worker_id", worker.id);
localStorage.setItem("worker_name", worker.name);
localStorage.setItem("worker_login_id", worker.login_id);

window.location.href = "/worker-app";
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md">

        <h1 className="text-4xl font-bold mb-2 text-center">
          Worker Login
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Sign in to access your dashboard
        </p>

        <input
          type="text"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          placeholder="Worker ID"
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 p-3 rounded-lg font-bold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </main>
  );
}