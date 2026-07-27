"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Worker = {
  id: string;
  auth_user_id: string;
  name: string;
  email: string | null;
  login_id: string | null;
  phone: string | null;
  position: string | null;
  hourly_wage: number | null;
  status: string;
  role: string;
};

export default function WorkerLoginPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const email = loginId.trim().toLowerCase();

    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage(
        "Login ID and password are required."
      );
      return;
    }

    try {
      setLoading(true);

      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData.user) {
        throw new Error(
          authError?.message ||
            "Wrong Worker ID or Password."
        );
      }

      // 2. Load the worker linked to this Auth user
      const { data, error: workerError } =
        await supabase
          .from("workers")
          .select(
            "id, auth_user_id, name, email, login_id, phone, position, hourly_wage, status, role"
          )
          .eq("auth_user_id", authData.user.id)
          .single();

      const worker = data as Worker | null;

      if (workerError || !worker) {
        await supabase.auth.signOut();

        throw new Error(
          "Worker profile was not found. Please contact the manager."
        );
      }

      if (worker.status !== "active") {
        await supabase.auth.signOut();

        throw new Error(
          "This worker account is not active."
        );
      }

      if (worker.role !== "worker") {
        await supabase.auth.signOut();

        throw new Error(
          "This account does not have worker access."
        );
      }

      // Compatibility with the existing worker pages
      localStorage.setItem(
        "worker",
        JSON.stringify(worker)
      );

      localStorage.setItem(
        "worker_id",
        worker.id
      );

      // Redirect only after storage has been written
      router.replace("/worker-app");
    } catch (error) {
      console.error("Worker login error:", error);

      localStorage.removeItem("worker");
      localStorage.removeItem("worker_id");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020817] p-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8"
      >
        <h1 className="mb-2 text-center text-4xl font-bold">
          Worker Login
        </h1>

        <p className="mb-8 text-center text-gray-400">
          Sign in to access your dashboard
        </p>

        <div className="space-y-5">
          <input
            type="email"
            value={loginId}
            onChange={(event) =>
              setLoginId(event.target.value)
            }
            placeholder="Worker email / Login ID"
            disabled={loading}
            autoComplete="email"
            required
            className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-4 text-white outline-none placeholder:text-gray-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Password"
            disabled={loading}
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-4 text-white outline-none placeholder:text-gray-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {errorMessage && (
            <div className="rounded-xl bg-red-500/10 p-4 text-red-300">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-500 px-6 py-4 font-bold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </main>
  );
}