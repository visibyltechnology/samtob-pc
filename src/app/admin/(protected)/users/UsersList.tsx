"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/motion/Toast";

export default function UsersList({ users }: { users: any[] }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  async function updateRole(userId: string, newRole: string) {
    setUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      showToast(`User is now ${newRole}`, "success");
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/5 text-[11px] uppercase tracking-widest text-steel font-data">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email / Phone</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-ink/5 transition-colors">
                <td className="px-6 py-4 font-medium">{user.name || "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-steel">
                    <span>{user.email || "—"}</span>
                    <span>{user.phone || "—"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.role === "admin" ? "bg-signal/10 text-signal" : "bg-steel/10 text-steel"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role === "admin" ? (
                    <button
                      onClick={() => updateRole(user.id, "customer")}
                      disabled={updating === user.id}
                      className="text-xs text-steel hover:text-signal disabled:opacity-50 font-medium transition-colors"
                    >
                      {updating === user.id ? "Updating..." : "Remove Admin"}
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRole(user.id, "admin")}
                      disabled={updating === user.id}
                      className="text-xs text-mint hover:text-mint/80 disabled:opacity-50 font-medium transition-colors"
                    >
                      {updating === user.id ? "Updating..." : "Make Admin"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-steel">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
