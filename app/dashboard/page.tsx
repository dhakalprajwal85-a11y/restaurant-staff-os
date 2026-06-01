"use client";

import { useEffect, useState } from "react";
import { translations, Language } from "@/lib/i18n";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
export default  function DashboardPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
  async function loadData() {
    const { data: workersData } = await supabase.from("workers").select("*");
    const { data: attendanceData } = await supabase.from("attendance_logs").select("*");
    const { data: schedulesData } = await supabase.from("schedules").select("*");

    setWorkers(workersData || []);
    setAttendance(attendanceData || []);
    setSchedules(schedulesData || []);
  }

  loadData();
}, []);
  const totalWorkers = workers?.length || 0;

  const activeWorkers =
    workers?.filter((worker) => worker.status === "active").length || 0;

  const todayAttendance = attendance?.length || 0;

  const todaySchedules = schedules?.length || 0;
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem("language") as Language) || "en";

    setLanguage(savedLanguage);
  }, []);

  const t = translations[language];
  return (
    <main className="min-h-screen bg-[#020817] text-white flex">

      <Sidebar />

      <section className="flex-1 p-10">

        <h1 className="text-5xl font-bold mb-10">
          {t.dashboardTitle}
        </h1>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <Link
          href="/qr"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg mb-6"
          >
            📱 {t.qrAttendance}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">
              {t.totalWorkers}
            </p>
            <h2 className="text-5xl font-bold mt-4">
              {totalWorkers}
            </h2>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">
              {t.activeWorkers}
            </p>

            <h2 className="text-5xl font-bold mt-4 text-green-400">
              {activeWorkers}
            </h2>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">
              {t.attendanceLogs}
            </p>

            <h2 className="text-5xl font-bold mt-4 text-blue-400">
              {todayAttendance}
            </h2>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">
              {t.scheduledShifts}
            </p>

            <h2 className="text-5xl font-bold mt-4 text-yellow-400">
              {todaySchedules}
            </h2>
          </div>

        </div>

      </section>

    </main>
  );
}