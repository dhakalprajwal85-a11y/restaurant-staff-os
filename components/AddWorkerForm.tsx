"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddWorkerForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [hourlyWage, setHourlyWage] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Worker name is required.");
      return;
    }

    if (!loginId.trim()) {
      setMessage("Login ID is required.");
      return;
    }

    if (!password.trim()) {
      setMessage("Password is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/create-worker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          position: position.trim(),
          phone: phone.trim(),
          hourly_wage: hourlyWage ? Number(hourlyWage) : null,
          login_id: loginId.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add worker.");
      }

      setName("");
      setPosition("");
      setPhone("");
      setHourlyWage("");
      setLoginId("");
      setPassword("");

      setMessage("Worker added successfully.");

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to add worker."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Worker name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter worker name"
          className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Position
        </label>

        <input
          type="text"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          placeholder="Example: Server, Cook, Manager"
          className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Phone number
        </label>

        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Enter phone number"
          className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Hourly wage
        </label>

        <input
          type="number"
          min="0"
          step="1"
          value={hourlyWage}
          onChange={(event) => setHourlyWage(event.target.value)}
          placeholder="Enter hourly wage"
          className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Login ID
          </label>

          <input
            type="text"
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            placeholder="Worker login ID"
            className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Worker password"
            className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500"
            required
          />
        </div>
      </div>

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            message.includes("successfully")
              ? "bg-green-500/10 text-green-300"
              : "bg-red-500/10 text-red-300"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding Worker..." : "Add Worker"}
      </button>
    </form>
  );
}