"use client";

import { supabase } from "@/lib/supabase";

export default function ClockOutButton({
  logId,
}: {
  logId: string;
}) {
  async function clockOut() {
    const { error } = await supabase
      .from("attendance_logs")
      .update({
        clock_out: new Date().toISOString(),
      })
      .eq("id", logId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Clock Out Successful");
    window.location.reload();
  }

  return (
    <button
      onClick={clockOut}
      className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-bold"
    >
      Clock Out
    </button>
  );
}