const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function fixRLS() {
  await c.connect();
  
  // Drop the existing recursive policy
  await c.query("DROP POLICY IF EXISTS \"profiles: read own or admin reads all\" ON public.profiles");
  
  // Create a simpler policy: anyone can read their own profile
  await c.query(`
    CREATE POLICY "profiles: read own" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id)
  `);
  
  console.log("RLS Policy fixed!");
  await c.end();
}

fixRLS().catch(console.error);
