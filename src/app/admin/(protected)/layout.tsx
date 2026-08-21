import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ClipboardList, PiggyBank, Users } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[220px_1fr] gap-10">
          <aside className="space-y-1">
            <p className="text-xs font-data uppercase tracking-widest text-steel mb-4">Admin Panel</p>
            <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link href="/admin/products" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5">
              <Package size={16} /> Products
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5">
              <ClipboardList size={16} /> Orders
            </Link>
            <Link href="/admin/save-to-buy" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5">
              <PiggyBank size={16} /> Save-to-Buy
            </Link>
            <Link href="/admin/users" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/5">
              <Users size={16} /> Users
            </Link>
            <div className="pt-3 border-t border-line mt-3">
              <LogoutButton />
            </div>
          </aside>
          <div>{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
