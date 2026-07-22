"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Worker = {
  id: string;
  name: string;
  login_id?: string;
};

type AttendanceRecord = {
  id: string;
  worker_id: string;
  worker_name: string | null;
  clock_in: string;
  clock_out: string | null;
  status: string;
  work_date: string;
  total_hours: number | null;
  created_at?: string;
};

export default function WorkerAttendancePage() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [activeAttendance, setActiveAttendance] =
    useState<AttendanceRecord | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  const loadAttendance = useCallback(
    async (workerId: string, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage("");

      try {
        const { data: activeRecord, error: activeError } = await supabase
          .from("attendance")
          .select("*")
          .eq("worker_id", workerId)
          .is("clock_out", null)
          .order("clock_in", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (activeError) {
          throw activeError;
        }

        const { data: historyData, error: historyError } = await supabase
          .from("attendance")
          .select("*")
          .eq("worker_id", workerId)
          .order("clock_in", { ascending: false })
          .limit(30);

        if (historyError) {
          throw historyError;
        }

        setActiveAttendance(activeRecord);
        setHistory(historyData ?? []);
      } catch (error: any) {
        console.error("Attendance load error:", error);

        setErrorMessage(
          error?.message || "Failed to load attendance information."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    const savedWorker = localStorage.getItem("worker");

    if (!savedWorker) {
      window.location.href = "/worker-login";
      return;
    }

    try {
      const parsedWorker = JSON.parse(savedWorker) as Worker;

      if (!parsedWorker.id || !parsedWorker.name) {
        throw new Error("Worker information is missing.");
      }

      setWorker(parsedWorker);
      loadAttendance(parsedWorker.id);
    } catch (error) {
      console.error("Worker storage error:", error);

      localStorage.removeItem("worker");
      window.location.href = "/worker-login";
    }
  }, [loadAttendance]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  async function handleClockIn() {
    if (!worker || activeAttendance || actionLoading) return;

    setActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const now = new Date();

      const { error } = await supabase.from("attendance").insert({
        worker_id: worker.id,
        worker_name: worker.name,
        clock_in: now.toISOString(),
        clock_out: null,
        status: "working",
        work_date: formatLocalDate(now),
        total_hours: null,
      });

      if (error) {
        throw error;
      }

      setSuccessMessage("Clock-in completed successfully.");
      await loadAttendance(worker.id);
    } catch (error: any) {
      console.error("Clock-in error:", error);

      setErrorMessage(error?.message || "Clock in failed.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClockOut() {
    if (!worker || !activeAttendance || actionLoading) return;

    setActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const clockOutTime = new Date();
      const clockInTime = new Date(activeAttendance.clock_in);

      const totalMilliseconds =
        clockOutTime.getTime() - clockInTime.getTime();

      const totalHours = Number(
        (totalMilliseconds / (1000 * 60 * 60)).toFixed(2)
      );

      const { error } = await supabase
        .from("attendance")
        .update({
          clock_out: clockOutTime.toISOString(),
          status: "completed",
          total_hours: totalHours,
        })
        .eq("id", activeAttendance.id)
        .eq("worker_id", worker.id);

      if (error) {
        throw error;
      }

      setSuccessMessage("Clock-out completed successfully.");
      await loadAttendance(worker.id);
    } catch (error: any) {
      console.error("Clock-out error:", error);

      setErrorMessage(error?.message || "Clock out failed.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRefresh() {
    if (!worker || refreshing) return;

    await loadAttendance(worker.id, true);
  }

  const workingDuration = useMemo(() => {
    if (!activeAttendance) return "00:00:00";

    const start = new Date(activeAttendance.clock_in).getTime();
    const end = currentTime.getTime();

    return formatDuration(Math.max(0, end - start));
  }, [activeAttendance, currentTime]);

  const todayTotalHours = useMemo(() => {
    const today = formatLocalDate(currentTime);

    const completedMinutes = history
      .filter(
        (record) =>
          record.work_date === today && record.clock_out !== null
      )
      .reduce((total, record) => {
        if (record.total_hours !== null) {
          return total + record.total_hours * 60;
        }

        if (!record.clock_out) return total;

        const start = new Date(record.clock_in).getTime();
        const end = new Date(record.clock_out).getTime();

        return total + (end - start) / (1000 * 60);
      }, 0);

    const activeMinutes = activeAttendance
      ? (currentTime.getTime() -
          new Date(activeAttendance.clock_in).getTime()) /
        (1000 * 60)
      : 0;

    return Math.max(0, completedMinutes + activeMinutes);
  }, [history, activeAttendance, currentTime]);

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 pb-28 pt-8">
      <div className="mx-auto max-w-xl">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Worker Attendance
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Hello, {worker?.name}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {formatFullDate(currentTime)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh attendance"
            className="rounded-2xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={20}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </header>

        {successMessage && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            <CheckCircle2 size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="bg-gray-900 px-6 py-7 text-white">
            <p className="text-sm text-gray-300">Current time</p>

            <p className="mt-1 text-4xl font-bold tracking-tight">
              {formatLiveTime(currentTime)}
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Current Status
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {activeAttendance ? "Working" : "Off Duty"}
                </h2>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activeAttendance
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {activeAttendance
                  ? "Clocked In"
                  : "Not Clocked In"}
              </span>
            </div>

            {activeAttendance && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Started
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    {formatTime(activeAttendance.clock_in)}
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                    Working for
                  </p>

                  <p className="mt-2 font-bold text-green-700">
                    {workingDuration}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={
                activeAttendance ? handleClockOut : handleClockIn
              }
              disabled={actionLoading}
              className={`mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                activeAttendance
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {actionLoading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Please wait...
                </>
              ) : activeAttendance ? (
                <>
                  <LogOut size={20} />
                  Clock Out
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Clock In
                </>
              )}
            </button>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <Clock3 size={22} className="text-blue-600" />

            <p className="mt-4 text-sm text-gray-500">
              Today’s Hours
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatHoursAndMinutes(todayTotalHours)}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <CheckCircle2 size={22} className="text-green-600" />

            <p className="mt-4 text-sm text-gray-500">
              Attendance Records
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {history.length}
            </p>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Attendance History
            </h2>

            <span className="text-sm text-gray-500">
              Last {history.length} records
            </span>
          </div>

          {history.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <Clock3
                size={34}
                className="mx-auto text-gray-300"
              />

              <p className="mt-4 font-medium text-gray-700">
                No attendance records yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your attendance will appear here after clocking in.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <AttendanceHistoryCard
                  key={record.id}
                  record={record}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function AttendanceHistoryCard({
  record,
}: {
  record: AttendanceRecord;
}) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-bold text-gray-900">
            {formatDate(record.work_date)}
          </p>

          <div className="mt-3 space-y-1 text-sm text-gray-500">
            <p>Clock in: {formatTime(record.clock_in)}</p>

            <p>
              Clock out:{" "}
              {record.clock_out
                ? formatTime(record.clock_out)
                : "Still working"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              record.clock_out
                ? "bg-gray-100 text-gray-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {record.clock_out ? "Completed" : "Working"}
          </span>

          <p className="mt-4 font-bold text-gray-900">
            {record.total_hours !== null
              ? formatDecimalHours(record.total_hours)
              : "In progress"}
          </p>
        </div>
      </div>
    </article>
  );
}

function AttendanceSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 px-5 pb-28 pt-8">
      <div className="mx-auto max-w-xl animate-pulse">
        <div className="h-5 w-36 rounded bg-gray-200" />
        <div className="mt-3 h-9 w-56 rounded bg-gray-200" />

        <div className="mt-8 h-80 rounded-3xl bg-gray-200" />

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="h-36 rounded-3xl bg-gray-200" />
          <div className="h-36 rounded-3xl bg-gray-200" />
        </div>

        <div className="mt-7 h-7 w-52 rounded bg-gray-200" />
        <div className="mt-4 h-32 rounded-3xl bg-gray-200" />
      </div>
    </main>
  );
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatLiveTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

function formatHoursAndMinutes(totalMinutes: number) {
  const safeMinutes = Math.max(0, Math.floor(totalMinutes));

  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  return `${hours}h ${minutes}m`;
}

function formatDecimalHours(decimalHours: number) {
  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}