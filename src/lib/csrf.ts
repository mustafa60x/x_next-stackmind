import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function generateCsrfToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");

  const { data, error } = await supabase
    .from("csrf_tokens")
    .insert([
      {
        user_id: userId,
        token,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data?.token;
}

export async function validateCsrfToken(
  userId: string,
  token: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("csrf_tokens")
    .select("token")
    .eq("user_id", userId)
    .eq("token", token)
    .single();

  if (error) {
    throw new Error("Failed to validate CSRF token");
  }

  return !!data;
}

export async function clearCsrfToken(userId: string) {
  const { error } = await supabase
    .from("csrf_tokens")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to clear CSRF token");
  }
}
