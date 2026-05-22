"use client";

import { supabase } from "@/lib/supabase";

export default function ClockInButton({
  workerId,
}: {
  workerId: string;
}) {

  async function clockIn() {

    const { error } = await supabase
      .from("attendance_logs")
      .insert({
        worker_id: workerId,
        clock_in: new Date().toISOString(),
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Clock In Successful");

    window.location.reload();
  }

  return (
    <button
      onClick={clockIn}
      className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-bold"
    >
      Clock In
    </button>
  );
}