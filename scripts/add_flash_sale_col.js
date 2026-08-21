const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function addColumn() {
  await c.connect();
  try {
    await c.query(`ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_flash_sale BOOLEAN DEFAULT false`);
    console.log("Added is_flash_sale column to products table.");
  } catch(e) {
    console.error("Error adding column:", e);
  }
  await c.end();
}
addColumn();
