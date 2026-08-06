import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = "product-images";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WEBP or GIF images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be smaller than 5MB" }, { status: 400 });
  }

  const ext = file.type.split("/")[1];
  const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
