"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function WorkerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkWorkerLogin() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          localStorage.removeItem("worker");
          router.replace("/worker-login");
          return;
        }

        const savedWorker = localStorage.getItem("worker");

        if (!savedWorker) {
          const { data: worker, error: workerError } = await supabase
            .from("workers")
            .select(
              "id, auth_user_id, name, email, login_id, phone, position, hourly_wage, status, role"
            )
            .eq("auth_user_id", session.user.id)
            .single();

          if (
            workerError ||
            !worker ||
            worker.status !== "active"
          ) {
            await supabase.auth.signOut();
            localStorage.removeItem("worker");
            router.replace("/worker-login");
            return;
          }

          localStorage.setItem(
            "worker",
            JSON.stringify(worker)
          );
        } else {
          try {
            const worker = JSON.parse(savedWorker);

            if (
              worker.auth_user_id !== session.user.id ||
              worker.status !== "active"
            ) {
              await supabase.auth.signOut();
              localStorage.removeItem("worker");
              router.replace("/worker-login");
              return;
            }
          } catch {
            localStorage.removeItem("worker");
            router.replace("/worker-login");
            return;
          }
        }

        if (mounted) {
          setChecked(true);
        }
      } catch (error) {
        console.error("Worker session check failed:", error);

        localStorage.removeItem("worker");
        router.replace("/worker-login");
      }
    }

    checkWorkerLogin();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!checked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Loading...
      </main>
    );
  }

  return <>{children}</>;
}