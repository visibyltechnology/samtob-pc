const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function check() {
  await c.connect();
  const res = await c.query(`SELECT id, name, slug, price, "old_price" FROM public.products WHERE slug IN ('hp-elite-dragonfly-g2-x360', 'hp-zbook-firefly-14g8')`);
  console.log(res.rows);
  await c.end();
}
check();
