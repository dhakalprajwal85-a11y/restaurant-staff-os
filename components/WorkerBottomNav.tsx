"use client";

import { Home, CheckSquare, Calendar, Clock, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function WorkerBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/worker-app",
      icon: Home,
    },
    {
      name: "Tasks",
      href: "/worker-app/tasks",
      icon: CheckSquare,
    },
    {
      name: "Schedule",
      href: "/worker-app/schedule",
      icon: Calendar,
    },
    {
      name: "Attendance",
      href: "/worker-app/attendance",
      icon: Clock,
    },
    {
      name: "Profile",
      href: "/worker-app/profile",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950 pb-safe">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center transition-colors duration-200 ${
                active
                  ? "text-green-400"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Icon size={22} strokeWidth={2} />
              <span className="mt-1 text-[11px] font-medium">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}