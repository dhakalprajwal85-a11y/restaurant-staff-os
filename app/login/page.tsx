"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const { data, error } = await signUp(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    const user = data?.user;

    if (!user) {
      alert("Account created. Please check your email or login again.");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          role: "manager",
          full_name: email,
          worker_id: null,
          restaurant_id: null,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Manager account created!");
  }

  async function handleLogin() {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const loginResult = await signIn(email, password);

    if (loginResult.error) {
      alert("Wrong email or password");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Login failed. No user found.");
      return;
    }

    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, worker_id, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile, error: createProfileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          role: "manager",
          full_name: user.email ?? email,
          worker_id: null,
          restaurant_id: null,
        })
        .select("id, role, worker_id, full_name")
        .single();

      if (createProfileError || !newProfile) {
        alert(createProfileError?.message || "No role found for this account.");
        return;
      }

      profile = newProfile;
    }

    if (profileError && profileError.code !== "PGRST116") {
      alert(profileError.message);
      return;
    }

    if (profile.role === "manager") {
      window.location.href = "/dashboard";
      return;
    }

    if (profile.role === "worker") {
      window.location.href = "/worker-app";
      return;
    }

    alert("Invalid account role.");
  }

  return (
    <main className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8">Staff Login</h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-green-500 hover:bg-green-600 rounded-xl p-4 font-bold"
          >
            Login
          </button>

          <button
            onClick={handleSignUp}
            className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl p-4 font-bold"
          >
            Create Manager Account
          </button>
        </div>
      </div>
    </main>
  );
}