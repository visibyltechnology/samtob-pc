"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ redirectTo = "/admin/login" }: { redirectTo?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5 text-steel w-full"
    >
      <LogOut size={16} /> Log Out
    </button>
  );
}
