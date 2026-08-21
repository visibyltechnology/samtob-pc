import { createAdminClient } from "@/lib/supabase/server";
import UsersList from "./UsersList";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = createAdminClient();
  
  // We fetch from profiles table
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  // To get emails, we'd ideally query auth.users if permissions allow, 
  // but for now we'll just display the profile data.
  const users = (profiles || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    phone: p.phone,
    role: p.role,
    // email isn't in profiles, it's in auth.users. 
    // Admin clients can fetch auth users, let's fetch them to enrich the data.
  }));

  // Fetch auth users to get emails (admin client allows this)
  const { data: authData } = await supabase.auth.admin.listUsers();
  
  const enrichedUsers = users.map(u => {
    const authUser = authData?.users.find(au => au.id === u.id);
    return {
      ...u,
      email: authUser?.email || "",
    };
  });

  return (
    <main>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight mb-1">Users</h1>
          <p className="text-steel text-sm">Manage users and assign admin roles.</p>
        </div>
      </div>
      
      <UsersList users={enrichedUsers} />
    </main>
  );
}
