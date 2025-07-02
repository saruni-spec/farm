/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/superbase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AnalysisCards from "./components/Analysis Cards";
import ManagementZones from "./components/Management Zones";
import Map from "./components/Map";
import MapLayers from "./components/Map Layers";

const Dashboard = () => {
  const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Position coordinates to be updated when the locations are selected. Defaulting it to Nairobi county
  const [lat, setLat] = useState<number>(-1.286389);
  const [long, setLong] = useState<number>(36.817223);

  //State to disable the county, sub-county and ward dropdowns when the field is being segmented
  const [segmenting, setIsSegmenting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);

  const router = useRouter();

  const getFarmerID = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    // Getting the ID of the farmer
    const farmer_id = data?.session?.user.id;

    return farmer_id;
  };

  //Fetching the farmer's farms
  const getFarms = async () => {
    try {
      //Getting the farmer ID
      const farmerID = await getFarmerID();

      //If not authenticated, redirect to login
      if (!farmerID) {
        toast.error("User not authenticated", {
          onClose: () => router.push("/account/login"),
        });
      }

      //Sending the GET request to the backend
      const response = await fetch(
        `${backendURL}/api/farms?farmer_id=${farmerID}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch farms");
      }

      const result = await response.json();

      setFarms(result.features);
    } catch (err) {
      console.error("Error fetching farms:", err);
      toast.error("Failed to fetch farms");
    }
  };

  useEffect(() => {
    getFarms();
  }, []);

  return (
    <div className="py-22 px-3 text-black">
      <AnalysisCards />
      <div className="flex flex-col lg:flex-row gap-3 mt-3">
        <div className="lg:w-2/3">
          <Map
            lat={lat}
            long={long}
            segmenting={segmenting}
            setIsSegmenting={setIsSegmenting}
            saving={saving}
            setSaving={setSaving}
            selectedFarm={selectedFarm}
            getFarms={getFarms}
            farms={farms}
            setSelectedFarm={setSelectedFarm}
          />
        </div>
        <div className="lg:w-1/3 space-y-4">
          <MapLayers
            setLat={setLat}
            setLong={setLong}
            segmenting={segmenting}
            farms={farms}
            selectedFarm={selectedFarm}
            setSelectedFarm={setSelectedFarm}
          />
          <ManagementZones />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
