"use client";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111827] border-t border-white/10 flex justify-around py-3 md:hidden">
      <a href="/" className="text-xs text-gray-300">Home</a>
      <a href="/workers" className="text-xs text-gray-300">Workers</a>
      <a href="/attendance" className="text-xs text-gray-300">Attend</a>
      <a href="/tasks" className="text-xs text-gray-300">Tasks</a>
      <a href="/schedule" className="text-xs text-gray-300">Schedule</a>
    </nav>
  );
}