import Link from "next/link";
import Sidebar from "@/components/Sidebar";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b1120] text-white flex">
      <Sidebar />
      {/* Main */}
      <section className="flex-1 p-10 overflow-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Welcome back, Staff
            </h2>
            <p className="text-gray-400 mt-1">
              Manage workers and daily operations
            </p>
          </div>
          <Link
           href="/qr"
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
            >
          QR Attendance
          </Link>

          <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-medium transition">
            Add Worker
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
            <h3 className="text-gray-400 mb-2">Active Staff</h3>
            <p className="text-4xl font-bold">12</p>
          </div>

          <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
            <h3 className="text-gray-400 mb-2">Today Sales</h3>
            <p className="text-4xl font-bold">₩1.2M</p>
          </div>

          <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
            <h3 className="text-gray-400 mb-2">Reservations</h3>
            <p className="text-4xl font-bold">18</p>
          </div>

        </div>

        {/* Attendance */}
        <div className="mt-8 bg-[#111827] rounded-2xl p-6 border border-white/10">
          
          <h3 className="text-2xl font-bold mb-6">
            Attendance
          </h3>

          <div className="flex items-center justify-between bg-[#1f2937] rounded-xl p-4">
            <div>
              <p className="text-gray-400">Entry Time</p>
              <p className="text-2xl font-bold">02:57 PM</p>
            </div>

            <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition">
              Clock In
            </button>
          </div>

        </div>

      </section>
    </main>
  );
}