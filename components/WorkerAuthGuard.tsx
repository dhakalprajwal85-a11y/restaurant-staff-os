"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type WorkerAuthGuardProps = {
  children: ReactNode;
};

export default function WorkerAuthGuard({
  children,
}: WorkerAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkWorkerSession() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          localStorage.removeItem("worker");

          if (active) {
            router.replace("/worker-login");
          }

          return;
        }

        let worker = null;

        const savedWorker = localStorage.getItem("worker");

        if (savedWorker) {
          try {
            worker = JSON.parse(savedWorker);
          } catch {
            localStorage.removeItem("worker");
          }
        }

        if (!worker || worker.auth_user_id !== session.user.id) {
          const { data, error } = await supabase
            .from("workers")
            .select(
              "id, auth_user_id, name, email, login_id, phone, position, hourly_wage, status, role"
            )
            .eq("auth_user_id", session.user.id)
            .single();

          if (error || !data || data.status !== "active") {
            await supabase.auth.signOut();
            localStorage.removeItem("worker");

            if (active) {
              router.replace("/worker-login");
            }

            return;
          }

          worker = data;

          localStorage.setItem(
            "worker",
            JSON.stringify(data)
          );
        }

        if (worker.status !== "active") {
          await supabase.auth.signOut();
          localStorage.removeItem("worker");

          if (active) {
            router.replace("/worker-login");
          }

          return;
        }

        if (active) {
          setChecking(false);
        }
      } catch (error) {
        console.error("Worker authentication check failed:", error);

        localStorage.removeItem("worker");

        if (active) {
          router.replace("/worker-login");
        }
      }
    }

    checkWorkerSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_OUT" ||
        !session
      ) {
        localStorage.removeItem("worker");
        router.replace("/worker-login");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020817] text-white">
        <p className="text-lg text-gray-300">
          Checking worker account...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}