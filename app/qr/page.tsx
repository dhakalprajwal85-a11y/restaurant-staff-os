"use client";

import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { supabase } from "@/lib/supabase";

export default function QRPage() {
  const [result, setResult] = useState("");

  async function handleScan(workerName: string) {
    if (!workerName) return;

    setResult(workerName);
    const { error } = await supabase
      .from("attendance_logs")
      .insert({
        worker_id: workerName,
        clock_in: new Date().toISOString(),
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert(`${workerName} clocked in successfully`);
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        QR Attendance
      </h1>

      <div className="bg-[#111827] rounded-3xl p-6">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result) => {
            if (result) {
              handleScan(result.getText());
            }
          }}
          className="w-full"
        />

        <p className="mt-6 text-2xl">
          Last Scan: {result || "None"}
        </p>
      </div>
    </main>
  );
}