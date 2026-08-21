const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function update() {
  await c.connect();
  
  await c.query(`UPDATE public.products SET old_price = 890000 WHERE slug = 'hp-elite-dragonfly-g2-x360'`);
  await c.query(`UPDATE public.products SET old_price = 580000 WHERE slug = 'hp-zbook-firefly-14g8'`);
  
  console.log("Updated old_price for the two products.");
  await c.end();
}
update();
