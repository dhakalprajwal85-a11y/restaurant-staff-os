"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  RefreshCw,
  UserCheck,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Worker = {
  id: string;
  name: string;
  status?: string | null;
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

type WorkerAttendanceRow = {
  worker: Worker;
  activeRecord: AttendanceRecord | null;
  todayRecords: AttendanceRecord[];
  todayMinutes: number;
};

export default function ManagerAttendancePage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrorMessage("");

    try {
      const today = formatLocalDate(new Date());

      const { data: workersData, error: workersError } = await supabase
        .from("workers")
        .select("id, name, status")
        .order("name", { ascending: true });

      if (workersError) {
        throw workersError;
      }

      const { data: attendanceData, error: attendanceError } =
        await supabase
          .from("attendance")
          .select("*")
          .eq("work_date", today)
          .order("clock_in", { ascending: false });

      if (attendanceError) {
        throw attendanceError;
      }

      setWorkers(workersData ?? []);
      setAttendance(attendanceData ?? []);
    } catch (error: any) {
      console.error("Manager attendance load error:", error);

      setErrorMessage(
        error?.message || "Failed to load attendance information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("manager-attendance-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
        },
        () => {
          loadData(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const rows = useMemo<WorkerAttendanceRow[]>(() => {
    return workers.map((worker) => {
      const todayRecords = attendance.filter(
        (record) => record.worker_id === worker.id
      );

      const activeRecord =
        todayRecords.find((record) => record.clock_out === null) ?? null;

      const completedMinutes = todayRecords.reduce((total, record) => {
        if (!record.clock_out) return total;

        if (record.total_hours !== null) {
          return total + Number(record.total_hours) * 60;
        }

        const start = new Date(record.clock_in).getTime();
        const end = new Date(record.clock_out).getTime();

        return total + Math.max(0, end - start) / (1000 * 60);
      }, 0);

      const activeMinutes = activeRecord
        ? Math.max(
            0,
            currentTime.getTime() -
              new Date(activeRecord.clock_in).getTime()
          ) /
          (1000 * 60)
        : 0;

      return {
        worker,
        activeRecord,
        todayRecords,
        todayMinutes: completedMinutes + activeMinutes,
      };
    });
  }, [workers, attendance, currentTime]);

  const workingRows = rows.filter((row) => row.activeRecord);
  const completedRows = rows.filter(
    (row) => !row.activeRecord && row.todayRecords.length > 0
  );
  const absentRows = rows.filter((row) => row.todayRecords.length === 0);

  const todayTotalMinutes = rows.reduce(
    (total, row) => total + row.todayMinutes,
    0
  );

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Manager Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Live Attendance
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {formatFullDate(currentTime)} ·{" "}
              {formatLiveTime(currentTime)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </header>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Workers"
            value={workers.length.toString()}
            subtitle="Registered workers"
            icon={<Users size={22} />}
          />

          <StatCard
            title="Working Now"
            value={workingRows.length.toString()}
            subtitle="Currently clocked in"
            icon={<UserCheck size={22} />}
          />

          <StatCard
            title="Completed Today"
            value={completedRows.length.toString()}
            subtitle="Finished their shift"
            icon={<CheckCircle2 size={22} />}
          />

          <StatCard
            title="Total Hours Today"
            value={formatHoursAndMinutes(todayTotalMinutes)}
            subtitle="Across all workers"
            icon={<Clock3 size={22} />}
          />
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Currently Working
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Live worker status and duration
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {workingRows.length} working
            </span>
          </div>

          {workingRows.length === 0 ? (
            <EmptyState
              title="No workers are currently clocked in"
              description="Workers will appear here immediately after clocking in."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {workingRows.map((row) => (
                <WorkingWorkerCard
                  key={row.worker.id}
                  row={row}
                  currentTime={currentTime}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Today’s Attendance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Completed shifts and workers who have not clocked in
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Worker</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">
                      First Clock In
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Last Clock Out
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Today’s Hours
                    </th>
                    <th className="px-6 py-4 font-semibold">Records</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => {
                    const firstRecord = getFirstRecord(row.todayRecords);
                    const lastCompletedRecord = getLastCompletedRecord(
                      row.todayRecords
                    );

                    return (
                      <tr
                        key={row.worker.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-5">
                          <div className="font-semibold text-gray-900">
                            {row.worker.name}
                          </div>

                          <div className="mt-1 text-xs text-gray-500">
                            {row.worker.status || "Active worker"}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <WorkerStatusBadge row={row} />
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-700">
                          {firstRecord
                            ? formatTime(firstRecord.clock_in)
                            : "—"}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-700">
                          {row.activeRecord
                            ? "Still working"
                            : lastCompletedRecord?.clock_out
                              ? formatTime(
                                  lastCompletedRecord.clock_out
                                )
                              : "—"}
                        </td>

                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {formatHoursAndMinutes(row.todayMinutes)}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {row.todayRecords.length}
                        </td>
                      </tr>
                    );
                  })}

                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No workers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {absentRows.length > 0 && (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Not Clocked In Today
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Workers with no attendance records today
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {absentRows.map((row) => (
                <div
                  key={row.worker.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {row.worker.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        No attendance today
                      </p>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      Off Duty
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
        </div>

        <div className="rounded-2xl bg-gray-100 p-3 text-gray-700">
          {icon}
        </div>
      </div>
    </article>
  );
}

function WorkingWorkerCard({
  row,
  currentTime,
}: {
  row: WorkerAttendanceRow;
  currentTime: Date;
}) {
  const activeRecord = row.activeRecord;

  if (!activeRecord) return null;

  const duration =
    currentTime.getTime() - new Date(activeRecord.clock_in).getTime();

  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />

            <span className="text-sm font-semibold text-green-700">
              Working now
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-bold text-gray-900">
            {row.worker.name}
          </h3>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Clocked In
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Clocked in
          </p>

          <p className="mt-2 font-bold text-gray-900">
            {formatTime(activeRecord.clock_in)}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-green-700">
            Working for
          </p>

          <p className="mt-2 font-bold text-green-700">
            {formatDuration(Math.max(0, duration))}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Total hours today
          </span>

          <span className="font-bold text-gray-900">
            {formatHoursAndMinutes(row.todayMinutes)}
          </span>
        </div>
      </div>
    </article>
  );
}

function WorkerStatusBadge({
  row,
}: {
  row: WorkerAttendanceRow;
}) {
  if (row.activeRecord) {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Working
      </span>
    );
  }

  if (row.todayRecords.length > 0) {
    return (
      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
      Not Clocked In
    </span>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
      <Clock3 size={38} className="mx-auto text-gray-300" />

      <p className="mt-4 font-semibold text-gray-800">{title}</p>

      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function AttendanceSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="mt-3 h-9 w-64 rounded bg-gray-200" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 rounded-3xl bg-gray-200"
            />
          ))}
        </div>

        <div className="mt-8 h-7 w-52 rounded bg-gray-200" />

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="h-64 rounded-3xl bg-gray-200" />
          <div className="h-64 rounded-3xl bg-gray-200" />
        </div>

        <div className="mt-8 h-80 rounded-3xl bg-gray-200" />
      </div>
    </main>
  );
}

function getFirstRecord(records: AttendanceRecord[]) {
  if (records.length === 0) return null;

  return [...records].sort(
    (a, b) =>
      new Date(a.clock_in).getTime() -
      new Date(b.clock_in).getTime()
  )[0];
}

function getLastCompletedRecord(records: AttendanceRecord[]) {
  const completedRecords = records.filter(
    (record) => record.clock_out !== null
  );

  if (completedRecords.length === 0) return null;

  return completedRecords.sort(
    (a, b) =>
      new Date(b.clock_out!).getTime() -
      new Date(a.clock_out!).getTime()
  )[0];
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