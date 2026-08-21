const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function checkAndFix() {
  await c.connect();
  const res = await c.query("SELECT u.id, u.email, p.role FROM auth.users u JOIN public.profiles p ON p.id = u.id WHERE u.email = 'samtob.pc.ng@gmail.com'");
  console.log("Current state:", res.rows);
  
  if (res.rows.length > 0 && res.rows[0].role !== 'admin') {
    await c.query("UPDATE public.profiles SET role = 'admin' WHERE id = $1", [res.rows[0].id]);
    console.log("Updated role to admin!");
  }
  await c.end();
}
checkAndFix().catch(console.error);
