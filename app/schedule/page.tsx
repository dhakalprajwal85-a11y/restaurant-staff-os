import Sidebar from "@/components/Sidebar";
import AddScheduleForm from "@/components/AddScheduleForm";
import { supabase } from "@/lib/supabase";

export default async function SchedulePage() {
  const { data: workers } = await supabase.from("workers").select("id, name");

  const { data: schedules } = await supabase
    .from("schedules")
    .select(`
      *,
      workers (
        name
      )
    `)
    .order("shift_date", { ascending: true });

  return (
    <main className="min-h-screen bg-[#020817] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <h1 className="text-5xl font-bold mb-10">Schedule</h1>

        <AddScheduleForm workers={workers || []} />

        <div className="space-y-4">
          {schedules?.map((schedule: any) => (
            <div
              key={schedule.id}
              className="bg-[#111827] border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold">
                {schedule.workers?.name}
              </h2>

              <p className="text-green-400 mt-2">
                Date: {schedule.shift_date}
              </p>

              <p className="text-gray-300">
                Time: {schedule.start_time} - {schedule.end_time}
              </p>

              {schedule.note && (
                <p className="text-gray-400 mt-2">
                  Note: {schedule.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}