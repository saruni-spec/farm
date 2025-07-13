import { feature } from "@/types/geometry";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const updateFarm = async (
  selectedFarm: feature | null,
  farmName: string
) => {
  try {
    const response = await fetch(
      `${backendURL}/api/farms/${selectedFarm?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: farmName }),
      }
    );

    if (!response.ok) throw new Error("Failed to update farm");
    const result = await response.json();
    toast.success(result.message || "Farm updated successfully!");
    return true;
  } catch (error) {
    toast.error("Update failed.");
    return false;
  }
};

export const deleteFarm = async (selectedFarm: feature) => {
  const result = await Swal.fire({
    title: `Delete ${selectedFarm?.name || "segment"}?`,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#aaa",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed && selectedFarm) {
    try {
      const response = await fetch(
        `${backendURL}/api/farms/${selectedFarm.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete farm");

      const result = await response.json();
      toast.success(result.message || "Farm deleted successfully!");
      return true;
    } catch (error) {
      toast.error("Delete failed.");
      return false;
    }
  }
};
