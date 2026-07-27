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
    <main className="flex min-h-screen bg-[#020817] text-white">
      <Sidebar />

      <section className="min-w-0 flex-1 px-4 py-6 sm:p-8 lg:p-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Workers
          </h1>

          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Manage restaurant employees, positions, wages, and profiles.
          </p>
        </div>

        {/* Add worker expandable form */}
        <details className="group mb-8 overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
          <summary className="flex cursor-pointer list-none items-center justify-between p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Add New Worker
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Tap here to open the worker form.
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white transition-transform group-open:rotate-45">
              +
            </span>
          </summary>

          <div className="border-t border-white/10 p-5 sm:p-6">
            <AddWorkerForm />
          </div>
        </details>

        {/* Workers list */}
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Current Workers
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              View and manage registered employees.
            </p>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              Failed to load workers: {error.message}
            </div>
          ) : (
            <WorkersList workers={workers ?? []} />
          )}
        </div>
      </section>
    </main>
  );
}