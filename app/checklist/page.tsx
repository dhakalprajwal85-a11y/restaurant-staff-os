import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import AddChecklistItemForm from "@/components/AddChecklistItemForm";
import ChecklistToggleButton from "@/components/ChecklistToggleButton";
import { supabase } from "@/lib/supabase";

export default async function ChecklistPage() {
  const { data: items } = await supabase
    .from("checklist_items")
    .select("*")
    .order("created_at", { ascending: false });

  const openingItems = items?.filter((item) => item.shift === "opening") || [];
  const closingItems = items?.filter((item) => item.shift === "closing") || [];

  return (
    <main className="min-h-screen bg-[#020817] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <h1 className="text-5xl font-bold mb-10">Checklist</h1>

        <AddChecklistItemForm />

        <h2 className="text-3xl font-bold mb-4">Opening</h2>
        <div className="space-y-4 mb-10">
          {openingItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center justify-between"
            >
              <p className={item.completed ? "line-through text-gray-500" : ""}>
                {item.title}
              </p>

              <ChecklistToggleButton
                itemId={item.id}
                completed={item.completed}
              />
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-4">Closing</h2>
        <div className="space-y-4">
          {closingItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center justify-between"
            >
              <p className={item.completed ? "line-through text-gray-500" : ""}>
                {item.title}
              </p>

              <ChecklistToggleButton
                itemId={item.id}
                completed={item.completed}
              />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}