"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const { t } = useLanguage();

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

  const totalWorkers = workers.length;
  const activeWorkers = workers.filter((worker) => worker.status === "active").length;
  const todayAttendance = attendance.length;
  const todaySchedules = schedules.length;

  return (
    <main className="min-h-screen bg-[#020817] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              {t("dashboardTitle")}
            </h1>

            <p className="text-gray-400">
              {t("dashboardSubtitle")}
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/qr"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold"
            >
              📱 {t("qrAttendance")}
            </Link>

            <Link
              href="/workers"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-bold"
            >
              {t("addWorker")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">{t("totalWorkers")}</p>
            <h2 className="text-5xl font-bold mt-4">{totalWorkers}</h2>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">{t("activeWorkers")}</p>
            <h2 className="text-5xl font-bold mt-4 text-green-400">
              {activeWorkers}
            </h2>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">{t("attendanceLogs")}</p>
            <h2 className="text-5xl font-bold mt-4 text-blue-400">
              {todayAttendance}
            </h2>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">{t("scheduledShifts")}</p>
            <h2 className="text-5xl font-bold mt-4 text-yellow-400">
              {todaySchedules}
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}