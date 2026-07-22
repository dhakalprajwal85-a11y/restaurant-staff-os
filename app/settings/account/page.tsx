"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AccountSettingsPage() {
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUserId(user.id);
    setNewEmail(user.email || "");

    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (data) {
      setFullName(data.full_name || "");
    }
  }

  async function saveChanges() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not logged in");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
      })
      .eq("id", user.id);

    if (profileError) {
      alert(profileError.message);
      setLoading(false);
      return;
    }

    if (newEmail && newEmail !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (emailError) {
        alert(emailError.message);
        setLoading(false);
        return;
      }

      alert("Email change requested. Check your email to confirm.");
    }

    if (newPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) {
        alert(passwordError.message);
        setLoading(false);
        return;
      }
    }

    alert("Account updated successfully!");
    setNewPassword("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white p-8">
      <div className="max-w-xl mx-auto bg-[#111827] border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Account ID
            </label>
            <input
              value={userId}
              disabled
              className="w-full bg-gray-700 rounded-xl p-4 text-gray-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Manager Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
              placeholder="Manager name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Login Email / ID
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
              placeholder="New login email"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#020817] border border-white/10 rounded-xl p-4"
              placeholder="Leave empty if you do not want to change"
            />
          </div>

          <button
            onClick={saveChanges}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 rounded-xl p-4 font-bold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}