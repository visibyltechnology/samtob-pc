import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, PiggyBank, LogOut } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/account/login");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-1">
        <p className="text-xs font-data uppercase tracking-widest text-steel mb-4">
          Hi, {session.name?.split(" ")[0] || "there"}
        </p>
        <Link href="/account/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5">
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link href="/account/orders" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5">
          <Package size={16} /> My Orders
        </Link>
        <Link href="/account/save-to-buy" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5">
          <PiggyBank size={16} /> Save-to-Buy
        </Link>
        <div className="pt-3 border-t border-line mt-3">
          <LogoutButton redirectTo="/account/login" />
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}
