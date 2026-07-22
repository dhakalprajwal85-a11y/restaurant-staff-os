"use client";

import { useLanguage, Language } from "@/lib/i18n";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      className="mt-8 bg-[#020817] border border-white/10 rounded-xl p-3 text-white"
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
    >
      <option value="en">English</option>
      <option value="ko">한국어</option>
      <option value="vi">Tiếng Việt</option>
    </select>
  );
}