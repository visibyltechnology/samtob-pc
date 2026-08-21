const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function checkIsAdmin() {
  await c.connect();
  const res = await c.query("SELECT prosrc FROM pg_proc WHERE proname = 'is_admin'");
  console.dir(res.rows, { depth: null });
  await c.end();
}
checkIsAdmin().catch(console.error);
