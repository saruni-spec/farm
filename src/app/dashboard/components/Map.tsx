"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Loader2, BarChart3, Map as MapIcon } from "lucide-react";
import { supabase } from "@/superbase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AnalysisLegend from "./Map Functionality/AnalysisLegend";
import useDashboardStore from "@/stores/useDashboardStore";

const MapLeaflet = dynamic(() => import("./Map Functionality/Map Leaflet"), {
  ssr: false,
});

const Map = () => {
  const {
    segmenting,
    setIsSegmenting,
    saving,
    setSaving,
    selectedFarm,
    getFarms,
    geoData,
    bbox,
    setBbox,
    setGeoData,
    isAnalyzing,
    showAllFarms,
    runCropStressAnalysis,
    toggleShowAllFarms,
  } = useDashboardStore();
  const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [farmNameModal, setFarmNameModal] = useState<boolean>(false);
  const [farmName, setFarmName] = useState<string>("");

  const getFarmerID = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const farmer_id = data?.session?.user.id;
    return farmer_id;
  };

  useEffect(() => {
    if (!selectedFarm || !selectedFarm.geometry) {
      setGeoData(undefined);
      return;
    }

    setGeoData([selectedFarm]);
  }, [selectedFarm]);

  const segmentFarm = async () => {
    if (!bbox) {
      toast.error("Please draw a field area first");
      return;
    }

    setIsSegmenting(true);

    const farmer_id = await getFarmerID();
    const selected_area = await saveSelectedArea();
    const selected_area_id = selected_area?.selected_area_id;

    const payload = {
      bbox: bbox,
      farmer_id: farmer_id,
      selected_area_id: selected_area_id,
    };

    fetch(`${backendURL}/segment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched GeoJSON:", data);
        setGeoData(data);
        toast.success("Field area segmented successfully");
      })
      .catch((err) => {
        console.error("Error fetching segmentation:", err);
        toast.error("Failed to process area. Please try again.");
      })
      .finally(() => {
        setIsSegmenting(false);
        setBbox(null);
        getFarms(router);
      });
  };

  const saveFarm = async () => {
    if (!bbox) {
      toast.error("Please draw a field area first");
      return;
    }

    if (!farmName || farmName.trim() === "") {
      toast.error("Please enter a farm name");
      return;
    }

    try {
      const farmer_id = await getFarmerID();
      if (!farmer_id) {
        toast.error("User not authenticated", {
          onClose: () => router.push("/account/login"),
        });
      }

      const selected_area = await saveSelectedArea();
      const selected_area_id = selected_area?.selected_area_id;

      setSaving(true);

      const response = await fetch(`${backendURL}/api/farms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmer_id: farmer_id,
          geometry: geoData?.[0].geometry,
          name: farmName,
          selected_area_id: selected_area_id,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Failed to save farm: ${errorMessage.error}`);
      }

      const result = await response.json();
      console.log(result);
      toast.success(result.message, {
        onClose: () => getFarms(router),
      });
      getFarms(router);
    } catch (err) {
      console.error("Error saving farm:", err);
      if (err instanceof Error) {
        toast.error(err.message || "Failed to save farm. Try again later");
      } else {
        toast.error("Failed to save farm. Try again later");
      }
    } finally {
      setSaving(false);
      setGeoData(undefined);
      setBbox(null);
    }
  };

  const saveSelectedArea = async () => {
    if (!bbox) {
      toast.error("Please draw a field area first");
      return;
    }

    try {
      const farmer_id = await getFarmerID();
      if (!farmer_id) {
        toast.error("User not authenticated", {
          onClose: () => router.push("/account/login"),
        });
        return;
      }

      setSaving(true);

      const response = await fetch(`${backendURL}/api/selected_area`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmer_id: farmer_id,
          geometry: geoData?.[0].geometry,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Failed to save selected area: ${errorMessage.error}`);
      }

      const result: {
        message: string;
        selected_area_id: string;
        farmer_id: string;
        geom: string;
      } = await response.json();
      toast.success(result.message || "Selected area saved successfully");
      return result;
    } catch (err) {
      console.error("Error saving selected area:", err);
      if (err instanceof Error) {
        toast.error(
          err.message || "Failed to save selected area. Try again later"
        );
      } else {
        toast.error("Failed to save selected area. Try again later");
      }
    } finally {
      setSaving(false);
      setGeoData(undefined);
      setBbox(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 relative min-h-[500px]">
      {(segmenting || isAnalyzing) && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
          <span className="text-sm text-gray-700">
            {segmenting
              ? "Segmenting field area..."
              : "Running crop stress analysis..."}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Field Map</h2>
        <div className="flex flex-row gap-4">
          {/* Display All Farms Button */}
          <Button
            variant={showAllFarms ? "destructive" : "outline"}
            onClick={toggleShowAllFarms}
            disabled={segmenting || isAnalyzing}
          >
            <MapIcon className="w-4 h-4 mr-2" />
            {showAllFarms ? "Hide All Farms" : "Show All Farms"}
          </Button>

          <Button
            variant={"landingGreen"}
            onClick={() => {
              setFarmName("");
              setFarmNameModal(true);
            }}
            disabled={!bbox || showAllFarms}
          >
            Save farm
          </Button>

          <Button
            variant={"save"}
            onClick={() => segmentFarm()}
            disabled={segmenting || !bbox || showAllFarms}
          >
            {segmenting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Segmenting...
              </>
            ) : (
              "Segment farm"
            )}
          </Button>

          {/* Crop Stress Analysis Button */}
          <Button
            variant={"destructive"}
            onClick={runCropStressAnalysis}
            disabled={isAnalyzing || !selectedFarm || showAllFarms}
            className="bg-green-600 hover:bg-green-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 mr-2" /> Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {farmNameModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setFarmNameModal(false)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await saveFarm();
              setFarmNameModal(false);
            }}
            className="bg-white rounded-lg shadow-lg p-6 w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="block mb-2 text-gray-700 font-semibold">
              Farm Name
            </label>
            <input
              type="text"
              name="farmName"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Enter farm name"
              required
              className="mb-4 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <div className="flex justify-end gap-4">
              <Button variant={"save"} type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving farm
                  </>
                ) : (
                  "Save farm"
                )}
              </Button>
              <Button
                variant={"landingGreen"}
                type="button"
                onClick={() => setFarmNameModal(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <MapLeaflet />
      <AnalysisLegend />
    </div>
  );
};

export default Map;
