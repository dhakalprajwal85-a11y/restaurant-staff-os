"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";

export default function Sidebar() {
  const { t } = useLanguage();
  const [restaurantName, setRestaurantName] = useState("앞산큰골집");

  useEffect(() => {
    const loadRestaurantName = () => {
      const savedName = localStorage.getItem("restaurantName") || "앞산큰골집";
      setRestaurantName(savedName);
    };

    loadRestaurantName();

    window.addEventListener("settingsChanged", loadRestaurantName);

    return () => {
      window.removeEventListener("settingsChanged", loadRestaurantName);
    };
  }, []);

  return (
    <aside className="hidden md:block w-72 border-r border-white/10 p-6">
      <h1 className="text-2xl font-bold text-green-400 mb-10">
        {restaurantName}
      </h1>

      <nav className="space-y-4">
        <Link href="/" className="block text-green-400 font-medium">
          {t("dashboard")}
        </Link>

        <Link href="/workers" className="block text-gray-400 hover:text-white transition">
          {t("workers")}
        </Link>

        <Link href="/schedule" className="block text-gray-400 hover:text-white transition">
          {t("schedule")}
        </Link>

        <Link href="/attendance" className="block text-gray-400 hover:text-white transition">
          {t("attendance")}
        </Link>

        <Link href="/settings" className="block text-gray-400 hover:text-white transition">
          {t("settings")}
        </Link>

        <Link href="/tasks" className="block text-gray-400 hover:text-white transition">
          {t("tasks")}
        </Link>

        <LogoutButton />

        <div className="mt-8">
          <LanguageSelector />
        </div>
      </nav>
    </aside>
  );
}