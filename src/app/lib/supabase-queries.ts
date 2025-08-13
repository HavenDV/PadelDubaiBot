import { supabase } from "@lib/supabase/client";
import { User } from "../../../database.types";

// Client should not write to public.users; this is handled server-side.

export async function isAdmin(id: number) {
  // Prefer checking admin flag from JWT app_metadata to avoid table reads
  const { data: auth } = await supabase.auth.getUser();
  const jwtAdmin = Boolean(auth.user?.app_metadata?.admin);
  if (jwtAdmin) return true;
  // Fallback for non-telegram web mode where admin column may be needed
  const result = await supabase
    .from("users")
    .select("admin")
    .eq("id", id)
    .limit(1);
  if (result.error) throw result.error;
  if (!result.data || result.data.length !== 1)
    throw new Error("User not found");
  return Boolean(result.data[0].admin);
}

export const getUsersByIds = async (userIds: number[]) => {
  const result = await supabase
    .from("users")
    .select("id, first_name, last_name, username, photo_url, explicit_name")
    .in("id", userIds);
  if (result.error) {
    console.error("Error getUsersByIds:", result.error);
    throw result.error;
  }
  return result.data! as User[];
};

export const getAdminUsers = async () => {
  const result = await supabase
    .from("users")
    .select(
      "id, first_name, last_name, username, photo_url, explicit_name, admin"
    )
    .eq("admin", true);
  if (result.error) {
    console.error("Error getUsersByIds:", result.error);
    throw result.error;
  }
  return result.data! as User[];
};

export const getUser = async (userId: number) => {
  const result = await supabase
    .from("users")
    .select(
      "id, first_name, last_name, username, photo_url, explicit_name, admin"
    )
    .eq("id", userId);
  if (result.error) {
    console.error("Error getUser:", result.error);
    throw result.error;
  }
  return result.data![0] as User;
};
