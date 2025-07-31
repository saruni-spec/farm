import { feature } from "@/types/geometry";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const saveFarmFromSegment = async (
  segment: feature | null,
  farmName: string,
  cropId: string
) => {
  try {
    const response = await fetch(`${backendURL}/api/save_farm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: farmName,
        segment_id: segment?.id,
        crop_id: cropId,
      }),
    });

    if (!response.ok) throw new Error("Failed to save farm");
    const result = await response.json();
    toast.success(result.message || "Farm saved successfully!");
    return true;
  } catch (error) {
    toast.error("Save failed.");
    console.error(error);
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
      console.error(error);
      return false;
    }
  }
};
