"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditSchedulePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [workers, setWorkers] = useState<any[]>([]);
  const [workerId, setWorkerId] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [position, setPosition] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: workersData } = await supabase
      .from("workers")
      .select("id, name")
      .order("name", { ascending: true });

    setWorkers(workersData || []);

    const { data: schedule, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !schedule) {
      alert("Schedule not found.");
      router.push("/schedule");
      return;
    }

    setWorkerId(schedule.worker_id || "");
    setShiftDate(schedule.shift_date || "");
    setStartTime(schedule.start_time?.slice(0, 5) || "");
    setEndTime(schedule.end_time?.slice(0, 5) || "");
    setPosition(schedule.position || "");
    setNote(schedule.note || "");
    setStatus(schedule.status || "scheduled");

    setLoading(false);
  }

  async function saveSchedule() {
    if (!workerId || !shiftDate || !startTime || !endTime) {
      alert("Worker, date, start time, and end time are required.");
      return;
    }

    const selectedWorker = workers.find((worker) => worker.id === workerId);

    const { error } = await supabase
      .from("schedules")
      .update({
        worker_id: workerId,
        worker_name: selectedWorker?.name || "",
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        position,
        note,
        status,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }

    router.push("/schedule");
  }

  if (loading) {
    return <div className="p-8">Loading schedule...</div>;
  }

  return (
    <main className="min-h-screen bg-[#020817] p-8 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#111827] p-8">
        <h1 className="mb-2 text-4xl font-bold">Edit Schedule</h1>
        <p className="mb-8 text-gray-400">
          Update worker shift information.
        </p>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Worker
            </label>

            <select
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#020817] p-4 text-white"
            >
              <option value="">Select worker</option>

              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Shift Date
            </label>

            <input
              type="date"
              value={shiftDate}
              onChange={(e) => setShiftDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#020817] p-4 text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-300">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#020817] p-4 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-300">
                End Time
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#020817] p-4 text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Position
            </label>

            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Kitchen, Hall, Cashier..."
              className="w-full rounded-xl border border-white/10 bg-[#020817] p-4 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#020817] p-4 text-white"
            >
              <option value="scheduled">Scheduled</option>
              <option value="working">Working</option>
              <option value="completed">Completed</option>
              <option value="absent">Absent</option>
              <option value="day_off">Day Off</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Note
            </label>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
              className="min-h-28 w-full rounded-xl border border-white/10 bg-[#020817] p-4 text-white"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={saveSchedule}
              className="flex-1 rounded-xl bg-green-500 p-4 font-bold text-white hover:bg-green-600"
            >
              Save Changes
            </button>

            <button
              onClick={() => router.push("/schedule")}
              className="flex-1 rounded-xl bg-white/10 p-4 font-bold text-white hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}