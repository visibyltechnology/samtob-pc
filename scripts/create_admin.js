const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://qaslwnwmcqryiogkumdr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhc2x3bndtY3FyeWlvZ2t1bWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzI1NjAzOCwiZXhwIjoyMTAyODMyMDM4fQ.C0dPTYNwZjLf4ILMHdARtBIvqNGlzku1ZPhJrPYRwww",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createAdmin() {
  // 1. Create the user in auth.users
  const { data, error } = await supabase.auth.admin.createUser({
    email: "samtob.pc.ng@gmail.com",
    password: "Admin@01",
    email_confirm: true, // skip email verification
    user_metadata: { name: "Samtob Admin" },
  });

  if (error) {
    console.error("Failed to create user:", error.message);
    return;
  }

  console.log("User created:", data.user.id, data.user.email);

  // 2. Set role to admin in profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: data.user.id, name: "Samtob Admin", role: "admin" });

  if (profileError) {
    console.error("Failed to set admin role:", profileError.message);
    return;
  }

  console.log("Admin role set successfully!");
  console.log("Email:", data.user.email);
  console.log("Role: admin");
}

createAdmin();
