"use client";

export default function WorkerProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
        <p className="mb-3"><strong>Name:</strong> Worker Name</p>
        <p className="mb-3"><strong>Position:</strong> Chef</p>
        <p className="mb-3"><strong>Phone:</strong> -</p>
        <p className="mb-3"><strong>Hourly Wage:</strong> ₩0</p>
        <p><strong>Status:</strong> Active</p>
      </div>
    </div>
  );
}