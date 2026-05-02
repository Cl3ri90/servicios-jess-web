import "server-only";
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function uploadPublicFile({
  bucket,
  path,
  file,
  contentType,
}: {
  bucket: string;
  path: string;
  file: File;
  contentType?: string;
}): Promise<{
  success: boolean;
  publicUrl?: string;
  error?: string;
}> {
  try {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: contentType || file.type,
        upsert: true,
      });

    if (error) {
      console.error("[STORAGE ADMIN ERROR]", error.message);
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

    return { success: true, publicUrl };
  } catch (err: any) {
    console.error("[STORAGE FATAL]", err.message);
    return { success: false, error: err.message || "Error fatal subiendo archivo" };
  }
}