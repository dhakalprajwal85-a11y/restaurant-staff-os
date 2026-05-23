import BottomNav from "@/components/BottomNav";
import WorkersList from "@/components/WorkersList";
import EditWorkerForm from "@/components/EditWorkerForm";
import DeleteWorkerButton from "@/components/DeleteWorkerButton";
import AddWorkerForm from "@/components/AddWorkerForm";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function WorkersPage() {
  const { data: workers, error } = await supabase
    .from("workers")
    .select("*");

  console.log(workers);
  console.log(error);

  return (
    <main className="min-h-screen bg-[#020817] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl font-bold">Workers</h1>

          <button className="bg-green-500 px-6 py-4 rounded-2xl font-bold">
            Add Worker
          </button>
        </div>
        <AddWorkerForm />
        <WorkersList workers={workers || []} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workers?.map((worker) => (
            <div
              key={worker.id}
              className="bg-[#111827] border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-3">
                {worker.name}
              </h2>

              <p className="text-gray-400 mb-2">
                {worker.role}
              </p>

              <p className="text-gray-500">
                {worker.phone}
              </p>
              <EditWorkerForm worker={worker} />
              <DeleteWorkerButton workerId={worker.id} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}