"use client";

import { useEffect, useState } from "react";

export default function WorkerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const workerId = localStorage.getItem("worker_id");

    if (!workerId) {
      window.location.href = "/worker-login";
      return;
    }

    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return <>{children}</>;
}