import { supabase } from "@lib/supabase/client";
import { User, UserInsert } from "../../../database.types";

export async function upsertUser(
  id: number,
  first_name: string,
  last_name: string | undefined,
  username: string | undefined,
  photo_url: string | undefined,
  language_code?: string,
  is_premium?: boolean,
  allows_write_to_pm?: boolean,
  is_bot?: boolean
) {
  try {
    // Check if user exists
    const { data, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);

    if (checkError) {
      console.error("Error checking if user exists:", checkError);
      throw checkError;
    }

    if (data && data.length > 0) {
      // User exists, update only the provided fields
      // This preserves any fields not included in the update
      const updates: Record<
        string,
        string | number | boolean | null | undefined
      > = {};

      // Always update Telegram fields to reflect current state
      updates.first_name = first_name;
      updates.last_name = last_name || null;
      updates.username = username || null;
      updates.photo_url = photo_url || null;

      // Telegram metadata (update if provided)
      if (language_code !== undefined) updates.language_code = language_code;
      if (is_premium !== undefined) updates.is_premium = is_premium;
      if (allows_write_to_pm !== undefined)
        updates.allows_write_to_pm = allows_write_to_pm;
      if (is_bot !== undefined) updates.is_bot = is_bot;

      // Always bump last_auth timestamp to now
      updates.last_auth = new Date().toISOString();

      // Only perform update if we have fields to update
      if (Object.keys(updates).length > 0) {
        console.log("upsertUser: prepared updates", updates);

        const {
          data: updateData,
          error: updateError,
          status,
        } = await supabase.from("users").update(updates).match({ id });

        console.log("upsertUser: update status", status);

        if (updateError) {
          console.error("upsertUser: update error", updateError);
          throw updateError;
        }

        console.log("upsertUser: update response", updateData);
      }
    } else {
      // User doesn't exist, insert new user
      const userRecord: UserInsert = {
        id,
        first_name,
        last_name,
        username,
        photo_url,
        language_code,
        is_premium,
        allows_write_to_pm,
        is_bot,
      };
      console.log("upsertUser: inserting new user record", userRecord);

      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert([userRecord])
        .select();

      if (insertError) {
        console.error("upsertUser: insert error", insertError);
        throw insertError;
      }

      console.log("upsertUser: insert response", insertData);
    }

    return true;
  } catch (error) {
    console.error("Error in upsertUser:", error);
    throw error;
  }
}

export async function isAdmin(id: number) {
  const result = await supabase
    .from("users")
    .select("admin")
    .eq("id", id)
    .limit(1);

  if (result.error) {
    console.error("Error selecting admin status", result.error);
    throw result.error;
  }
  if (result.data.length != 1) {
    console.error("Error selecting admin status, user not found", result.error);
    throw new Error("User not found");
  }
  return result.data[0].admin ?? false;
}

export const getUsersByIds = async (userIds: number[]) => {
  const result = await supabase.from("users").select().in("id", userIds);
  if (result.error) {
    console.error("Error getUsersByIds:", result.error);
    throw result.error;
  }
  return result.data! as User[];
};

export const getAdminUsers = async () => {
  const result = await supabase.from("users").select().eq("admin", true);
  if (result.error) {
    console.error("Error getUsersByIds:", result.error);
    throw result.error;
  }
  return result.data! as User[];
};

export const getUser = async (userId: number) => {
  const result = await supabase.from("users").select().eq("id", userId);
  if (result.error) {
    console.error("Error getUser:", result.error);
    throw result.error;
  }
  return result.data![0] as User;
};
