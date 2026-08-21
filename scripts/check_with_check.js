const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function checkWithCheck() {
  await c.connect();
  const res = await c.query("SELECT tablename, policyname, cmd, with_check FROM pg_policies WHERE tablename IN ('save_to_buy_plans', 'save_to_buy_contributions', 'orders') AND cmd = 'INSERT'");
  console.dir(res.rows, { depth: null });
  await c.end();
}
checkWithCheck().catch(console.error);
