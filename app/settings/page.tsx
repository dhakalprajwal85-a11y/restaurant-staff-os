"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useLanguage } from "@/lib/i18n";

export default function SettingsPage() {
  const { t } = useLanguage();

  const [restaurantName, setRestaurantName] = useState("앞산큰골집");
  const [currency, setCurrency] = useState("KRW");
  const [openingTime, setOpeningTime] = useState("10:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [hourlyWage, setHourlyWage] = useState("10030");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRestaurantName(localStorage.getItem("restaurantName") || "앞산큰골집");
    setCurrency(localStorage.getItem("currency") || "KRW");
    setOpeningTime(localStorage.getItem("openingTime") || "10:00");
    setClosingTime(localStorage.getItem("closingTime") || "22:00");
    setHourlyWage(localStorage.getItem("hourlyWage") || "10030");
  }, []);

  const saveSettings = () => {
    localStorage.setItem("restaurantName", restaurantName);
    localStorage.setItem("currency", currency);
    localStorage.setItem("openingTime", openingTime);
    localStorage.setItem("closingTime", closingTime);
    localStorage.setItem("hourlyWage", hourlyWage);
    window.dispatchEvent(new Event("settingsChanged"));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#0b1120] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-2">{t("settings")}</h1>
        <p className="text-gray-400 mb-8">{t("settingsDescription")}</p>

        <div className="max-w-3xl bg-[#111827] border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">
              {t("restaurantName")}
            </label>
            <input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              {t("currency")}
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 outline-none"
            >
              <option value="KRW">KRW - Korean Won</option>
              <option value="USD">USD - Dollar</option>
              <option value="NPR">NPR - Nepali Rupee</option>
              <option value="VND">VND - Vietnamese Dong</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-300 mb-2">
                {t("openingTime")}
              </label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                {t("closingTime")}
              </label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              {t("defaultHourlyWage")}
            </label>
            <input
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <button
            onClick={saveSettings}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            {t("saveSettings")}
          </button>

          {saved && (
            <p className="text-green-400 font-medium">
              {t("settingsSaved")}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}