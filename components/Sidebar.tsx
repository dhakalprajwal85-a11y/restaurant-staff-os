"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";

export default function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const [restaurantName, setRestaurantName] = useState("앞산큰골집");

  useEffect(() => {
    function loadRestaurantName() {
      const savedName =
        localStorage.getItem("restaurantName") || "앞산큰골집";

      setRestaurantName(savedName);
    }

    loadRestaurantName();

    window.addEventListener("settingsChanged", loadRestaurantName);

    return () => {
      window.removeEventListener("settingsChanged", loadRestaurantName);
    };
  }, []);

  const linkClass = (path: string) =>
    `block rounded-lg px-4 py-3 transition ${
      pathname === path
        ? "bg-green-500/20 text-green-400 font-semibold"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="hidden md:flex md:flex-col w-72 min-h-screen border-r border-white/10 bg-[#020817] p-6 text-white">
      <h1 className="mb-10 text-2xl font-bold text-green-400">
        {restaurantName}
      </h1>

      <nav className="flex flex-1 flex-col gap-2">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          {t("dashboard")}
        </Link>

        <Link href="/workers" className={linkClass("/workers")}>
          {t("workers")}
        </Link>

        <Link href="/schedule" className={linkClass("/schedule")}>
          {t("schedule")}
        </Link>

        <Link href="/attendance" className={linkClass("/attendance")}>
          {t("attendance")}
        </Link>

        <Link href="/tasks" className={linkClass("/tasks")}>
          {t("tasks")}
        </Link>

        <Link href="/payroll" className={linkClass("/payroll")}>
          {t("payroll")}
        </Link>

        <Link href="/settings" className={linkClass("/settings")}>
          {t("settings")}
        </Link>

        <div className="mt-8">
          <LogoutButton />
        </div>

        <div className="mt-auto pt-6">
          <LanguageSelector />
        </div>
      </nav>
    </aside>
  );
}