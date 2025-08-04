/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import {
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Droplets,
  Leaf,
  Cloud,
} from "lucide-react";
import { toast } from "react-toastify";
import { counties, constituencies } from "kenya";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import useDashboardStore from "@/stores/useDashboardStore";
import { useRouter } from "next/navigation";
import { feature } from "@/types/geometry";
import { deleteFarm, saveFarmFromSegment } from "@/lib/farm";
import { getAnalysis, getAvailableCrops } from "@/app/actions/actions";

const MiniMap = dynamic(() => import("@/components/MiniMap"), { ssr: false });

// Import the AnalysisModal component (you'll need to create this file)
import AnalysisModal from "./AnalysisModal";

// Define the types for county, sub-county, and ward
interface County {
  name: string;
  code: string;
  center: {
    lat: number;
    lon: number;
  };
  constituencies: { name: string; code: string }[];
}

interface SubCounty {
  name: string;
  code: string;
  center: {
    lat: number;
    lon: number;
  };
  wards: { name: string; code: string; center: { lat: number; lon: number } }[];
}

interface Ward {
  name: string;
  code: string;
  center: {
    lat: number;
    lon: number;
  };
}

interface Crop {
  id: string;
  name: string;
}

type analysisData = {
  id: string;
  analysis_date: string;
  analysis_data: {
    crop_stress: number;
    soil_carbon: number;
    soil_moisture: number;
    weather: {
      temperature: number;
      humidity: number;
      wind_speed: number;
      precipitation: number;
    };
  }[];
};

// Collapsible Section Component
const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = false,
  disabled = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => !disabled && setIsExpanded(!isExpanded)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-t-lg ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className="font-medium text-gray-700">{title}</span>
        {!disabled &&
          (isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
      </button>
      {isExpanded && (
        <div className="p-3 border-t bg-gray-50/30">{children}</div>
      )}
    </div>
  );
};

const MapLayers = ({ className }: { className?: string }) => {
  const {
    setLat,
    setLong,
    segmenting,
    farms,
    selectedFarm,
    setSelectedFarm,
    getFarms,
    createdSegments,
    setCreatedSegments,
  } = useDashboardStore();
  const router = useRouter();

  const [allCounties, setAllCounties] = useState<County[]>([]);
  const [allConstituencies, setAllConstituencies] = useState<SubCounty[]>([]);
  const [allWards, setAllWards] = useState<Ward[]>([]);

  const [loadingCounties, setLoadingCounties] = useState(false);
  const [loadingConstituencies, setLoadingConstituencies] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedSubCounty, setSelectedSubCounty] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCropId, setSelectedCropId] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedFarmName, setEditedFarmName] = useState("");
  const [analysisData, setAnalysisData] = useState<analysisData[]>([]);

  // New state for analysis modal
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [currentAnalysisData, setCurrentAnalysisData] = useState({
    cropStress: [
      {
        cropStress: analysisData[0]?.analysis_data[0]?.crop_stress,
        date: analysisData[0]?.analysis_date,
      },
    ],
    soilMoisture: [
      {
        soilMoisture: analysisData[0]?.analysis_data[0]?.soil_moisture,
        date: analysisData[0]?.analysis_date,
      },
    ],
    soilCarbon: [
      {
        soilCarbon: analysisData[0]?.analysis_data[0]?.soil_carbon,
        date: analysisData[0]?.analysis_date,
      },
    ],
    weather: [
      {
        weather: analysisData[0]?.analysis_data[0]?.weather,
        date: analysisData[0]?.analysis_date,
      },
    ],
  });

  useEffect(() => {
    if (selectedFarm) setEditedFarmName(selectedFarm.name || "");
  }, [selectedFarm]);

  const handleUpdateFarm = async () => {
    if (!selectedFarm) return;
    const result = await saveFarmFromSegment(
      selectedFarm,
      editedFarmName,
      selectedCropId
    );
    if (result) {
      getFarms(router);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteFarm = async (section: "farm" | "segment") => {
    if (!selectedFarm) return;
    if (section === "segment") {
      removeSegment(selectedFarm);
      return;
    }
    const result = await deleteFarm(selectedFarm);
    if (result) {
      getFarms(router);
      setSelectedFarm(undefined);
    }
  };

  const removeSegment = (seg: feature) => {
    if (!createdSegments) return;
    const updatedSegments = createdSegments.filter(
      (segment) => segment.id !== seg.id
    );
    setCreatedSegments(updatedSegments);
  };

  const getCrops = async () => {
    const data = await getAvailableCrops();
    setCrops(data);
  };

  useEffect(() => {
    setLoadingCounties(true);
    const totalCounties = counties.filter(
      (county) => county.name !== "DIASPORA"
    );

    const sortedCounties = totalCounties.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setAllCounties(sortedCounties);
    setLoadingCounties(false);
    getCrops();
  }, []);

  useEffect(() => {
    setLoadingConstituencies(true);
    const sortedConstituencies = constituencies.sort(
      (a, b) => parseInt(a.code) - parseInt(b.code)
    );
    setAllConstituencies(sortedConstituencies);
    setLoadingConstituencies(false);
  }, []);

  const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCounty(code);
    setSelectedSubCounty("");
    setSelectedWard("");
    setAllWards([]);

    const county = allCounties.find((c) => c.code === code);
    if (county?.center) {
      setLat(county.center.lat);
      setLong(county.center.lon);
    }

    if (county?.constituencies) {
      const names = county.constituencies.map((c) => c.name.toLowerCase());
      const filtered = constituencies
        .filter((c) => names.includes(c.name.toLowerCase()))
        .sort((a, b) => parseInt(a.code) - parseInt(b.code));
      setAllConstituencies(filtered);
    } else {
      setAllConstituencies([]);
    }
  };

  const handleSubCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedSubCounty(code);
    setSelectedWard("");
    setLoadingWards(true);

    const SubCounty = allConstituencies.find((c) => c.code === code);
    if (SubCounty?.center) {
      setLat(SubCounty.center.lat);
      setLong(SubCounty.center.lon);
    }

    if (SubCounty?.wards) {
      setAllWards(SubCounty.wards);
      setLoadingWards(false);
    } else {
      setAllWards([]);
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedWard(code);

    const ward = allWards.find((w) => w.code === code);
    if (ward?.center) {
      setLat(ward.center.lat);
      setLong(ward.center.lon);
    }
  };

  const getCropAnalysis = async () => {
    let data = analysisData;

    if (!data || data.length === 0) {
      data = await getComprehensiveAnalysis(selectedFarm?.id);
    }

    const cropStressData = data.map((analysis) => {
      return {
        cropStress: analysis.analysis_data[0].crop_stress,
        date: analysis.analysis_date,
      };
    });

    // Set the analysis data and open modal
    setCurrentAnalysisData((prev) => ({
      ...prev,
      cropStress: cropStressData,
    }));
    setIsAnalysisModalOpen(true);

    return cropStressData;
  };

  const getSoilMoistureAnalysis = async () => {
    let data = analysisData;

    if (!data || data.length === 0) {
      data = await getComprehensiveAnalysis(selectedFarm?.id);
    }

    const soilMoistureData = data.map((analysis) => {
      return {
        soilMoisture: analysis.analysis_data[0].soil_moisture,
        date: analysis.analysis_date,
      };
    });

    setCurrentAnalysisData((prev) => ({
      ...prev,
      soilMoisture: soilMoistureData,
    }));
    setIsAnalysisModalOpen(true);

    return soilMoistureData;
  };

  const getSoilCarbonAnalysis = async () => {
    let data = analysisData;

    if (!data || data.length === 0) {
      data = await getComprehensiveAnalysis(selectedFarm?.id);
    }

    const soilCarbonData = data.map((analysis) => {
      return {
        soilCarbon: analysis.analysis_data[0].soil_carbon,
        date: analysis.analysis_date,
      };
    });

    setCurrentAnalysisData((prev) => ({
      ...prev,
      soilCarbon: soilCarbonData,
    }));
    setIsAnalysisModalOpen(true);

    return soilCarbonData;
  };

  const getWeatherAnalysis = async () => {
    let data = analysisData;

    if (!data || data.length === 0) {
      data = await getComprehensiveAnalysis(selectedFarm?.id);
    }

    const weatherData = data.map((analysis) => {
      return {
        weather: analysis.analysis_data[0].weather,
        date: analysis.analysis_date,
      };
    });

    setCurrentAnalysisData((prev) => ({
      ...prev,
      weather: weatherData,
    }));
    setIsAnalysisModalOpen(true);

    return weatherData;
  };

  const getComprehensiveAnalysis = async (
    farmId: string | undefined | number
  ) => {
    if (!farmId) {
      toast.error("No farm selected");
      return [];
    }
    const data = await getAnalysis(farmId);
    setAnalysisData(data);

    // If called from the comprehensive button, prepare all data and open modal
    if (data && data.length > 0) {
      const cropStressData = data.map((analysis) => ({
        cropStress: analysis.analysis_data[0].crop_stress,
        date: analysis.analysis_date,
      }));

      const soilMoistureData = data.map((analysis) => ({
        soilMoisture: analysis.analysis_data[0].soil_moisture,
        date: analysis.analysis_date,
      }));

      const soilCarbonData = data.map((analysis) => ({
        soilCarbon: analysis.analysis_data[0].soil_carbon,
        date: analysis.analysis_date,
      }));

      const weatherData = data.map((analysis) => ({
        weather: analysis.analysis_data[0].weather,
        date: analysis.analysis_date,
      }));

      setCurrentAnalysisData({
        cropStress: cropStressData,
        soilMoisture: soilMoistureData,
        soilCarbon: soilCarbonData,
        weather: weatherData,
      });
    }

    return data || [];
  };

  const handleComprehensiveReport = async () => {
    await getComprehensiveAnalysis(selectedFarm?.id);
    setIsAnalysisModalOpen(true);
  };

  //Styling for the individual dropdowns
  const dropdownClasses = "flex flex-col w-full";

  //Styling for the select input fields
  const selectClasses =
    "mt-1 p-2 border rounded-md disabled:cursor-not-allowed disabled:bg-gray-100";

  return (
    <div className={`${className} bg-white rounded-lg shadow p-4 space-y-4`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Map Layers</h2>

      {/* Farm Management Section - Expanded by default */}
      <CollapsibleSection title="Farm Management" defaultExpanded={true}>
        <div className="space-y-4">
          {/* Farms dropdown */}
          <div className={dropdownClasses}>
            <select
              className={selectClasses}
              value={selectedFarm?.id || ""}
              onChange={(e) => {
                const selected = farms.find(
                  (farm) => farm.id === e.target.value
                );
                setSelectedFarm(selected);
              }}
              disabled={farms.length === 0}
            >
              {farms.length === 0 ? (
                <option>No farms to display</option>
              ) : (
                <>
                  <option value={""}>Select farm</option>
                  {farms.map((farm) => {
                    return (
                      <option key={farm.id} value={farm.id}>
                        {farm.name || `Farm ${farm.id}`}
                      </option>
                    );
                  })}
                </>
              )}
            </select>
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex justify-between gap-2">
            <Button
              disabled={!selectedFarm}
              variant={"edit"}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit {selectedFarm?.name || "Segment"}
            </Button>
            <Button
              disabled={!selectedFarm}
              variant={"delete"}
              onClick={() =>
                handleDeleteFarm(selectedFarm?.name ? "farm" : "segment")
              }
            >
              Delete {selectedFarm?.name || "Segment"}
            </Button>
          </div>
        </div>
      </CollapsibleSection>

      {/* Reports Section - Expanded by default */}
      <CollapsibleSection title="Reports & Analytics" defaultExpanded={true}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center justify-center gap-2 p-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-md text-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedFarm}
              onClick={getCropAnalysis}
            >
              <Leaf size={16} />
              Crop Analysis
            </button>

            <button
              className="flex items-center justify-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md text-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedFarm}
              onClick={getSoilMoistureAnalysis}
            >
              <Droplets size={16} />
              Soil Moisture
            </button>

            <button
              className="flex items-center justify-center gap-2 p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md text-amber-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedFarm}
              onClick={getSoilCarbonAnalysis}
            >
              <FileText size={16} />
              Soil Carbon
            </button>

            <button
              className="flex items-center justify-center gap-2 p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md text-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedFarm}
              onClick={getWeatherAnalysis}
            >
              <Cloud size={16} />
              Weather
            </button>
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-900 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedFarm}
            onClick={handleComprehensiveReport}
          >
            <Download size={18} />
            Download Complete Report
          </button>

          {!selectedFarm && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Select a farm to generate reports
            </p>
          )}
        </div>
      </CollapsibleSection>

      {/* Location Settings Section - Collapsed by default */}
      <CollapsibleSection
        title="Location Settings"
        defaultExpanded={false}
        disabled={segmenting}
      >
        <div className="space-y-4">
          <div className={dropdownClasses}>
            <select
              name="county"
              className={selectClasses}
              disabled={segmenting}
              onChange={handleCountyChange}
            >
              <option value={""}>Select County</option>
              {loadingCounties ? (
                <option>Loading...</option>
              ) : (
                allCounties.map((county) => {
                  return (
                    <option key={county.code} value={county.code}>
                      {county.name.charAt(0) +
                        county.name.slice(1).toLowerCase()}
                    </option>
                  );
                })
              )}
            </select>
          </div>
          <div className={dropdownClasses}>
            <select
              name="SubCounty"
              className={selectClasses}
              onChange={handleSubCountyChange}
              disabled={!selectedCounty || segmenting}
            >
              <option value={""}>Select Sub-County</option>
              {loadingConstituencies ? (
                <option>Loading...</option>
              ) : (
                allConstituencies.map((SubCounty) => {
                  return (
                    <option key={SubCounty.code} value={SubCounty.code}>
                      {SubCounty.name.charAt(0) +
                        SubCounty.name.slice(1).toLowerCase()}
                    </option>
                  );
                })
              )}
            </select>
          </div>
          <div className={dropdownClasses}>
            <select
              name="ward"
              className={selectClasses}
              onChange={handleWardChange}
              disabled={!selectedSubCounty || segmenting}
            >
              <option value={""}>Select Ward</option>
              {loadingWards ? (
                <option>Loading...</option>
              ) : (
                allWards.map((ward) => {
                  return (
                    <option key={ward.code} value={ward.code}>
                      {ward.name.charAt(0).toUpperCase() +
                        ward.name.slice(1).toLowerCase()}
                    </option>
                  );
                })
              )}
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Map Controls Section - Collapsed by default */}
      <CollapsibleSection title="Map Controls" defaultExpanded={false}>
        <div className="space-y-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full rounded-md border-gray-300"
              />
              <input
                type="date"
                className="w-full rounded-md border-gray-300"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={segmenting}
          >
            <RefreshCcw size={18} />
            Update Map
          </button>
        </div>
      </CollapsibleSection>

      {/* Edit Modal */}
      {isEditModalOpen && selectedFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            {/* MiniMap component goes here */}
            <div className="mb-4">
              <MiniMap farm={selectedFarm} />
            </div>

            <label className="block text-sm mb-2 font-medium">
              Crop Planted
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
            >
              <option value="">Select Crop</option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
            <label className="block text-sm mb-2 font-medium">Farm Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={editedFarmName}
              onChange={(e) => setEditedFarmName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateFarm()}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {selectedFarm && (
        <AnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          farm={selectedFarm}
          analysisData={currentAnalysisData}
        />
      )}
    </div>
  );
};

export default MapLayers;
