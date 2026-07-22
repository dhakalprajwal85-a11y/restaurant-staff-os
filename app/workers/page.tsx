import WorkersClient from "@/components/WorkersClient";
import WorkersList from "@/components/WorkersList";
import AddWorkerForm from "@/components/AddWorkerForm";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function WorkersPage() {
  const { data: workers, error } = await supabase
    .from("workers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Workers load error:", error.message);
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold">Workers</h1>
            <p className="text-gray-400 mt-2">
              Manage restaurant employees, positions, wages, and profiles.
            </p>
          </div>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Worker</h2>
          <AddWorkerForm />
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
          <WorkersClient />

          <div className="mt-6">
            <WorkersList workers={workers || []} />
          </div>
        </div>
      </section>
    </main>
  );
}