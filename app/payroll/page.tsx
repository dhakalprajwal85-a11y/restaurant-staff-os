"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";

export default function PayrollPage() {
  const { t } = useLanguage();

  const [logs, setLogs] = useState<any[]>([]);
  const [hourlyWage, setHourlyWage] = useState(10030);
  const [currency, setCurrency] = useState("KRW");

  useEffect(() => {
    const savedWage = Number(localStorage.getItem("hourlyWage")) || 10030;
    const savedCurrency = localStorage.getItem("currency") || "KRW";

    setHourlyWage(savedWage);
    setCurrency(savedCurrency);

    const fetchLogs = async () => {
      const { data } = await supabase
        .from("attendance_logs")
        .select(`
          *,
          workers (
            name
          )
        `)
        .not("clock_out", "is", null)
        .order("clock_in", { ascending: false });

      setLogs(data || []);
    };

    fetchLogs();
  }, []);

  const payrollByWorker = logs.reduce((acc: any, log) => {
    const workerName = log.workers?.name || "Unknown Worker";

    const clockIn = new Date(log.clock_in);
    const clockOut = new Date(log.clock_out);

    const hours =
      (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

    if (!acc[workerName]) {
      acc[workerName] = {
        name: workerName,
        totalHours: 0,
        salary: 0,
      };
    }

    acc[workerName].totalHours += hours;
    acc[workerName].salary += hours * hourlyWage;

    return acc;
  }, {});

  const payrollList = Object.values(payrollByWorker);

  return (
    <main className="min-h-screen bg-[#0b1120] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-2">
          {t("payroll")}
        </h1>

        <p className="text-gray-400 mb-8">
          {t("payrollDescription")}
        </p>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-4 text-gray-400 border-b border-white/10 pb-4 mb-4">
            <p>{t("workerName")}</p>
            <p>{t("totalHours")}</p>
            <p>{t("hourlyWage")}</p>
            <p>{t("estimatedSalary")}</p>
          </div>

          {payrollList.length === 0 && (
            <p className="text-gray-400">
              {t("noPayrollData")}
            </p>
          )}

          {payrollList.map((worker: any) => (
            <div
              key={worker.name}
              className="grid grid-cols-4 py-4 border-b border-white/5"
            >
              <p className="font-semibold">{worker.name}</p>

              <p>
                {worker.totalHours.toFixed(2)} {t("hours")}
              </p>

              <p>
                {currency} {hourlyWage.toLocaleString()}
              </p>

              <p className="text-green-400 font-bold">
                {currency} {Math.round(worker.salary).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}