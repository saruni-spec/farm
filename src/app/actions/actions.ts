"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Position } from "geojson";

/**
 * Creates a new farm for the authenticated user.
 */
export async function createFarm(farmName: string, farmGeometry: Position[][]) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Error getting user for createFarm:", authError?.message);
    throw new Error("User not authenticated.");
  }

  // Ensure the polygon is closed by repeating the first coordinate at the end
  if (farmGeometry[0][0] !== farmGeometry[0][farmGeometry[0].length - 1]) {
    farmGeometry[0].push(farmGeometry[0][0]);
  }

  // Convert coordinates to WKT format
  const wkt = `POLYGON((${farmGeometry[0]
    .map((coord) => `${coord[0]} ${coord[1]}`)
    .join(", ")}))`;

  try {
    const { data, error } = await supabase
      .from("farm")
      .insert([
        {
          farmer_id: user.id,
          name: farmName,
          geom: wkt,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating farm:", error);
      throw new Error(`Failed to create farm: ${error.message}`);
    }

    console.log("Farm created successfully:", data);
  } catch (err) {
    console.error("An unexpected error occurred while creating farm:", err);
    throw new Error("An unexpected error occurred.");
  }
}

/**
 * Fetches all farms for the authenticated user.
 */
export async function getFarmsByFarmerId() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error(
      "Error getting user for getFarmsByFarmerId:",
      authError?.message
    );
    console.warn("Attempted to fetch farms for unauthenticated user.");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("farm")
      .select("*")
      .eq("farmer_id", user.id);

    if (error) {
      console.error(`Error fetching farms for farmer ${user.id}:`, error);
      throw new Error(`Failed to fetch farms: ${error.message}`);
    }

    console.log(`Farms for farmer ${user.id}:`);
    return data;
  } catch (err) {
    console.error(
      `An unexpected error occurred while fetching farms for farmer ${
        user?.id || "N/A"
      }:`,
      err
    );
    throw new Error("An unexpected error occurred.");
  }
}

/**
 * Fetches all farms.
 */
export async function getAllFarms() {
  const supabase = createServerComponentClient({ cookies });
  try {
    const { data, error } = await supabase.from("farm").select("*");

    if (error) {
      console.error("Error fetching all farms:", error);
      throw new Error(`Failed to fetch all farms: ${error.message}`);
    }

    console.log("All farms:", data);
    return data;
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
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Error getting user for deleteFarm:", authError?.message);
    throw new Error("User not authenticated.");
  }

  try {
    // Add a check here or rely purely on RLS
    const { data: farmData, error: fetchError } = await supabase
      .from("farm")
      .select("farmer_id")
      .eq("id", farmId)
      .single();
    if (fetchError || !farmData || farmData.farmer_id !== user.id) {
      console.warn(
        `User ${user.id} attempted to delete farm ${farmId} which they don't own or doesn't exist.`
      );
      throw new Error("You do not have permission to delete this farm.");
    }

    const { error } = await supabase
      .from("farm")
      .delete()
      .eq("id", farmId)
      .eq("farmer_id", user.id);

    if (error) {
      console.error(`Error deleting farm ${farmId}:`, error);
      throw new Error(`Failed to delete farm: ${error.message}`);
    }

    console.log(`Farm ${farmId} deleted successfully by user ${user.id}.`);
    return true;
  } catch (err: unknown) {
    console.error(
      `An unexpected error occurred while deleting farm ${farmId}:`,
      (err as Error).message
    );
    throw new Error((err as Error).message || "An unexpected error occurred.");
  }
}

/**
 * Gets the current farmer ID.
 */
export async function getCurrentFarmerId() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return user.id;
  }
  return null;
}
