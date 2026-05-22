"use client";

import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-10 text-red-400 hover:text-red-300 font-bold"
    >
      Logout
    </button>
  );
}