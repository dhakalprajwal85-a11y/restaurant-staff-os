"use client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import { translations, Language } from "@/lib/i18n";

export default function Sidebar() {
  const [language, setLanguage] = useState<Language>("en");

useEffect(() => {
  const savedLanguage = localStorage.getItem("language") as Language;

  if (savedLanguage) {
    setLanguage(savedLanguage);
  }
}, []);

const t = translations[language];
  return (
   <aside className="hidden md:block w-72 border-r border-white/10 p-6">
      
      <h1 className="text-2xl font-bold text-green-400 mb-10">
        앞산큰골집
      </h1>

      <nav className="space-y-4">

        <Link
          href="/"
          className="block text-green-400 font-medium"
        >
           {t.dashboard}
        </Link>

        <Link
          href="/workers"
          className="block text-gray-400 hover:text-white transition"
        >
          {t.workers}
        </Link>

        <Link
          href="/schedule"
          className="block text-gray-400 hover:text-white transition"
        >
          {t.schedule}
        </Link>

        <Link
          href="/attendance"
          className="block text-gray-400 hover:text-white transition"
        >
          {t.attendance}
        </Link>

        <Link
          href="/settings"
          className="block text-gray-400 hover:text-white transition"
        >
          Settings
        </Link>
        <Link
          href="/tasks"
          className="block text-gray-400 hover:text-white transition"
        >
          {t.tasks}
        </Link>
        <LogoutButton />
        <div className="mt-8">
          <LanguageSelector />
        </div>
      </nav>

    </aside>
  );
}