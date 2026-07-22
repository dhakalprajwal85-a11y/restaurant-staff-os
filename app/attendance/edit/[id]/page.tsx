"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditAttendancePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [log, setLog] = useState<any>(null);
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLog();
  }, []);

  async function loadLog() {
    const { data, error } = await supabase
      .from("attendance_logs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setLog(data);
    setClockIn(toInputTime(data.clock_in));
    setClockOut(toInputTime(data.clock_out));
    setLoading(false);
  }

  function toInputTime(date: string | null) {
    if (!date) return "";

    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  }

  function calculateMinutes(start: string, end: string) {
    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return Math.floor(
      (endDate.getTime() - startDate.getTime()) / 60000
    );
  }

  async function saveChanges() {
    const totalMinutes = calculateMinutes(clockIn, clockOut);

    const { error } = await supabase
      .from("attendance_logs")
      .update({
        clock_in: clockIn ? new Date(clockIn).toISOString() : null,
        clock_out: clockOut ? new Date(clockOut).toISOString() : null,
        total_minutes: totalMinutes,
        status: clockOut ? "completed" : "working",
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update attendance.");
      console.error(error);
      return;
    }

    router.push("/attendance");
  }

  if (loading) {
    return <div className="p-8">Loading attendance log...</div>;
  }

  if (!log) {
    return <div className="p-8">Attendance log not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">Edit Attendance</h1>
        <p className="mb-6 text-gray-500">
          Fix clock in and clock out time manually.
        </p>

        <div className="mb-5">
          <p className="mb-1 text-sm font-semibold text-gray-600">Worker</p>
          <p className="rounded-xl bg-gray-100 p-3">
            {log.worker_name || "Unknown Worker"}
          </p>
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-sm font-semibold text-gray-600">
            Clock In
          </label>
          <input
            type="datetime-local"
            value={clockIn}
            onChange={(e) => setClockIn(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-sm font-semibold text-gray-600">
            Clock Out
          </label>
          <input
            type="datetime-local"
            value={clockOut}
            onChange={(e) => setClockOut(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveChanges}
            className="flex-1 rounded-xl bg-black p-3 font-semibold text-white hover:bg-gray-800"
          >
            Save Changes
          </button>

          <button
            onClick={() => router.push("/attendance")}
            className="flex-1 rounded-xl bg-gray-100 p-3 font-semibold text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}