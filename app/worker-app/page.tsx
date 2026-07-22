"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WorkerAppPage() {
  const router = useRouter();
  const [workerName, setWorkerName] = useState("");

  useEffect(() => {
    const workerId = localStorage.getItem("worker_id");
    const name = localStorage.getItem("worker_name");

    if (!workerId) {
      router.push("/worker-login");
      return;
    }

    setWorkerName(name || "Worker");
  }, [router]);

  return (
    <div className="px-5 pt-8 text-white">
      <div className="mb-8">
        <p className="text-gray-400">Welcome back 👋</p>

        <h1 className="text-3xl font-bold mt-2">{workerName}</h1>

        <p className="text-gray-500 mt-1">Have a great shift today!</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-6 mb-6">
        <p className="text-green-100">Today's Shift</p>

        <h2 className="text-4xl font-bold mt-2">09:00 - 18:00</h2>

        <p className="mt-3 text-green-100">Status: Not Checked In</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400">Tasks</p>
          <h2 className="text-3xl font-bold mt-2">0</h2>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400">Completed</p>
          <h2 className="text-3xl font-bold mt-2">0</h2>
        </div>
      </div>

      <button
        onClick={() => router.push("/worker-app/attendance")}
        className="w-full bg-green-500 hover:bg-green-600 rounded-2xl p-5 font-bold mb-6"
      >
        Clock In / Clock Out
      </button>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => router.push("/worker-app/tasks")}
          className="bg-[#111827] border border-white/10 rounded-2xl p-5 text-left"
        >
          My Tasks
        </button>

        <button
          onClick={() => router.push("/worker-app/schedule")}
          className="bg-[#111827] border border-white/10 rounded-2xl p-5 text-left"
        >
          My Schedule
        </button>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
        <h2 className="text-xl font-bold mb-3">Announcement</h2>
        <p className="text-gray-400">No announcements today.</p>
      </div>
    </div>
  );
}