import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const { data: workers } = await supabase
    .from("workers")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  const { data: schedules } = await supabase
    .from("schedules")
    .select(`
      *,
      workers (
        name
      )
    `)
    .order("work_date", { ascending: true })
    .order("start_time", { ascending: true });

  async function addSchedule(formData: FormData) {
    "use server";

    const worker_id = formData.get("worker_id") as string;
    const work_date = formData.get("work_date") as string;
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    const position = formData.get("position") as string;
    const note = formData.get("note") as string;

    await supabase.from("schedules").insert({
      worker_id,
      work_date,
      start_time,
      end_time,
      position,
      note,
    });
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Schedule</h1>

      <form
        action={addSchedule}
        className="bg-gray-900 p-6 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <select
          name="worker_id"
          required
          className="p-3 rounded bg-gray-800 border border-gray-700"
        >
          <option value="">Select worker</option>
          {workers?.map((worker) => (
            <option key={worker.id} value={worker.id}>
              {worker.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="work_date"
          required
          className="p-3 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="time"
          name="start_time"
          required
          className="p-3 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="time"
          name="end_time"
          required
          className="p-3 rounded bg-gray-800 border border-gray-700"
        />

        <input
          name="position"
          placeholder="Position"
          className="p-3 rounded bg-gray-800 border border-gray-700"
        />

        <input
          name="note"
          placeholder="Note"
          className="p-3 rounded bg-gray-800 border border-gray-700"
        />

        <button className="md:col-span-2 bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold">
          Add Schedule
        </button>
      </form>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Worker</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Note</th>
            </tr>
          </thead>

          <tbody>
            {schedules?.map((schedule) => (
              <tr key={schedule.id} className="border-t border-gray-800">
                <td className="p-3">{schedule.work_date}</td>
                <td className="p-3">{schedule.workers?.name}</td>
                <td className="p-3">
                  {schedule.start_time} - {schedule.end_time}
                </td>
                <td className="p-3">{schedule.position}</td>
                <td className="p-3">{schedule.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}