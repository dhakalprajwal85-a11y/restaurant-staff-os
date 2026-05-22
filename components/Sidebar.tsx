import LogoutButton from "@/components/LogoutButton";
export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#111827] border-r border-white/10 p-6">
      
      <h1 className="text-2xl font-bold text-green-400 mb-10">
        앞산큰골집
      </h1>

      <nav className="space-y-4">

        <a
          href="/"
          className="block text-green-400 font-medium"
        >
          Dashboard
        </a>

        <a
          href="/workers"
          className="block text-gray-400 hover:text-white transition"
        >
          Workers
        </a>

        <a
          href="/schedule"
          className="block text-gray-400 hover:text-white transition"
        >
          Schedule
        </a>

        <a
          href="/attendance"
          className="block text-gray-400 hover:text-white transition"
        >
          Attendance
        </a>

        <a
          href="/settings"
          className="block text-gray-400 hover:text-white transition"
        >
          Settings
        </a>
 <LogoutButton />
      </nav>

    </aside>
  );
}