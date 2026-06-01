"use client";

import { useEffect, useState } from "react";
import { translations, Language } from "@/lib/i18n";

export default function WorkersClient() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const t = translations[language];

  return (
    <>
      <h1 className="text-5xl font-bold">{t.workersTitle}</h1>

      <button className="bg-green-500 px-6 py-4 rounded-xl font-bold">
        {t.addWorker}
      </button>
    </>
  );
}