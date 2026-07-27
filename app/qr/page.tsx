"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

export default function QRPage() {
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    );

    scannerRef.current.render(
      async (decodedText) => {
        if (processingRef.current) return;

        processingRef.current = true;
        setResult(decodedText);
        setMessage("Recording attendance...");

        const { error } = await supabase.from("attendance_logs").insert({
          worker_id: decodedText,
          clock_in: new Date().toISOString(),
          status: "working",
        });

        if (error) {
          console.error(error);
          setMessage(`Failed: ${error.message}`);
          processingRef.current = false;
          return;
        }

        setMessage("Attendance recorded successfully.");

        await scannerRef.current?.clear().catch(console.error);
      },
      () => {
        // Scanner continuously checks frames.
        // Ignore ordinary scan failures.
      }
    );

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold">QR Attendance</h1>

        <p className="mb-6 text-sm text-gray-600">
          Scan the worker QR code to record attendance.
        </p>

        <div id="qr-reader" className="overflow-hidden rounded-xl" />

        {result && (
          <div className="mt-5 rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">Scanned worker ID</p>
            <p className="font-semibold">{result}</p>
          </div>
        )}

        {message && (
          <p className="mt-4 text-center text-sm font-medium">{message}</p>
        )}
      </div>
    </main>
  );
}