"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
const supabase = createServerComponentClient({ cookies });

export async function createFarm(
  farmerId: string,
  farmName: string,
  farmGeometry: any
) {
  try {
    const { data, error } = await supabase
      .from("farm")
      .insert([
        {
          farmer_id: farmerId,
          name: farmName,
          geom: farmGeometry,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating farm:", error);
      return null;
    }

    console.log("Farm created successfully:", data);
    return data; // Returns an array of inserted rows (usually one)
  } catch (err) {
    console.error("An unexpected error occurred while creating farm:", err);
    return null;
  }
}

export async function getAllFarms() {
  try {
    const { data, error } = await supabase.from("farm").select("*");

    if (error) {
      console.error("Error fetching all farms:", error);
      return null;
    }

    console.log("All farms:", data);
    return data;
  } catch (err) {
    console.error(
      "An unexpected error occurred while fetching all farms:",
      err
    );
    return null;
  }
}

export async function getFarmsByFarmerId(farmerId: string) {
  try {
    const { data, error } = await supabase
      .from("farm")
      .select("*")
      .eq("farmer_id", farmerId);

    if (error) {
      console.error(`Error fetching farms for farmer ${farmerId}:`, error);
      return null;
    }

    console.log(`Farms for farmer ${farmerId}:`, data);
    return data;
  } catch (err) {
    console.error(
      `An unexpected error occurred while fetching farms for farmer ${farmerId}:`,
      err
    );
    return null;
  }
}

// Assuming you have the farm's ID
async function deleteFarm(farmId: string) {
  try {
    const { error } = await supabase.from("farm").delete().eq("id", farmId);

    if (error) {
      console.error(`Error deleting farm ${farmId}:`, error);
      return false;
    }

    console.log(`Farm ${farmId} deleted successfully.`);
    return true;
  } catch (err) {
    console.error(
      `An unexpected error occurred while deleting farm ${farmId}:`,
      err
    );
    return false;
  }
}

export async function getCurrentFarmerId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return user.id;
  }
  return null;
}
