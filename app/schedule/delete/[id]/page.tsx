"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DeleteSchedulePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSchedule();
  }, []);

  async function loadSchedule() {
    const { data, error } = await supabase
      .from("schedules")
      .select(`
        *,
        workers (
          name
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      alert("Schedule not found.");
      router.push("/schedule");
      return;
    }

    setSchedule(data);
    setLoading(false);
  }

  async function deleteSchedule() {
    const confirmed = window.confirm("Are you sure you want to delete this shift?");

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase
      .from("schedules")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      console.error(error);
      setDeleting(false);
      return;
    }

    router.push("/schedule");
  }

  if (loading) {
    return <div className="p-8">Loading schedule...</div>;
  }

  return (
    <main className="min-h-screen bg-[#020817] p-8 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#111827] p-8">
        <h1 className="mb-3 text-4xl font-bold text-red-400">
          Delete Schedule
        </h1>

        <p className="mb-8 text-gray-400">
          This action cannot be undone.
        </p>

        <div className="mb-8 rounded-2xl border border-white/10 bg-[#020817] p-5">
          <p className="mb-2 text-sm text-gray-400">Worker</p>
          <h2 className="text-2xl font-bold">
            {schedule.workers?.name || schedule.worker_name || "Unknown Worker"}
          </h2>

          <div className="mt-5 space-y-2 text-gray-300">
            <p>Date: {schedule.shift_date}</p>
            <p>
              Time: {schedule.start_time} - {schedule.end_time}
            </p>

            {schedule.position && <p>Position: {schedule.position}</p>}
            {schedule.note && <p>Note: {schedule.note}</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={deleteSchedule}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-500 p-4 font-bold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

          <button
            onClick={() => router.push("/schedule")}
            className="flex-1 rounded-xl bg-white/10 p-4 font-bold text-white hover:bg-white/20"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}