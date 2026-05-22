"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created!");
  }
async function handleLogin() {
  console.log("login clicked");

  const response = await signIn(email, password);

  console.log(response);

  if (response.error) {
    alert(response.error.message);
    return;
  }

  window.location.href = "/";
}
  return (
    <main className="min-h-screen bg-[#020817] flex items-center justify-center text-white">

      <div className="bg-[#111827] border border-white/10 rounded-2xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold mb-8">
          Staff Login
        </h1>

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
            Create Account
          </button>

        </div>

      </div>

    </main>
  );
}