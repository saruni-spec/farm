"use server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Fetches all farms.
 */
export async function getAllFarms(offset = 0, limit = 10) {
  try {
    // Select all columns, request an exact count of total rows, and apply a range for pagination.
    // Supabase's range is inclusive, so `offset + limit - 1` gives the end index.
    const { data, error, count } = await supabase
      .from("farm")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching all farms:", error);
      throw new Error(`Failed to fetch all farms: ${error.message}`);
    }

    // Return both the fetched data and the total count of farms for pagination calculation.
    return { data, count };
  } catch (err) {
    console.error(
      "An unexpected error occurred while fetching all farms:",
      err
    );
    throw new Error("An unexpected error occurred.");
  }
}

/**
 * Deletes a farm by ID.
 */
export async function deleteFarm(farmId: string) {
  try {
    // Add a check here or rely purely on RLS
    const { error } = await supabase.from("farm").delete().eq("id", farmId);

    if (error) {
      console.error(`Error deleting farm ${farmId}:`, error);
      throw new Error(`Failed to delete farm: ${error.message}`);
    }

    return true;
  } catch (err: unknown) {
    console.error(
      `An unexpected error occurred while deleting farm ${farmId}:`,
      (err as Error).message
    );
    throw new Error((err as Error).message || "An unexpected error occurred.");
  }
}

export async function getAllFarmers() {
  try {
    const { data, error } = await supabase
      .from("farmer")
      .select("profile_id,profile(first_name,last_name,created_at)");
    if (error) {
      console.error("Error fetching farmers:", error);
      throw new Error(`Failed to fetch farmers: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("An unexpected error occurred while fetching farmers:", err);
    throw new Error("An unexpected error occurred.");
  }
}

export async function getProfile(id: string) {
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("farmer(profile_id),admin(profile_id)")
      .eq("id", id)
      .limit(1);
    if (error) {
      console.error("Error fetching profile:", error);
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("An unexpected error occurred while fetching profile:", err);
    throw new Error("An unexpected error occurred.");
  }
}
