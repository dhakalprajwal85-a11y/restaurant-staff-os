"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import ClockOutButton from "@/components/ClockOutButton";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";



export default function AttendancePage() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("attendance_logs")
        .select(`
          *,
          workers (
            name
          )
        `)
        .order("clock_in", { ascending: false });

      setLogs(data || []);
    };

    fetchLogs();
  }, []);

  return (
    <main className="min-h-screen bg-[#020817] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <h1 className="text-5xl font-bold mb-10">
          {t("attendance")}
        </h1>

        <div className="space-y-4">
          {logs?.map((log) => (
            <div
              key={log.id}
              className="bg-[#0f172a] border border-white/10 rounded-3xl p-6"
            >
              <h2 className="text-2xl font-bold">
                {log.workers?.name}
              </h2>

              <p className="text-green-400 mt-2">
                {t("clockIn")}:
              </p>

              <p className="text-gray-300">
                {new Date(log.clock_in).toLocaleString()}
              </p>

              <p className="text-red-400 mt-4">
                {t("clockOut")}:
              </p>

              <p className="text-gray-300">
                {log.clock_out
                  ? new Date(log.clock_out).toLocaleString()
                  : "-"}
              </p>

              {!log.clock_out && <ClockOutButton logId={log.id} />}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}