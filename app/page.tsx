"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#0b1120] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              {t("welcomeBack")}
            </h2>
            <p className="text-gray-400 mt-1">
              {t("manageOperations")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/qr"
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
            >
              {t("qrAttendance")}
            </Link>

            <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-medium transition">
              {t("addWorker")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
            <h3 className="text-gray-400 mb-2">{t("activeStaff")}</h3>
            <p className="text-4xl font-bold">12</p>
          </div>

          <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
            <h3 className="text-gray-400 mb-2">{t("todaySales")}</h3>
            <p className="text-4xl font-bold">₩1.2M</p>
          </div>

          <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
            <h3 className="text-gray-400 mb-2">{t("reservations")}</h3>
            <p className="text-4xl font-bold">18</p>
          </div>
        </div>

        <div className="mt-8 bg-[#111827] rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-6">
            {t("attendance")}
          </h3>

          <div className="flex items-center justify-between bg-[#1f2937] rounded-xl p-4">
            <div>
              <p className="text-gray-400">{t("entryTime")}</p>
              <p className="text-2xl font-bold">02:57 PM</p>
            </div>

            <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition">
              {t("clockIn")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}