"use client";

export default function LanguageSelector() {
  function changeLanguage(language: string) {
    localStorage.setItem("language", language);
    window.location.reload();
  }
  return (
    <select
      className="mt-8 bg-[#020817] border border-white/10 rounded-xl p-3 text-white"
      defaultValue={
        typeof window !== "undefined"
          ? localStorage.getItem("language") || "en"
          : "en"
      }
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="ko">한국어</option>
      <option value="vi">Tiếng Việt</option>
    </select>
  );
}