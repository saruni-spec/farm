/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { counties, constituencies } from "kenya";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import useDashboardStore from "@/stores/useDashboardStore";
import { useRouter } from "next/navigation";
import { feature } from "@/types/geometry";
import { deleteFarm, saveFarmFromSegment } from "@/lib/farm";
import { getAvailableCrops } from "@/app/actions/actions";
const MiniMap = dynamic(() => import("@/components/MiniMap"), { ssr: false });

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

const MapLayers = () => {
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
  const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
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
    const sortedCounties = totalCounties.sort(
      (a, b) => parseInt(a.code) - parseInt(b.code)
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

  //Styling for the individual dropdowns
  const dropdownClasses = "flex flex-col w-full";

  //Styling for the select input fields
  const selectClasses =
    "mt-1 p-2 border rounded-md disabled:cursor-not-allowed disabled:bg-gray-100";

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Map Layers</h2>

      {/* Location selectors */}
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
                  {county.name.charAt(0) + county.name.slice(1).toLowerCase()}
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

      {/* Farms dropdown */}
      <div className={dropdownClasses}>
        <select
          className={selectClasses}
          value={selectedFarm?.id || ""}
          onChange={(e) => {
            const selected = farms.find((farm) => farm.id === e.target.value);
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

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Date Range</label>
        <div className="flex gap-2">
          <input type="date" className="w-full rounded-md border-gray-300" />
          <input type="date" className="w-full rounded-md border-gray-300" />
        </div>
      </div>

      {/* Update Button */}
      <button
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-2 disabled:cursor-not-allowed disabled:bg-blue-300"
        disabled={segmenting}
      >
        <RefreshCcw size={18} />
        Update Map
      </button>

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
    </div>
  );
};

export default MapLayers;
