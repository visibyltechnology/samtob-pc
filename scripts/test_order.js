const { Client } = require('pg');
const c = new Client({connectionString: 'postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'});

async function testInsert() {
  await c.connect();
  try {
    const res = await c.query(`
      INSERT INTO public.orders (
        order_number, customer_name, phone, email, address, region, delivery_method, delivery_fee, 
        items, subtotal, total, payment_method, bank_reference, receipt_url
      ) VALUES (
        'TEST-001', 'Test', '1234567', 'test@test.com', 'Address', 'ibadan', 'door-step', 0,
        '[]'::jsonb, 0, 0, 'bank-transfer', null, null
      ) RETURNING id;
    `);
    console.log("Success:", res.rows);
    // clean up
    await c.query(`DELETE FROM public.orders WHERE id = $1`, [res.rows[0].id]);
  } catch (e) {
    console.error("DB Error:", e);
  }
  await c.end();
}
testInsert();
