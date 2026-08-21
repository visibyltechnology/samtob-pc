const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function checkRLS() {
  await c.connect();
  const res = await c.query("SELECT tablename, policyname, roles, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles'");
  console.log("RLS Policies for profiles:");
  console.dir(res.rows, { depth: null });
  await c.end();
}
checkRLS().catch(console.error);
