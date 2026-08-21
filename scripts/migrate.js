const { createClient } = require("@supabase/supabase-js");
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const OLD_SUPABASE_URL = "https://rkcebsghghwxjvobenry.supabase.co";
const OLD_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrY2Vic2doZ2h3eGp2b2JlbnJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc4NDc2OSwiZXhwIjoyMTAxMzYwNzY5fQ.rp8OglXSL5FGUMXOKgJ-IW3ElZsa8l9_hS6FGCBeSFQ";
const NEW_DB_URL = "postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";

async function getClient() {
  const client = new Client({
    connectionString: NEW_DB_URL,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    connectionTimeoutMillis: 30000,
  });
  await client.connect();
  return client;
}

// Cloudinary
const CLOUD_NAME = "drqqa0jp";
const UPLOAD_PRESET = "samtop-pc";

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

async function uploadToCloudinary(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("http")) return imageUrl;
  
  try {
    const formData = new FormData();
    formData.append("file", imageUrl);
    formData.append("upload_preset", UPLOAD_PRESET);
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    return data.secure_url || imageUrl;
  } catch (err) {
    console.error("Cloudinary upload failed for", imageUrl, err);
    return imageUrl;
  }
}

async function migrate() {
  let pgClient = await getClient();
  console.log("Connected to new DB.");

  // Helper to safely re-run a query, reconnecting if the connection was lost
  async function safeQuery(text, values) {
    try {
      return await pgClient.query(text, values);
    } catch (err) {
      if (err.code === 'ECONNRESET' || err.message.includes('terminated')) {
        console.log('Connection lost, reconnecting...');
        pgClient = await getClient();
        return await pgClient.query(text, values);
      }
      throw err;
    }
  }

  try {
    // 1. Migrate Users
    console.log("Fetching users from old DB...");
    const { data: { users }, error: usersErr } = await oldSupabase.auth.admin.listUsers();
    if (usersErr) throw usersErr;
    
    console.log(`Found ${users.length} users. Migrating...`);
    for (const user of users) {
      // Insert into new auth.users
      const dummyHash = "$2a$10$abcdefghijklmnopqrstuvwxyz123456789012345678901234567"; // Invalid hash forces reset
      const query = `
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
        VALUES ($1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $2, $3, $4, $5, $6, $7, $8, '')
        ON CONFLICT (id) DO NOTHING;
      `;
      await safeQuery(query, [
        user.id,
        user.email,
        dummyHash,
        user.email_confirmed_at || new Date().toISOString(),
        user.app_metadata || {},
        user.user_metadata || {},
        user.created_at,
        user.updated_at
      ]);

      // Since auth.users trigger might have created a profile, we update it or insert
      const { data: oldProfile } = await oldSupabase.from("profiles").select("*").eq("id", user.id).single();
      if (oldProfile) {
        const pQuery = `
          INSERT INTO public.profiles (id, name, role, created_at)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;
        `;
        await safeQuery(pQuery, [
          oldProfile.id, oldProfile.name, oldProfile.role || 'customer', oldProfile.created_at
        ]);
      }
    }

    // 2. Migrate Products and upload images to Cloudinary
    console.log("Fetching products from old DB...");
    const { data: products } = await oldSupabase.from("products").select("*");
    if (products) {
      console.log(`Found ${products.length} products. Migrating...`);
      for (const prod of products) {
        let newImages = [];
        const oldImages = Array.isArray(prod.images) ? prod.images : (prod.image ? [prod.image] : []);
        
        for (let img of oldImages) {
          if (img && img.includes("supabase.co")) {
            console.log(`Uploading ${img} to Cloudinary...`);
            const cImg = await uploadToCloudinary(img);
            newImages.push(cImg);
          } else {
            newImages.push(img);
          }
        }

        const slug = (prod.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
        const prodQuery = `
          INSERT INTO public.products (id, name, slug, description, price, stock, images, specs, warranty_days, category, condition, brand, created_at, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING;
        `;
        await safeQuery(prodQuery, [
          prod.id, prod.name, prod.slug || slug, prod.description || '', prod.price, prod.stockQuantity || prod.stock || 0, newImages, 
          prod.specs || {}, prod.warranty || prod.warranty_days || 0, prod.category || 'gadgets', prod.condition || 'new', prod.brand || 'Unknown', prod.created_at, prod.isFeatured || prod.featured || false
        ]);
      }
    }

    // 3. Migrate Orders
    console.log("Fetching orders from old DB...");
    const { data: orders } = await oldSupabase.from("orders").select("*");
    if (orders) {
      console.log(`Found ${orders.length} orders. Migrating...`);
      for (const order of orders) {
        const oQuery = `
          INSERT INTO public.orders (id, order_number, user_id, customer_name, phone, email, address, region, delivery_method, items, subtotal, total, payment_method, status, created_at, receipt_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO NOTHING;
        `;
        const itemsJson = typeof order.items === 'string' ? order.items : JSON.stringify(order.items || []);
        await safeQuery(oQuery, [
          order.id, order.orderNumber || order.order_number || `ORD-${Date.now()}`, order.customerId || order.user_id, order.customerName || order.customer_name || 'Guest',
          order.phone || '', order.email || 'guest@example.com', order.address || 'N/A', order.region || 'ibadan', order.deliveryMethod || order.delivery_method || 'door-step',
          itemsJson, order.total || 0, order.total || 0, order.paymentMethod || order.payment_method || 'bank-transfer', order.status || 'pending',
          order.created_at, order.receipt_url || null
        ]);
      }
    }

    // 4. Migrate Save to Buy Plans
    console.log("Fetching save_to_buy_plans from old DB...");
    const { data: plans } = await oldSupabase.from("save_to_buy_plans").select("*");
    if (plans) {
      console.log(`Found ${plans.length} plans. Migrating...`);
      for (const plan of plans) {
        const planQuery = `
          INSERT INTO public.save_to_buy_plans (id, user_id, product_id, product_name, product_image, target_amount, saved_amount, status, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO NOTHING;
        `;
        await safeQuery(planQuery, [
          plan.id, plan.user_id || plan.userId, plan.product_id || plan.productId, plan.product_name || plan.productName || 'Unknown', 
          plan.product_image || plan.productImage || null, plan.target_amount || plan.targetAmount || plan.amount || 0, plan.saved_amount || plan.savedAmount || 0,
          plan.status || 'active', plan.created_at
        ]);
      }
    }

    // 5. Migrate Save to Buy Contributions
    console.log("Fetching save_to_buy_contributions from old DB...");
    const { data: stbs } = await oldSupabase.from("save_to_buy_contributions").select("*");
    if (stbs) {
      console.log(`Found ${stbs.length} contributions. Migrating...`);
      for (const stb of stbs) {
        const stbQuery = `
          INSERT INTO public.save_to_buy_contributions (id, plan_id, amount, status, created_at, receipt_url)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING;
        `;
        await safeQuery(stbQuery, [
          stb.id, stb.planId || stb.plan_id || stb.productId, stb.amount, stb.status, stb.created_at, stb.receipt_url || null
        ]);
      }
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pgClient.end();
  }
}

migrate();
