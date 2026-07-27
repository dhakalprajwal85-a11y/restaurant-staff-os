"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CreateWorkerResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  workerId?: string;
  userId?: string;
};

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
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanLoginId = loginId.trim().toLowerCase();
    const cleanPassword = password;

    setMessage("");
    setIsSuccess(false);

    if (!cleanName) {
      setMessage("Worker name is required.");
      return;
    }

    if (!cleanLoginId) {
      setMessage("Login ID is required.");
      return;
    }

    if (!cleanLoginId.includes("@")) {
      setMessage("Login ID must be a valid email address.");
      return;
    }

    if (!cleanPassword) {
      setMessage("Password is required.");
      return;
    }

    if (cleanPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/create-worker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanLoginId,
          password: cleanPassword,
          phone: phone.trim(),
          position: position.trim(),
          hourlyWage:
            hourlyWage.trim() === ""
              ? null
              : Number(hourlyWage),
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const responseText = await response.text();

        console.error(
          "Unexpected create-worker response:",
          responseText
        );

        throw new Error(
          `The server returned an invalid response (${response.status}).`
        );
      }

      const result =
        (await response.json()) as CreateWorkerResponse;

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to add worker."
        );
      }

      setName("");
      setPosition("");
      setPhone("");
      setHourlyWage("");
      setLoginId("");
      setPassword("");

      setIsSuccess(true);
      setMessage(
        result.message || "Worker added successfully."
      );

      router.refresh();
    } catch (error) {
      console.error("Add worker error:", error);

      setIsSuccess(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to add worker."
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
          disabled={loading}
          required
          className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Position
        </label>

        <input
          type="text"
          value={position}
          onChange={(event) =>
            setPosition(event.target.value)
          }
          placeholder="Example: Server, Cook, Manager"
          disabled={loading}
          className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
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
          disabled={loading}
          className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
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
          onChange={(event) =>
            setHourlyWage(event.target.value)
          }
          placeholder="Enter hourly wage"
          disabled={loading}
          className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Login ID
          </label>

          <input
            type="email"
            value={loginId}
            onChange={(event) =>
              setLoginId(event.target.value)
            }
            placeholder="Worker email / login ID"
            disabled={loading}
            required
            className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Worker password"
            disabled={loading}
            minLength={6}
            required
            className="w-full rounded-xl border border-white/10 bg-[#020817] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            isSuccess
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