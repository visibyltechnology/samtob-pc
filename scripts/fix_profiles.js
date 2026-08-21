const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
});

async function fixProfiles() {
  await client.connect();
  
  // Insert a profile for every auth user that doesn't have one yet
  const res = await client.query(`
    INSERT INTO public.profiles (id, name, role)
    SELECT id, SPLIT_PART(email, '@', 1), 'customer'
    FROM auth.users
    WHERE id NOT IN (SELECT id FROM public.profiles)
    ON CONFLICT (id) DO NOTHING
    RETURNING id, name, role
  `);
  
  console.log("Created missing profiles:", res.rows);
  
  // Verify all users now have profiles
  const check = await client.query(`
    SELECT u.email, p.id, p.name, p.role 
    FROM auth.users u 
    LEFT JOIN public.profiles p ON p.id = u.id
    ORDER BY u.email
  `);
  console.log("All user profiles:", check.rows);
  
  await client.end();
}

fixProfiles().catch(console.error);
