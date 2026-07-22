"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkerBottomNav from "@/components/WorkerBottomNav";
import { supabase } from "@/lib/supabase";

export default function WorkerSchedulePage() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedWorker = localStorage.getItem("worker");
const workerId = localStorage.getItem("worker_id");
const workerName = localStorage.getItem("worker_name");

if (savedWorker) {
  const parsedWorker = JSON.parse(savedWorker);
  setWorker(parsedWorker);
  fetchSchedules(parsedWorker.id);
  return;
}

if (workerId && workerName) {
  const workerData = {
    id: workerId,
    name: workerName,
  };

  setWorker(workerData);
  fetchSchedules(workerId);
  return;
}

router.push("/worker-login");
  }, [router]);

  async function fetchSchedules(workerId: string) {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("worker_id", workerId)
      .order("work_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      alert(error.message);
    } else {
      setSchedules(data || []);
    }

    setLoading(false);
  }

  if (!worker) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      <div className="px-5 pt-8">
        <div className="mb-6">
          <p className="text-gray-400">My Schedule</p>
          <h1 className="text-2xl font-bold">{worker.name}</h1>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading schedule...</p>
        ) : schedules.length === 0 ? (
          <div className="rounded-2xl bg-gray-900 p-5 text-center text-gray-400">
            No schedule assigned yet.
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-2xl bg-gray-900 p-5 border border-gray-800"
              >
                <p className="text-lg font-bold">{schedule.work_date}</p>

                <p className="mt-2 text-gray-300">
                  {schedule.start_time} - {schedule.end_time}
                </p>

                {schedule.position && (
                  <p className="mt-2 text-sm text-blue-400">
                    Position: {schedule.position}
                  </p>
                )}

                {schedule.note && (
                  <p className="mt-2 text-sm text-gray-400">
                    Note: {schedule.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <WorkerBottomNav />
    </div>
  );
}