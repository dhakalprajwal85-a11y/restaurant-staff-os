"use client";
import WorkerQRCode from "@/components/WorkerQRCode";
import ClockInButton from "@/components/ClockInButton";
import { useState } from "react";
import EditWorkerForm from "@/components/EditWorkerForm";
import DeleteWorkerButton from "@/components/DeleteWorkerButton";

type Worker = {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  status: string | null;
};

export default function WorkersList({ workers }: { workers: Worker[] }) {
  const [search, setSearch] = useState("");

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(search.toLowerCase()) ||
    worker.role?.toLowerCase().includes(search.toLowerCase()) ||
    worker.phone?.includes(search)
  );

  return (
    <>
      <input
        placeholder="Search workers..."
        className="w-full mb-6 bg-[#111827] border border-white/10 rounded-xl p-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-[#111827] border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-3">{worker.name}</h2>
            <p className="text-gray-400 mb-2">{worker.role}</p>
            <p className="text-gray-500">{worker.phone}</p>
            <p className="mt-3 text-sm text-green-400">
  Status: {worker.status || "active"}
</p>
            <WorkerQRCode workerId={worker.id} />
            <EditWorkerForm worker={worker} />
            <DeleteWorkerButton workerId={worker.id} />
            <ClockInButton workerId={worker.id} />
          </div>
        ))}
      </div>
    </>
  );
}