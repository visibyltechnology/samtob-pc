const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function applySchema() {
  const connectionString = "postgresql://postgres.qaslwnwmcqryiogkumdr:Zannyboi%4013@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to new database.");

    const schemaPath = path.join(__dirname, "../supabase/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    console.log("Applying schema...");
    await client.query(schemaSql);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Error applying schema:", err);
  } finally {
    await client.end();
  }
}

applySchema();
