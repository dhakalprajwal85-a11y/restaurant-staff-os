"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Worker = {
  id: string;
  name: string;
};

export default function AddScheduleForm({ workers }: { workers: Worker[] }) {
  const [workerId, setWorkerId] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");

  async function addSchedule() {
    if (!workerId || !shiftDate || !startTime || !endTime) {
      alert("Please fill all required fields");
      return;
    }

    const { error } = await supabase.from("schedules").insert({
      worker_id: workerId,
      shift_date: shiftDate,
      start_time: startTime,
      end_time: endTime,
      note,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Schedule added");
    window.location.reload();
  }

  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Add Shift</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="bg-[#020817] border border-white/10 rounded-xl p-3"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
        >
          <option value="">Select Worker</option>
          {workers.map((worker) => (
            <option key={worker.id} value={worker.id}>
              {worker.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="bg-[#020817] border border-white/10 rounded-xl p-3"
          value={shiftDate}
          onChange={(e) => setShiftDate(e.target.value)}
        />

        <input
          type="time"
          className="bg-[#020817] border border-white/10 rounded-xl p-3"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          className="bg-[#020817] border border-white/10 rounded-xl p-3"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <input
          placeholder="Note"
          className="bg-[#020817] border border-white/10 rounded-xl p-3 md:col-span-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button
        onClick={addSchedule}
        className="mt-4 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold"
      >
        Save Shift
      </button>
    </div>
  );
}